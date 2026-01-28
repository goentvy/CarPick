package com.carpick.global.security.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.carpick.global.security.filter.JwtAuthenticationFilter;
import com.carpick.global.security.handler.JwtAccessDeniedHandler;
import com.carpick.global.security.handler.JwtAuthenticationEntryPoint;

import org.springframework.http.HttpMethod;  //  HttpMethod.OPTIONS
import org.springframework.web.cors.CorsConfiguration;  //  CORS
import org.springframework.web.cors.CorsConfigurationSource;  //  CORS
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;  //  CORS

import java.util.Arrays;  //  Arrays.asList

import lombok.RequiredArgsConstructor;

/**
 * 개발 환경용 Spring Security 설정 클래스
 * 모든 API 요청을 허용하여 개발 편의성을 제공
 */
@Configuration
@Profile({"dev", "local"})
@RequiredArgsConstructor
@EnableWebSecurity
public class SecurityConfigDev {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtAccessDeniedHandler jwtAccessDeniedHandler;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Bean
    public SecurityFilterChain devFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(auth -> auth

                        // ============================
                        // 업로드 공개
                        // ============================
                        .requestMatchers(
                                "/admin/upload/**",
                                "/upload/**"
                        ).permitAll()

                        // ============================
                        // 관리자 보호 영역 (우선 적용)
                        // ============================
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/admin/**").hasRole("ADMIN")

                        // ============================
                        // Preflight
                        // ============================
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // ============================
                        // 공개 API + 정적 리소스
                        // ============================
                        .requestMatchers(
                                "/api/branches/**",
                                "/api/dropzones/**",
                                "/api/zone/**",
                                "/api/recommend-cars",
                                "/api/chat/**",
                                "/api/faq/**",
                                "/api/emergency/**",
                                "/api/notice/**",
                                "/api/event/**",
                                "/api/guide/**",
                                "/api/auth/**",
                                "/api/about/values",
                                "/api/cars/**",
                                "/api/ai-pick/**",
                                "/api/reservation/**",
                                "/api/reviews/latest",
                                "/api/price",
                                "/api/rent/year/details",
                                "/api/v2/reservations/price",
                                "/api/guest/**",

                                "/",
                                "/assets/**",
                                "/css/**",
                                "/js/**",
                                "/images/**",
                                "/favicon.ico",

                                "/swagger-ui/**",
                                "/v3/api-docs/**"
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
    CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOriginPatterns(Arrays.asList(
                "http://localhost:*",
                "http://127.0.0.1:*",
                "http://3.236.8.244:*",
                "https://carpick.p-e.kr",
                "https://admin.carpick.p-e.kr"
        ));

        configuration.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "OPTIONS"
        ));

        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}
