package com.carpick.domain.about.controller;

import com.carpick.domain.about.dto.AboutDto;
import com.carpick.domain.about.service.AboutService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/about")
@RequiredArgsConstructor // final이 붙은 필드에 대해 생성자를 자동으로 생성해줍니다.
@CrossOrigin(origins = "http://localhost:5173") // 리액트(Vite) 기본 포트로 수정
public class AboutController {

    private final AboutService aboutService;

    @GetMapping("/values")
    public List<AboutDto> getBrandValues() {
        // 실제 데이터 로직은 서비스에서 처리하고, 컨트롤러는 결과만 반환합니다.
        return aboutService.getBrandValues();
    }
}