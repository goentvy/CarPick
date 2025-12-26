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

    	if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }
    	
        try {
            String token = jwtProvider.resolveToken(request);

            if (token != null) {
                jwtProvider.validateToken(token); // 여기서 예외 발생

                Long userId = jwtProvider.getUserId(token);

                UserInfo user = userInfoMapper.selectByUserId(userId);
                if (user == null) {
                    throw new AuthenticationException(AUTH_USER_NOT_FOUND);
                }

                // 4. 🔥 탈퇴 회원 검증 로직을 필터 내부로 통합
                // 유저가 없거나, deletedAt 값이 존재한다면 탈퇴한 회원으로 간주
                if (user == null || user.getDeletedAt() != null) {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json;charset=UTF-8");
                    response.getWriter().write("{\"message\": \"인증되지 않은 사용자이거나 탈퇴한 회원입니다.\"}");
                    return; // 필터 체인 중단 (강제 로그아웃 효과)
                }

                // 5. 인증 객체 생성 및 SecurityContext 등록
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

                SecurityContextHolder.getContext()
                        .setAuthentication(authentication);
            }

            filterChain.doFilter(request, response);

        } catch (AuthenticationException e) {
            SecurityContextHolder.clearContext();
            throw e; // 👉 EntryPoint / GlobalHandler로 위임
        } finally {
            // 아무것도 하지 말 것

        }
    }

}
