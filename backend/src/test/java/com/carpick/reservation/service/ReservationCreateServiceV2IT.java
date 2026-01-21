package com.carpick.reservation.service;

import com.carpick.domain.price.dto.ReservationPriceStatementResponseDto;
import com.carpick.domain.price.mapper.ReservationPriceDetailMapper;
import com.carpick.domain.reservation.dtoV2.request.ReservationCreateRequestDtoV2;
import com.carpick.domain.reservation.dtoV2.response.ReservationCreateResponseDtoV2;
import com.carpick.domain.reservation.entity.Reservation;
import com.carpick.domain.reservation.enums.PickupType;
import com.carpick.domain.reservation.enums.RentType;
import com.carpick.domain.reservation.enums.ReservationStatus;
import com.carpick.domain.reservation.enums.ReturnTypes;
import com.carpick.domain.reservation.mapper.ReservationReadMapperV2;
import com.carpick.domain.reservation.service.v2.ReservationCreateServiceV2;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest(properties = {
        // OAuth 더미 (ReservationReadServiceV2Test와 동일)
        "KAKAO_CLIENT_ID=dummy",
        "KAKAO_REDIRECT_URI=http://dummy",
        "KAKAO_CLIENT_SECRET=dummy",
        "kakao.client-id=dummy",
        "kakao.redirect-uri=http://dummy",
        "kakao.client-secret=dummy",
        "kakao.clientId=dummy",
        "kakao.redirectUri=http://dummy",

        "GOOGLE_CLIENT_ID=dummy",
        "GOOGLE_REDIRECT_URI=http://dummy",
        "GOOGLE_CLIENT_SECRET=dummy",
        "google.client-id=dummy",
        "google.redirect-uri=http://dummy",
        "google.client-secret=dummy",

        "NAVER_CLIENT_ID=dummy",
        "NAVER_REDIRECT_URI=http://dummy",
        "NAVER_CLIENT_SECRET=dummy",
        "naver.client-id=dummy",
        "naver.redirect-uri=http://dummy",
        "naver.client-secret=dummy"
})
@Transactional
class ReservationCreateServiceV2IT {

    @Autowired
    private ReservationCreateServiceV2 createService;

    @Autowired
    private ReservationReadMapperV2 reservationReadMapperV2;

    @Autowired
    private ReservationPriceDetailMapper reservationPriceDetailMapper;

