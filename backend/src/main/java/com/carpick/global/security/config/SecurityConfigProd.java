package com.carpick.global.security.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.carpick.global.security.filter.JwtAuthenticationFilter;
import com.carpick.global.security.handler.JwtAccessDeniedHandler;
import com.carpick.global.security.handler.JwtAuthenticationEntryPoint;

import lombok.RequiredArgsConstructor;

/**
 * 운영 환경용 Spring Security 설정 클래스
 * JWT 기반 인증을 사용하며 Swagger 접근을 차단
 */
@Configuration
@Profile("prod")
@RequiredArgsConstructor
public class SecurityConfigProd {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtAccessDeniedHandler jwtAccessDeniedHandler;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Bean
    public SecurityFilterChain prodFilterChain(HttpSecurity http) throws Exception {

        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(auth -> auth

                        // ============================
                        // Preflight
                        // ============================
                        .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()

                        // ============================
                        // 업로드 공개
                        // ============================
                        .requestMatchers(
                                "/admin/upload/**",
                                "/upload/**"
                        ).permitAll()

                        // ============================
                        // 관리자 영역 (🔥 최우선 보호)
                        // ============================
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/admin/**").hasRole("ADMIN")

                        // ============================
                        // 공개 API + 정적 리소스
                        // ============================
                        .requestMatchers(
                                "/api/branches/**",
                                "/api/dropzones/**",
                                "/api/recommend-cars",
                                "/api/chat/**",
                                "/api/faq/**",
                                "/api/emergency/**",
                                "/api/notice/**",
                                "/api/guide/**",
                                "/api/event/**",
                                "/api/auth/**",
                                "/api/about/values",
                                "/api/cars/**",

                                "/",
                                "/assets/**",
                                "/css/**",
                                "/js/**",
                                "/images/**",
                                "/favicon.ico"
                        ).permitAll()

                        // ============================
                        // 나머지는 인증 필요
                        // ============================
                        .anyRequest().authenticated()
                )

                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)

                .exceptionHandling(e -> e
                        .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                        .accessDeniedHandler(jwtAccessDeniedHandler)
                );

        return http.build();
    }

    @Bean
    public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {

        var config = new org.springframework.web.cors.CorsConfiguration();

        config.setAllowedOrigins(java.util.List.of(
                "https://carpick.p-e.kr",
                "https://admin.carpick.p-e.kr"
        ));

        config.setAllowedMethods(java.util.List.of(
                "GET", "POST", "PUT", "DELETE", "OPTIONS"
        ));

        config.setAllowedHeaders(java.util.List.of("*"));
        config.setAllowCredentials(true);

        var source = new org.springframework.web.cors.UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }
}