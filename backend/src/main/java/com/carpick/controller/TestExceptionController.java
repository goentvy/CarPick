package com.carpick.controller;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.carpick.global.exception.BusinessException;
import com.carpick.global.exception.ErrorCode;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

@RestController
@Validated
public class TestExceptionController {

	   // 1. 단순 런타임 예외 테스트
    @GetMapping("/runtime")
    public String runtimeError() {
        throw new RuntimeException("강제 RuntimeException 발생!");
    }

    // 2. 비즈니스 예외 테스트
    @GetMapping("/business")
    public String businessError() {
        throw new BusinessException(ErrorCode.INVALID_INPUT_VALUE); 
    }

    // 3. GET → POST로 호출시 MethodNotAllowed 발생 테스트
    @PostMapping("/method")
    public String methodNotAllowed() {
        return "POST OK";
    }

    // 4. Validation 에러 테스트
    @GetMapping("/validation")
    public String validationTest(
            @RequestParam(name = "name") @NotBlank(message = "name은 비어있을 수 없습니다.") String name,
            @RequestParam(name = "age") @Min(value = 1, message = "age는 1 이상이어야 합니다.") int age
    ) {
        return "OK";
    }

    // 5. @Valid + DTO 검증 실패 테스트
    @PostMapping("/dto")
    public String dtoValidationTest(@Valid @RequestBody TestDto dto) {
        return "valid OK";
    }

    // 내부 테스트 DTO
    public record TestDto(
            @NotBlank(message = "title은 필수입니다.")
            String title,

            @Min(value = 0, message = "count는 0 이상이어야 합니다.")
            int count
    ) {}
    
}
