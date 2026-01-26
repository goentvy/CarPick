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
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // ✅ 추가
                .csrf(csrf -> csrf.disable())
                .sessionManagement(s ->
                        s.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth


                        .requestMatchers(
                                "/admin/upload/**",
                                "/upload/**"
                        ).permitAll()
                        // ===== 2️⃣ 관리자 API =====
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        // ===== 3️⃣ 관리자 화면 =====
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
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
                                "/favicon.ico",
                                "/swagger-ui/**",
                                "/v3/api-docs/**"
                        ).permitAll()

                        // ✅ 관리자 전용 (여기가 핵심)
                        .requestMatchers(
                                "/api/admin/**",
                                "/admin/**"
                        ).hasRole("ADMIN")
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
    public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
        var config = new org.springframework.web.cors.CorsConfiguration();

        config.setAllowedOrigins(java.util.List.of(
                "http://3.236.8.244",
                "http://3.236.8.244:5137",
                "https://carpick.p-e.kr",
                "https://admin.carpick.p-e.kr"
        ));

        config.setAllowedMethods(java.util.List.of(
                "GET", "POST", "PUT", "DELETE", "OPTIONS"
        ));

        config.setAllowedHeaders(java.util.List.of("*"));
        config.setAllowCredentials(true);


        config.addExposedHeader("Access-Control-Allow-Private-Network");

        var source = new org.springframework.web.cors.UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }


}
