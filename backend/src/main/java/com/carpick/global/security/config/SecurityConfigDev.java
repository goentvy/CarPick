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
@EnableWebSecurity   // ⭐ 여기
public class SecurityConfigDev {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtAccessDeniedHandler jwtAccessDeniedHandler;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Bean
    public SecurityFilterChain devFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(s ->
                        s.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth
                        // ✅ 관리자 페이지는 ADMIN만 접근 가능
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                		.requestMatchers(
            		        "/admin/upload/**",
            		        "/upload/**"
            		    ).permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(
                                // 1. API 경로 허용
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
                                "/api/admin/**",
                                "/api/reservation/**",
                                "/api/reviews/latest",
                                "/api/dropzones",
                                "/api/price",
                                "/api/rent/year/details",
                                "/api/v2/reservations/price",
                                "/api/admin/reservation/detail",
                                "/api/admin/price-policies",
                                ("/api/guest/**"),

                        // 2. 관리자 뷰(Admin View) 경로 허용 (추가됨)
                                "/",
                                "/admin/**",
                                // 3. 정적 리소스 경로 허용 (CSS, JS, Images 등 - 추가됨)
                                "/assets/**",
                                "/css/**",
                                "/js/**",
                                "/images/**",
                                "/favicon.ico",
                                
                                // 4. Swagger 및 API 문서 관련
                                "/swagger-ui/**",
                                "/v3/api-docs/**"
                        ).permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                )
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
                "http://localhost:3000",
                "http://localhost:5173",
                "http://localhost:8081",
                "http://localhost:8080",
                "http://127.0.0.1:3000",
                "http://127.0.0.1:5173",
                "http://3.236.8.244",
                "http://3.236.8.244:5173",
                "http://3.236.8.244:8080",
                "http://localhost:5174",
                "http://localhost:5175",
                "https://carpick.p-e.kr",
                "https://admin.carpick.p-e.kr"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}
