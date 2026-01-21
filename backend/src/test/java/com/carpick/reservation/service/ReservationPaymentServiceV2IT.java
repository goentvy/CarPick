package com.carpick.reservation.service;

import com.carpick.domain.payment.enums.PayStatus;
import com.carpick.domain.payment.vo.PaymentVerificationVo;
import com.carpick.domain.reservation.dtoV2.request.ReservationCreateRequestDtoV2;
import com.carpick.domain.reservation.dtoV2.request.ReservationPaymentRequestDtoV2;
import com.carpick.domain.reservation.dtoV2.response.ReservationCreateResponseDtoV2;
import com.carpick.domain.reservation.enums.PickupType;
import com.carpick.domain.reservation.enums.RentType;
import com.carpick.domain.reservation.enums.ReservationStatus;
import com.carpick.domain.reservation.enums.ReturnTypes;
import com.carpick.domain.reservation.mapper.ReservationPaymentMapperV2;
import com.carpick.domain.reservation.service.v2.ReservationCreateServiceV2;
import com.carpick.domain.reservation.service.v2.ReservationPaymentServiceV2;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest(properties = {
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
class ReservationPaymentServiceV2IT {

    @Autowired private ReservationPaymentServiceV2 paymentService;
    @Autowired private ReservationPaymentMapperV2 paymentMapper;

    // ✅ 추가: 예약 생성 서비스 주입
    @Autowired private ReservationCreateServiceV2 reservationCreateService;

    // ⚠️ 테스트 DB에 실제로 존재하는 값으로 맞추셔야 합니다.
    private static final Long TEST_SPEC_ID = 1L;
    private static final Long TEST_BRANCH_ID = 1L;
    private static final String TEST_INSURANCE_CODE = "NONE"; // NONE / STANDARD / FULL 등 (프로젝트 기준)

    // 회원 결제 테스트용: users 테이블에 존재하는 회원 ID
    private static final Long TEST_USER_ID = 2L;

    @Test
    @DisplayName("결제 성공: PENDING + 카드번호 1234* -> APPROVED + 상태 CONFIRMED")
    void processPayment_success_pending_to_confirmed() {
        // GIVEN: 예약 생성
        String reservationNo = createTestReservation(TEST_USER_ID);

        // (선택) 예약 상태가 PENDING인지 확인하고 싶으면
        PaymentVerificationVo before = paymentMapper.selectPaymentInfoForUpdate(reservationNo);
        assertThat(before).isNotNull();
        assertThat(before.getReservationStatus()).isEqualTo(ReservationStatus.PENDING);

        ReservationPaymentRequestDtoV2 req = paymentReq(reservationNo, "1234567812345678");

        // WHEN
        var res = paymentService.processPayment(req, TEST_USER_ID);

        // THEN
        assertThat(res.getStatus()).isEqualTo(PayStatus.APPROVED);
        assertThat(res.getReservationNo()).isEqualTo(reservationNo);

        PaymentVerificationVo after = paymentMapper.selectPaymentInfoForUpdate(reservationNo);
        assertThat(after.getReservationStatus()).isEqualTo(ReservationStatus.CONFIRMED);
    }

    @Test
    @DisplayName("멱등 성공: 이미 CONFIRMED 상태면 재결제 요청도 APPROVED 반환")
    void processPayment_idempotent_when_already_confirmed() {
        // GIVEN: 예약 생성
        String reservationNo = createTestReservation(TEST_USER_ID);

        // 먼저 한 번 결제해서 CONFIRMED로 만든 다음
        var first = paymentService.processPayment(paymentReq(reservationNo, "1234000011112222"), TEST_USER_ID);
        assertThat(first.getStatus()).isEqualTo(PayStatus.APPROVED);

        // WHEN: 재결제 요청(멱등)
        var second = paymentService.processPayment(paymentReq(reservationNo, "1234999911112222"), TEST_USER_ID);

        // THEN
        assertThat(second.getStatus()).isEqualTo(PayStatus.APPROVED);

        PaymentVerificationVo after = paymentMapper.selectPaymentInfoForUpdate(reservationNo);
        assertThat(after.getReservationStatus()).isEqualTo(ReservationStatus.CONFIRMED);
    }

    @Test
    @DisplayName("결제 거절: 카드번호가 1234로 시작하지 않으면 DECLINED + 상태 CANCELED 처리")
    void processPayment_declined_then_cancel() {
        // GIVEN: 예약 생성
        String reservationNo = createTestReservation(TEST_USER_ID);

        // WHEN
        var res = paymentService.processPayment(paymentReq(reservationNo, "9999888877776666"), TEST_USER_ID);

        // THEN
        assertThat(res.getStatus()).isEqualTo(PayStatus.DECLINED);

        PaymentVerificationVo after = paymentMapper.selectPaymentInfoForUpdate(reservationNo);
        assertThat(after.getReservationStatus()).isEqualTo(ReservationStatus.CANCELED);
    }

    @Test
    @DisplayName("권한 실패: 회원 userId가 예약 userId와 다르면 ERROR")
    void processPayment_forbidden_user_mismatch() {
        // GIVEN: 예약 생성(회원)
        String reservationNo = createTestReservation(TEST_USER_ID);

        Long wrongUserId = TEST_USER_ID + 999999L;

        // WHEN
        var res = paymentService.processPayment(paymentReq(reservationNo, "1234555566667777"), wrongUserId);

        // THEN
        assertThat(res.getStatus()).isEqualTo(PayStatus.ERROR);

        // 권한 실패는 상태 변경이 일어나면 안 됩니다(= PENDING 유지)
        PaymentVerificationVo after = paymentMapper.selectPaymentInfoForUpdate(reservationNo);
        assertThat(after.getReservationStatus()).isEqualTo(ReservationStatus.PENDING);
    }

    // =========================
    // ✅ 핵심: 새 DTO 구조로 예약 생성
    // =========================
    private String createTestReservation(Long userId) {
        ReservationCreateRequestDtoV2 req = new ReservationCreateRequestDtoV2();

        req.setSpecId(TEST_SPEC_ID);

        // 날짜는 테스트 때마다 겹치지 않게 "가까운 미래"로
        LocalDateTime start = LocalDateTime.now().plusDays(1).withHour(10).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime end = start.plusDays(1);

        req.setStartDateTime(start);
        req.setEndDateTime(end);

        req.setRentType(RentType.SHORT);

        req.setPickupBranchId(TEST_BRANCH_ID);
        req.setPickupType(PickupType.VISIT);

        req.setReturnType(ReturnTypes.VISIT);
        req.setReturnBranchId(TEST_BRANCH_ID);

        req.setInsuranceCode(TEST_INSURANCE_CODE);

        ReservationCreateRequestDtoV2.DriverInfoDtoV2 driver = new ReservationCreateRequestDtoV2.DriverInfoDtoV2();
        driver.setLastname("테스트");
        driver.setFirstname("결제");
        driver.setPhone("01012345678");
        driver.setEmail("paytest@example.com");
        driver.setBirth("1990-01-01");
        driver.setPassword("1234"); // 비회원 조회용이지만, 필드가 있으면 채워두는 편이 안전합니다.

        req.setDriverInfo(driver);

        req.setAgreement(true);

        ReservationCreateResponseDtoV2 res = reservationCreateService.createReservation(req, userId);

        assertThat(res).isNotNull();
        assertThat(res.getReservationNo()).isNotBlank();

        return res.getReservationNo();
    }

    private ReservationPaymentRequestDtoV2 paymentReq(String reservationNo, String cardNumber) {
        ReservationPaymentRequestDtoV2 req = new ReservationPaymentRequestDtoV2();
        req.setReservationNo(reservationNo);

        ReservationPaymentRequestDtoV2.CardPaymentV2 card = new ReservationPaymentRequestDtoV2.CardPaymentV2();
        card.setCardNumber(cardNumber);
        card.setExpiry("12/29");
        card.setCvc("123");
        card.setPassword2("12");
        card.setInstallment("0");
        card.setCardType("personal");
        card.setAgree(true);

        req.setCardPayment(card);
        return req;
    }
}
