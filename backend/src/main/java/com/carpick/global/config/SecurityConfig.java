package com.carpick.global.config;

import com.carpick.global.security.filter.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

	private final JwtAuthenticationFilter jwtFilter;

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

		http
				// CSRF 비활성화
				.csrf(csrf -> csrf.disable())

				// CORS 활성화
				.cors(cors -> {
				})

				// JWT → 세션 미사용
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

				// ⭐ 접근 제어 (핵심)
				.authorizeHttpRequests(auth -> auth
						// 🔓 인증 없이 접근 가능
						.requestMatchers("/api/auth/login", "/api/auth/signup").permitAll()

						// 🆕 🔓 유저 공지사항 API
						.requestMatchers("/api/notice/**").permitAll()

						// 🔐 나머지는 JWT 필요
						.anyRequest().authenticated())

				// JWT 필터
				.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}
}
