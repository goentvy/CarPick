package com.carpick.global.security.filter;

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

    /**
     * ✅ JWT 필터 제외 대상 (운영 기준)
     */
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
        String method = request.getMethod();

        log.debug("[JWT-FILTER] {} {}", method, uri);

        // 1️⃣ JWT 추출
        String token = jwtProvider.resolveToken(request);

        // 2️⃣ 토큰 없음 → 공개 API 또는 비인증 요청
        if (token == null) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // 3️⃣ 토큰 검증
            jwtProvider.validateToken(token);

            // 4️⃣ 사용자 조회
            Long userId = jwtProvider.getUserId(token);
            UserInfo user = userInfoMapper.findById(userId);

            if (user == null) {
                throw new AuthenticationException(ErrorCode.AUTH_USER_NOT_FOUND);
            }

            if (user.getDeletedAt() != null) {
                throw new AuthenticationException(ErrorCode.AUTH_CREDENTIALS_EXPIRED);
            }
// ✅ JWT에서 권한 추출
            String role = jwtProvider.getRole(token);  // "ADMIN" or "USER"

// ✅ Spring Security 형식으로 변환
            String securityRole = "ROLE_" + role;
            // 5️⃣ SecurityContext 등록
            CustomUserDetails userDetails = new CustomUserDetails(
                    user.getUserId(),
                    user.getEmail(),
                    user.getPassword(),
                    securityRole   // 👉 ROLE_ADMIN / ROLE_USE
            );

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            log.info("AUTH = {}", authentication.getAuthorities());
            log.debug("[JWT-AUTH-SUCCESS] userId={}", userId);

            filterChain.doFilter(request, response);

        } catch (AuthenticationException e) {
            SecurityContextHolder.clearContext();
            log.warn("[JWT-AUTH-FAIL] {} {} {}", method, uri, e.getErrorCode().name());
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
            log.error("[JWT-UNKNOWN-ERROR] {} {}", method, uri, e);
            throw new AuthenticationException(ErrorCode.AUTH_TOKEN_INVALID);
        }
    }
}
