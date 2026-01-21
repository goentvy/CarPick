package com.carpick.global.security.filter;

import com.carpick.domain.userinfo.entity.UserInfo;
import com.carpick.domain.userinfo.mapper.UserInfoMapper;
import com.carpick.global.exception.AuthenticationException;
import com.carpick.global.exception.enums.ErrorCode;
import com.carpick.global.security.details.CustomUserDetails;
import com.carpick.global.security.jwt.JwtProvider;
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
     * ✅ JWT 필터 제외 경로
     * - OAuth 로그인
     * - 콜백
     * - CORS preflight
     * - 업로드
     */
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        String method = request.getMethod();

        boolean skip =
                "OPTIONS".equalsIgnoreCase(method)
                        || path.startsWith("/admin/upload")
                        || path.startsWith("/upload")
                        || path.startsWith("/api/auth/login/")
                        || path.startsWith("/api/auth/oauth/");

        if (skip) {
            log.debug("[JWT-FILTER-SKIP] {} {}", method, path);
        }

        return skip;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String uri = request.getRequestURI();
        String method = request.getMethod();

        log.debug("[JWT-FILTER-ENTER] {} {}", method, uri);

        try {
            // 1️⃣ JWT 추출
            String token = jwtProvider.resolveToken(request);

            // 2️⃣ 토큰 없는 요청 → 비인증 접근 허용
            if (token == null) {
                log.debug("[JWT-NONE] {} {}", method, uri);
                filterChain.doFilter(request, response);
                return;
            }

            // 3️⃣ 토큰 검증
            try {
                jwtProvider.validateToken(token);
            } catch (Exception e) {
                log.warn("[JWT-INVALID] {}", e.getMessage());
                throw new AuthenticationException(ErrorCode.AUTH_TOKEN_INVALID);
            }

            // 4️⃣ 사용자 조회
            Long userId = jwtProvider.getUserId(token);
            UserInfo user = userInfoMapper.findById(userId);

            if (user == null) {
                log.warn("[JWT-USER-NOT-FOUND] userId={}", userId);
                throw new AuthenticationException(ErrorCode.AUTH_USER_NOT_FOUND);
            }

            if (user.getDeletedAt() != null) {
                log.warn("[JWT-DELETED-USER] userId={}", userId);
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }

            // 5️⃣ SecurityContext 등록
            CustomUserDetails userDetails = new CustomUserDetails(
                    user.getUserId(),
                    user.getEmail(),
                    user.getPassword(),
                    "ROLE_USER"
            );

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            log.debug("[JWT-AUTH-SUCCESS] userId={}", userId);

            // 6️⃣ 다음 필터
            filterChain.doFilter(request, response);

        } catch (AuthenticationException e) {
            SecurityContextHolder.clearContext();
            log.warn("[JWT-AUTH-FAIL] {} {}", method, uri);
            throw e;

        } catch (Exception e) {
            log.error("[JWT-FILTER-ERROR] {} {}", method, uri, e);
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }
}
