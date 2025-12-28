package com.carpick.global.security.filter;

import com.carpick.domain.userinfo.entity.UserInfo;
import com.carpick.domain.userinfo.mapper.UserInfoMapper;
import com.carpick.global.exception.AuthenticationException;
import com.carpick.global.security.details.CustomUserDetails;
import com.carpick.global.security.jwt.JwtProvider;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

import static com.carpick.global.exception.enums.ErrorCode.AUTH_USER_NOT_FOUND;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;
    private final UserInfoMapper userInfoMapper;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String uri = request.getRequestURI();
        String method = request.getMethod();

        // [로그 1] 요청 진입 확인
        System.out.println("\n--- [보안 필터] 요청 감지 ---");
        System.out.println("▶ 경로: " + uri);
        System.out.println("▶ 메서드: " + method);

        // 1. OPTIONS 요청(CORS 사전 검사) 처리
        if ("OPTIONS".equalsIgnoreCase(method)) {
            System.out.println("✅ [CORS] OPTIONS 요청입니다. 즉시 통과 시킵니다.");
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        try {
            // 2. 토큰 추출
            String token = jwtProvider.resolveToken(request);
            System.out.println("🔍 [토큰 확인] 추출된 토큰: " + (token == null ? "없음 (비로그인 상태)" : "있음 (검증 시작)"));

            // 3. 토큰이 없는 경우 (회원가입, 로그인 등)
            if (token == null) {
                System.out.println("🔓 [인증 건너뛰기] 토큰이 없으므로 시큐리티 설정(permitAll)에 따라 통과 시킵니다.");
                filterChain.doFilter(request, response);
                System.out.println("--- [보안 필터] 종료 (비로그인 허용 경로) ---\n");
                return;
            }

            // 4. 토큰 유효성 검증
            try {
                jwtProvider.validateToken(token);
                System.out.println("✅ [검증 성공] 유효한 토큰입니다.");
            } catch (Exception e) {
                System.out.println("❌ [검증 실패] 잘못되었거나 만료된 토큰입니다: " + e.getMessage());
                throw new AuthenticationException(AUTH_USER_NOT_FOUND);
            }

            // 5. 유저 정보 조회 및 탈퇴 확인
            Long userId = jwtProvider.getUserId(token);
            UserInfo user = userInfoMapper.selectByUserId(userId);

            if (user == null) {
                System.out.println("❌ [DB 조회 에러] 토큰은 있으나 해당 유저(ID: " + userId + ")를 DB에서 찾을 수 없습니다.");
                throw new AuthenticationException(AUTH_USER_NOT_FOUND);
            }

            if (user.getDeletedAt() != null) {
                System.out.println("🚫 [차단] 탈퇴한 회원(ID: " + userId + ")의 접근입니다.");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json;charset=UTF-8");
                response.getWriter().write("{\"message\": \"탈퇴한 회원입니다.\"}");
                return;
            }

            // 6. 인증 객체 생성 및 등록
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
            System.out.println("👤 [인증 완료] " + user.getEmail() + " 님의 요청을 승인합니다.");

            // 7. 다음 필터로 진행
            filterChain.doFilter(request, response);
            System.out.println("--- [보안 필터] 종료 (인증 사용자) ---\n");

        } catch (AuthenticationException e) {
            System.err.println("🚨 [보안 예외 발생] " + e.getErrorCode());
            SecurityContextHolder.clearContext();
            throw e;
        } catch (Exception e) {
            System.err.println("🧨 [필터 내부 심각한 오류] 에러 내용: " + e.getMessage());
            e.printStackTrace(); // 어디서 터졌는지 추적 로그 출력
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }
}