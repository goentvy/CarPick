package com.carpick.reservation.service;
import com.carpick.domain.reservation.dtoV2.request.ReservationFormRequestDtoV2;
import com.carpick.domain.reservation.dtoV2.response.ReservationFormResponseDtoV2;
import com.carpick.domain.reservation.enums.RentType;
import com.carpick.domain.reservation.service.v2.ReservationFormServiceV2;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

// 1. 통합 테스트: 스프링 컨테이너를 진짜로 띄움
@SpringBootTest(properties = {
        // OAuth 관련 설정 에러 방지용 (Dummy 값 주입)
        "KAKAO_CLIENT_ID=dummy", "KAKAO_REDIRECT_URI=http://dummy", "KAKAO_CLIENT_SECRET=dummy",
        "kakao.client-id=dummy", "kakao.redirect-uri=http://dummy", "kakao.client-secret=dummy",
        "GOOGLE_CLIENT_ID=dummy", "GOOGLE_REDIRECT_URI=http://dummy", "GOOGLE_CLIENT_SECRET=dummy",
        "google.client-id=dummy", "google.redirect-uri=http://dummy", "google.client-secret=dummy",
        "NAVER_CLIENT_ID=dummy", "NAVER_REDIRECT_URI=http://dummy", "NAVER_CLIENT_SECRET=dummy",
        "naver.client-id=dummy", "naver.redirect-uri=http://dummy", "naver.client-secret=dummy"
})
@Transactional // 테스트 끝나면 DB 롤백 (데이터 오염 방지)
public class ReservationFormServiceV2IntegrationTest {

    @Autowired
    private ReservationFormServiceV2 formService; // 진짜 서비스 주입

    @Test
    @DisplayName("예약 폼 화면 조회 - 실제 DB 연결 테스트")
    void testGetReservationForm_RealDB() {
        // [1] GIVEN: DB에 실제로 존재하는 ID들을 넣어야 합니다!
        // (본인 DB의 car_spec 테이블, branch 테이블에 있는 ID 확인 후 수정하세요)
        Long realSpecId = 1L;         // <-- 존재하는 차량 스펙 ID
        Long realBranchId = 1L;       // <-- 존재하는 지점 ID

        ReservationFormRequestDtoV2 request = new ReservationFormRequestDtoV2();
        request.setSpecId(realSpecId);
        request.setPickupBranchId(realBranchId);
        request.setRentType(RentType.SHORT);
        request.setStartAt(LocalDateTime.now().plusDays(1)); // 내일
        request.setEndAt(LocalDateTime.now().plusDays(2));   // 모레 (24시간)

        System.out.println("================= [테스트 시작] =================/n");

        // [2] WHEN: 진짜 서비스 호출 (내부에서 진짜 Mapper, 진짜 계산기 다 돌아감)
        ReservationFormResponseDtoV2 response = formService.getReservationForm(request);

        // [3] THEN: 눈으로 결과 확인 (로그 출력)
        System.out.println("차량 모델명: " + response.getCar().getTitle());
        System.out.println("지점 이름: " + response.getPickupLocation().getBranchName());
        System.out.println("기본 대여료: " + response.getPaymentSummary().getBasePrice());
        System.out.println("최종 결제액: " + response.getPaymentSummary().getFinalTotalPrice());

        System.out.println("\n================= [테스트 종료] =================");
    }
}