package com.carpick.global.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestConfig {

    @Bean // 스프링이 시작될 때 이 메서드를 실행해 RestTemplate 객체를 생성하고 관리함
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
