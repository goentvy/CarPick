package com.carpick.global.security.filter;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

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

import static com.carpick.global.enums.ErrorCode.AUTH_USER_NOT_FOUND;

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

        try {
            String token = jwtProvider.resolveToken(request);

            if (token != null) {
                jwtProvider.validateToken(token); // 여기서 예외 발생

                Long userId = jwtProvider.getUserId(token);

                UserInfo user = userInfoMapper.selectByUserId(userId);
                if (user == null) {
                    throw new AuthenticationException(AUTH_USER_NOT_FOUND);
                }

                String role = jwtProvider.getRole(token);
                
                CustomUserDetails userDetails =
                        new CustomUserDetails(
                                user.getUserId(),
                                user.getEmail(),
                                user.getPasswordHash(),
                                role
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
