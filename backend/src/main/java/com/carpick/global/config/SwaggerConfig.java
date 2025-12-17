package com.carpick.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;

@Configuration
public class SwaggerConfig {

	@Bean
	public OpenAPI openAPI() {
	    return new OpenAPI()
	            .info(new Info()
	                    .title("CarPick API")
	                    .description("CarPick 애플리케이션 API 문서")
	                    .version("1.0.0"));
	}

    
}