    @Test
    @DisplayName("예약 생성 성공 → reservationNo로 재조회 + 가격 명세서 저장 검증")
    void createReservation_success_thenReadAndCheckPriceDetail() {
        // [1] GIVEN
        Long specId = 1L;              // 실제 DB에 존재하는 값
        Long pickupBranchId = 1L;      // 실제 DB에 존재하는 값
        Long userId = 2L;              // 회원 예약 테스트

        ReservationCreateRequestDtoV2 req = new ReservationCreateRequestDtoV2();
        req.setSpecId(specId);
        req.setPickupBranchId(pickupBranchId);
        req.setPickupType(PickupType.VISIT);

        req.setReturnType(ReturnTypes.VISIT);
        req.setReturnBranchId(pickupBranchId);

        req.setRentType(RentType.SHORT);
        req.setStartDateTime(LocalDateTime.of(2026, 2, 10, 10, 0));
        req.setEndDateTime(LocalDateTime.of(2026, 2, 11, 10, 0));

        req.setInsuranceCode("NONE");
        req.setAgreement(true);

        ReservationCreateRequestDtoV2.DriverInfoDtoV2 driver = new ReservationCreateRequestDtoV2.DriverInfoDtoV2();
        driver.setLastname("KIM");
        driver.setFirstname("DONGHYUN");
        driver.setPhone("01012345678");
        driver.setEmail("test@test.com");
        driver.setBirth("19920101");
        driver.setPassword("1234");
        req.setDriverInfo(driver);

        // [2] WHEN
        ReservationCreateResponseDtoV2 res =
                createService.createReservation(req, userId);

        // [3] THEN - 응답 검증
        assertThat(res.getReservationNo()).isNotBlank();
        assertThat(res.getSpecId()).isEqualTo(specId);
        assertThat(res.getPaymentSummary()).isNotNull();
        assertThat(res.getPaymentSummary().getFinalTotalPrice()).isGreaterThan(0);

        // [4] THEN - RESERVATION 테이블 재조회
        Reservation saved =
                reservationReadMapperV2.selectReservationByReservationNo(res.getReservationNo());

        assertThat(saved).isNotNull();
        assertThat(saved.getReservationNo()).isEqualTo(res.getReservationNo());

        // WHO
        assertThat(saved.getUserId()).isEqualTo(userId);
        assertThat(saved.getVehicleId()).isNotNull();

        // DRIVER
        assertThat(saved.getDriverLastName()).isEqualTo("KIM");
        assertThat(saved.getDriverFirstName()).isEqualTo("DONGHYUN");
        assertThat(saved.getDriverPhone()).isEqualTo("01012345678");
        assertThat(saved.getDriverEmail()).isEqualTo("test@test.com");
        assertThat(saved.getDriverBirthdate()).isNotNull();

        // WHEN
        assertThat(saved.getStartDate()).isEqualTo(req.getStartDateTime());
        assertThat(saved.getEndDate()).isEqualTo(req.getEndDateTime());

        // WHERE
        assertThat(saved.getPickupBranchId()).isEqualTo(pickupBranchId);
        assertThat(saved.getReturnBranchId()).isEqualTo(pickupBranchId);
        assertThat(saved.getPickupType()).isEqualTo(PickupType.VISIT);
        assertThat(saved.getReturnType()).isEqualTo(ReturnTypes.VISIT);

        // STATUS
        assertThat(saved.getAgreementYn()).isEqualTo("Y");

        assertThat(saved.getReservationStatus()).isEqualTo(ReservationStatus.PENDING);

        // 스냅샷 컬럼
        assertThat(saved.getTotalAmountSnapshot()).isNotNull();
        assertThat(saved.getTotalAmountSnapshot().intValue())
                .isEqualTo(res.getPaymentSummary().getFinalTotalPrice());

        // [5] THEN - 가격 명세서(RESERVATION_PRICE_DETAIL) 조회 검증
        ReservationPriceStatementResponseDto statement =
                reservationPriceDetailMapper.findStatementByReservationId(saved.getReservationId());

        assertThat(statement).isNotNull();
        assertThat(statement.getTotalAmount())
                .isEqualByComparingTo(BigDecimal.valueOf(res.getPaymentSummary().getFinalTotalPrice()));

        assertThat(statement.getPriceType()).isEqualTo("SHORT");
        assertThat(statement.getAppliedDays()).isGreaterThanOrEqualTo(1);
    }

    @Test
    @DisplayName("예약 생성 실패 - DROPZONE인데 dropzoneId 없으면 예외")
    void createReservation_fail_whenDropzoneWithoutId() {
        ReservationCreateRequestDtoV2 req = new ReservationCreateRequestDtoV2();
        req.setSpecId(1L);
        req.setPickupBranchId(1L);
        req.setRentType(RentType.SHORT);
        req.setStartDateTime(LocalDateTime.of(2026, 2, 10, 10, 0));
        req.setEndDateTime(LocalDateTime.of(2026, 2, 11, 10, 0));
        req.setInsuranceCode("NONE");
        req.setAgreement(true);

        req.setReturnType(ReturnTypes.DROPZONE);
        req.setDropzoneId(null);

        ReservationCreateRequestDtoV2.DriverInfoDtoV2 driver = new ReservationCreateRequestDtoV2.DriverInfoDtoV2();
        driver.setLastname("KIM");
        driver.setFirstname("DONGHYUN");
        driver.setPhone("01012345678");
        driver.setEmail("test@test.com");
        driver.setBirth("19920101");
        req.setDriverInfo(driver);

        assertThatThrownBy(() -> createService.createReservation(req, 1L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("dropzoneId");
    }
}
