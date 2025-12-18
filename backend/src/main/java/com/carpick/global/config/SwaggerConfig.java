package com.carpick.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;

@Profile("dev")
@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI() {

        String securitySchemeName = "Authorization";

        // 1. 인증 방식 정의 (JWT)
        SecurityScheme securityScheme = new SecurityScheme()
                .name(securitySchemeName)
                .type(SecurityScheme.Type.HTTP)
                .scheme("bearer")
                .bearerFormat("JWT"); // 바로 Authorize에 토큰 입력하면 됨
        // Authorize는 추후 Security 붙이고 토큰 인증에 사용할 버튼

        // 2. 기본 보안 요구사항
        SecurityRequirement securityRequirement =
                new SecurityRequirement().addList(securitySchemeName);

        return new OpenAPI()
                .info(new Info()
                        .title("CarPick API")
                        .description("CarPick 애플리케이션 API 문서")
                        .version("1.0.0"))
                .addSecurityItem(securityRequirement)
                .components(
                        new Components()
                                .addSecuritySchemes(securitySchemeName, securityScheme)
                );
    }
}
