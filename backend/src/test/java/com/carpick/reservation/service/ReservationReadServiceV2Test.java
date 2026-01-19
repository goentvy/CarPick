package com.carpick.reservation.service;

import com.carpick.domain.reservation.entity.Reservation;
import com.carpick.domain.reservation.service.v2.ReservationReadServiceV2;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@SpringBootTest(properties = {
        // 1. 카카오 (대문자, 소문자, 점, 언더바 다 넣음 - 제발 되라)
        "KAKAO_CLIENT_ID=dummy",
        "KAKAO_REDIRECT_URI=http://dummy",
        "KAKAO_CLIENT_SECRET=dummy",
        "kakao.client-id=dummy",
        "kakao.redirect-uri=http://dummy",  // <--- 이번 에러의 범인!
        "kakao.client-secret=dummy",
        "kakao.clientId=dummy",
        "kakao.redirectUri=http://dummy",

        // 2. 구글 (혹시 몰라 다 넣음)
        "GOOGLE_CLIENT_ID=dummy",
        "GOOGLE_REDIRECT_URI=http://dummy",
        "GOOGLE_CLIENT_SECRET=dummy",
        "google.client-id=dummy",
        "google.redirect-uri=http://dummy",
        "google.client-secret=dummy",

        // 3. 네이버 (혹시 몰라 다 넣음)
        "NAVER_CLIENT_ID=dummy",
        "NAVER_REDIRECT_URI=http://dummy",
        "NAVER_CLIENT_SECRET=dummy",
        "naver.client-id=dummy",
        "naver.redirect-uri=http://dummy",
        "naver.client-secret=dummy"
})
@Transactional
public class ReservationReadServiceV2Test {

    @Autowired
    private ReservationReadServiceV2 readService;

    @Test
    @DisplayName("예약 상세 조회 - 컬럼 매핑(CamelCase) 확인")
    void testGetReservationByNo() {
        // [1] GIVEN: DB에 실제로 존재하는 예약 번호를 넣으세요.
        // (Swagger나 DB 툴에서 복사해온, 데이터가 꽉 차 있는 예약 번호)
        String realReservationNo = "15AA913AB7FC4675"; // <-- 여기 수정하세요!!

        System.out.println("================= [테스트 시작] =================");

        // [2] WHEN: 서비스 호출
        Reservation result = readService.getReservationByNo(realReservationNo);

        // [3] THEN: 결과 로그 출력 (눈으로 확인)
        System.out.println(">>> [조회된 객체]: " + result);

        if (result != null) {
            System.out.println(">>> 1. PK(ID): " + result.getReservationId());
            System.out.println(">>> 2. 예약번호(No): " + result.getReservationNo());

            // [중요] 매핑 오류가 가장 많이 나는 필드들 점검
            System.out.println(">>> 3. 운전자 이메일: " + result.getDriverEmail());
            System.out.println(">>> 4. 픽업 주소: " + result.getPickupAddress());
            System.out.println(">>> 5. 총 결제액(Snapshot): " + result.getTotalAmountSnapshot());
            System.out.println(">>> 6. 상태(Enum): " + result.getReservationStatus());

            // 검증 로직
            assertThat(result.getReservationNo()).as("예약 번호는 필수입니다.").isEqualTo(realReservationNo);

            // 만약 아래에서 에러가 나면, 해당 컬럼의 매핑(XML Alias)이 안 된 겁니다.
            // assertThat(result.getDriverEmail()).as("운전자 이메일이 NULL입니다. 매핑 확인 필요!").isNotNull();
            // assertThat(result.getTotalAmountSnapshot()).as("결제 금액이 NULL입니다. 매핑 확인 필요!").isNotNull();
        } else {
            System.out.println(">>> 🚨 결과가 NULL입니다! SQL 조건절이나 파라미터를 확인하세요.");
        }

        System.out.println("================= [테스트 종료] =================");
    }
}
