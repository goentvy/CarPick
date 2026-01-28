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
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String uri = request.getRequestURI();

        log.debug("[JWT-FILTER] {} {}", request.getMethod(), uri);

        String token = jwtProvider.resolveToken(request);

        if (token == null) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            jwtProvider.validateToken(token);

            Long userId = jwtProvider.getUserId(token);
            UserInfo user = userInfoMapper.findById(userId);

            if (user == null) {
                throw new AuthenticationException(ErrorCode.AUTH_USER_NOT_FOUND);
            }

            if (user.getDeletedAt() != null) {
                throw new AuthenticationException(ErrorCode.AUTH_CREDENTIALS_EXPIRED);
            }

            // ============================
            // 🔥 권한 enum 변환 (정석)
            // ============================
            String roleValue = jwtProvider.getRole(token);

            if (roleValue == null) {
                throw new AuthenticationException(ErrorCode.AUTH_TOKEN_INVALID);
            }

            Role role = Role.from(roleValue);

            // ============================
            // Security Context 등록
            // ============================
            CustomUserDetails userDetails = new CustomUserDetails(
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

            log.info("[JWT-AUTH] userId={} role={}", userId, role);

            filterChain.doFilter(request, response);

        } catch (AuthenticationException e) {
            SecurityContextHolder.clearContext();
            throw e;

        } catch (ExpiredJwtException e) {
            throw new AuthenticationException(ErrorCode.AUTH_TOKEN_EXPIRED);

        } catch (SignatureException e) {
            throw new AuthenticationException(ErrorCode.AUTH_TOKEN_SIGNATURE_INVALID);

        } catch (MalformedJwtException e) {
            throw new AuthenticationException(ErrorCode.AUTH_TOKEN_MALFORMED);

        } catch (UnsupportedJwtException e) {
            throw new AuthenticationException(ErrorCode.AUTH_TOKEN_UNSUPPORTED);

        } catch (Exception e) {
            log.error("[JWT-UNKNOWN]", e);
            throw new AuthenticationException(ErrorCode.AUTH_TOKEN_INVALID);
        }
    }
}
