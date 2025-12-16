package com.carpick.test.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/test")
public class ErrorTestController {

	/**
     * 🔐 MVC 403 에러 페이지 테스트
     * - Security 없이 403 발생
     * - templates/error/403.html 렌더링 확인용
     */
    @GetMapping("/403")
    public String test403Page() {
        throw new ResponseStatusException(
            HttpStatus.FORBIDDEN,
            "권한 없음 (403 페이지 테스트)"
        );
    }

    /**
     * 💥 500 Internal Server Error 테스트
     * - NullPointerException 강제 발생
     * - 공통 500 예외 처리 및 로그 출력 확인용
     */
    @GetMapping("/500")
    public void test500() {
        String s = null;
        s.length(); // 💥 NPE 발생
    }
}