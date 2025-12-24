package com.carpick.global.security.filter;

import com.carpick.domain.userinfo.entity.UserInfo;
import com.carpick.domain.userinfo.mapper.UserInfoMapper;
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

        // 1. 요청 헤더에서 토큰 추출
        String token = jwtProvider.resolveToken(request);

        // 2. 토큰이 존재하고 유효한지 검사
        if (token != null && jwtProvider.validateToken(token)) {
            Long userId = jwtProvider.getUserId(token);

            // 3. DB에서 유저 정보 조회
            UserInfo user = userInfoMapper.selectByUserId(userId);

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

            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        // 6. 다음 필터로 진행
        filterChain.doFilter(request, response);
    }
}
