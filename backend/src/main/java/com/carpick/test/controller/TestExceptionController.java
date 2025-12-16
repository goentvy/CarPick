package com.carpick.test.controller;

import java.nio.file.AccessDeniedException;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.carpick.global.exception.BusinessException;
import com.carpick.global.exception.ErrorCode;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

@RestController
@Validated
public class TestExceptionController {

//	모든 예외처리가 정상 작동함을 확인했습니다.
	
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

    // 6. @ModelAttribute 검증 실패 테스트 (BindException)
    @PostMapping("/bind")
    public String bindExceptionTest(@Valid @ModelAttribute TestDto dto) {
        return "bind OK";
    }

    // 7. 필수 파라미터 누락 테스트 (MissingServletRequestParameterException)
    @GetMapping("/missing-param")
    public String missingParameterTest(@RequestParam String required) {
        return "param OK";
    }

    // 8. 타입 불일치 테스트 (MethodArgumentTypeMismatchException)
    @GetMapping("/type-mismatch")
    public String typeMismatchTest(@RequestParam int number) {
        return "type OK";
    }

    // 9. JSON 파싱 실패 테스트 (HttpMessageNotReadableException)
    @PostMapping("/json-parse")
    public String jsonParseTest(@RequestBody TestDto dto) {
        return "json OK";
    }

    // 10. 404 에러 테스트 (NoResourceFoundException을 직접 던지는건 권장되지 않음)

    // 11. 접근 거부 테스트 (AccessDeniedException)
    @GetMapping("/access-denied")
    public String accessDeniedTest() throws AccessDeniedException {
        throw new AccessDeniedException("접근이 거부되었습니다.");
    }

    // 12. 지원하지 않는 Content-Type 테스트 (HttpMediaTypeNotSupportedException)
    @PostMapping("/media-type")
    public String mediaTypeTest(@RequestBody TestDto dto) {
        return "media type OK";
    }

    // 13. 파일 크기 초과 테스트 (MaxUploadSizeExceededException)
    @PostMapping("/file-upload")
    public String fileUploadTest(@RequestParam MultipartFile file) {
        return "upload OK";
    }

    // 14. PersistenceException 테스트
    @GetMapping("/persistence")
    public String persistenceTest() {
        throw new jakarta.persistence.PersistenceException("JPA 매핑 오류 발생!");
    }

    // 15. DataAccessException 테스트
    @GetMapping("/data-access")
    public String dataAccessTest() {
        throw new org.springframework.dao.DataAccessResourceFailureException("데이터베이스 연결 실패!");
    }

    // 16. SQLException 테스트
    @GetMapping("/sql-error")
    public String sqlErrorTest() throws java.sql.SQLException {
        throw new java.sql.SQLException("SQL 실행 오류!");
    }

    // 17. BadSqlGrammarException 테스트
    @GetMapping("/bad-sql")
    public String badSqlTest() {
        throw new org.springframework.jdbc.BadSqlGrammarException("SQL 문법 오류", "SELECT * FROM invalid_table", new java.sql.SQLException("Table not found"));
    }

    // 내부 테스트 DTO
    public record TestDto(
            @NotBlank(message = "title은 필수입니다.")
            String title,

            @Min(value = 0, message = "count는 0 이상이어야 합니다.")
            int count
    ) {}
    
}
