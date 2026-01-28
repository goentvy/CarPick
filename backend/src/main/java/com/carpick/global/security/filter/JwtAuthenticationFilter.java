package com.carpick.global.security.filter;

import com.carpick.domain.auth.entity.Role;
import com.carpick.domain.userinfo.entity.UserInfo;
import com.carpick.domain.userinfo.mapper.UserInfoMapper;
import com.carpick.global.exception.AuthenticationException;
import com.carpick.global.exception.enums.ErrorCode;
import com.carpick.global.security.details.CustomUserDetails;
import com.carpick.global.security.jwt.JwtProvider;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;
    private final UserInfoMapper userInfoMapper;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        String method = request.getMethod();

        return "OPTIONS".equalsIgnoreCase(method)
                || path.startsWith("/api/auth")
                || path.startsWith("/upload")
                || path.startsWith("/admin/upload");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String uri = request.getRequestURI();
        log.debug("[JWT-FILTER] {} {}", request.getMethod(), uri);

        String accessToken = jwtProvider.resolveToken(request);

        if (accessToken == null) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // ===================== ✅ Access Token 정상 =====================
            jwtProvider.validateToken(accessToken);
            authenticate(accessToken);

            filterChain.doFilter(request, response);
            return;

        } catch (ExpiredJwtException e) {

            // ===================== ♻ Access 만료 → Refresh 처리 =====================
            handleRefresh(request, response, filterChain);
            return;

        } catch (SignatureException e) {
            SecurityContextHolder.clearContext();
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;

        } catch (MalformedJwtException e) {
            SecurityContextHolder.clearContext();
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;

        } catch (UnsupportedJwtException e) {
            SecurityContextHolder.clearContext();
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;

        } catch (Exception e) {
            log.error("[JWT-UNKNOWN]", e);
            SecurityContextHolder.clearContext();
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
    }

    // =====================================================
    // ♻ Refresh Token 재발급 처리
    // =====================================================
    private void handleRefresh(HttpServletRequest request,
                               HttpServletResponse response,
                               FilterChain filterChain) throws IOException, ServletException {

        String refreshToken = jwtProvider.resolveRefreshToken(request);

        if (refreshToken == null) {
            SecurityContextHolder.clearContext();
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        try {
            jwtProvider.validateRefreshToken(refreshToken);

            Long userId = jwtProvider.getUserId(refreshToken);
            UserInfo user = userInfoMapper.findById(userId);

            if (user == null || user.getDeletedAt() != null) {
                SecurityContextHolder.clearContext();
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }

            Role role = user.getRole();

            // ✅ 새 Access Token 발급
            String newAccessToken =
                    jwtProvider.generateAccessToken(userId, role.name());

            // ✅ 클라이언트에 전달
            response.setHeader("Authorization", "Bearer " + newAccessToken);

            // ✅ 인증 재설정
            authenticate(newAccessToken);

            log.info("[JWT-REFRESH] userId={} role={}", userId, role);

            filterChain.doFilter(request, response);

        } catch (Exception e) {
            SecurityContextHolder.clearContext();
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        }
    }

    // =====================================================
    // 🔐 인증 세팅
    // =====================================================
    private void authenticate(String token) {

        Long userId = jwtProvider.getUserId(token);

        UserInfo user = userInfoMapper.findById(userId);
        if (user == null) {
            throw new AuthenticationException(ErrorCode.AUTH_USER_NOT_FOUND);
        }

        Role role = Role.from(jwtProvider.getRole(token));

        CustomUserDetails userDetails =
                new CustomUserDetails(
                        user.getUserId(),
                        user.getEmail(),
                        user.getPassword(),
                        role.securityRole()
                );

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );

        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
}
