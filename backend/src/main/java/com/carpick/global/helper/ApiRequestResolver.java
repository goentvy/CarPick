package com.carpick.global.helper;

import java.util.List;

import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;

@Component
public class ApiRequestResolver {

    private static final List<String> API_PREFIXES = List.of(
        "/api",
        "/internal",
        "/actuator"
    );

    public boolean isApiRequest(HttpServletRequest request) {
        String uri = request.getRequestURI();
        return API_PREFIXES.stream()
                .anyMatch(uri::startsWith);
    }
    
}
