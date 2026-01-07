package com.carpick.common.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommonResponse<T> {
    private boolean success;
    private String message;
    private T data;
// 응답용 공통 DTO 만들기
//먼저, Map 대신 사용할 깔끔한 응답 객체를 만듭니다.
    // 데이터 없이 성공 메시지만 보낼 때
    public static <T> CommonResponse<T> success(String message) {
        return new CommonResponse<>(true, message, null);
    }

    // 데이터와 함께 성공 메시지 보낼 때
    public static <T> CommonResponse<T> success(String message, T data) {
        return new CommonResponse<>(true, message, data);
    }

    // 실패 메시지
    public static <T> CommonResponse<T> fail(String message) {
        return new CommonResponse<>(false, message, null);
    }

}
