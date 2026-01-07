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
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.startsWith("/admin/upload")
            || "OPTIONS".equalsIgnoreCase(request.getMethod());
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String uri = request.getRequestURI();
        String method = request.getMethod();


        // 1. OPTIONS 요청(CORS 사전 검사) 처리
        if ("OPTIONS".equalsIgnoreCase(method)) {

            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        try {
            // 2. 토큰 추출
            String token = jwtProvider.resolveToken(request);


            // 3. 토큰이 없는 경우 (회원가입, 로그인 등)
            if (token == null) {

                filterChain.doFilter(request, response);

                return;
            }

            // 4. 토큰 유효성 검증
            try {
                jwtProvider.validateToken(token);

            } catch (Exception e) {

                throw new AuthenticationException(AUTH_USER_NOT_FOUND);
            }

            // 5. 유저 정보 조회 및 탈퇴 확인
            Long userId = jwtProvider.getUserId(token);
            UserInfo user = userInfoMapper.findById(userId);

            if (user == null) {

                throw new AuthenticationException(AUTH_USER_NOT_FOUND);
            }

            if (user.getDeletedAt() != null) {

                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json;charset=UTF-8");

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


            // 7. 다음 필터로 진행
            filterChain.doFilter(request, response);


        } catch (AuthenticationException e) {

            SecurityContextHolder.clearContext();
            throw e;
        } catch (Exception e) {

            e.printStackTrace(); // 어디서 터졌는지 추적 로그 출력
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }
}