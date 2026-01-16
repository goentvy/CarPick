package com.carpick.domain.reservation.service.v1;

import com.carpick.domain.inventory.enums.InventoryOperationalStatus;
import com.carpick.domain.inventory.mapper.VehicleInventoryMapper;
import com.carpick.domain.reservation.dto.request.ReservationCreateRequestDto;
import com.carpick.domain.reservation.dto.response.ReservationCreateResponseDto;
import com.carpick.domain.reservation.dto.response.ReservationPriceResponseDto;
import com.carpick.domain.reservation.entity.Reservation;
import com.carpick.domain.reservation.mypage.enums.ActorType;
import com.carpick.domain.reservation.enums.PickupType;
import com.carpick.domain.reservation.enums.ReservationStatus;
import com.carpick.domain.reservation.enums.ReturnTypes;
import com.carpick.domain.reservation.mapper.ReservationMapper;
import com.carpick.domain.reservationHistory.entity.ReservationStatusHistory;
import com.carpick.domain.reservationHistory.mapper.ReservationStatusHistoryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.CannotAcquireLockException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class ReservationCommandServiceV1 {

    private final ReservationMapper reservationMapper;
    private final ReservationStatusHistoryMapper historyMapper;
    private final ReservationPriceServiceV1 pricingService;
    private  final VehicleInventoryMapper vehicleInventoryMapper;

    private static final DateTimeFormatter DATETIME_FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Transactional
    public ReservationCreateResponseDto createReservation(
            ReservationCreateRequestDto req, Long userId) {

        // =============================================================
        // 🚨 [안전장치 1] 날짜 포맷 자동 보정 (yyyy-MM-dd -> yyyy-MM-dd HH:mm:ss)
        // =============================================================
        String startStr = req.getStartDateTime();
        String endStr = req.getEndDateTime();

        // 날짜가 10자리(예: 2026-01-01)로 오면 뒤에 시간 강제 추가
        if (startStr != null && startStr.length() == 10) {
            startStr += " 10:00:00";
        }
        if (endStr != null && endStr.length() == 10) {
            endStr += " 10:00:00";
        }

        // null 체크 (혹시라도 아예 안 왔을 경우 대비)
        if (startStr == null) startStr = LocalDate.now().toString() + " 10:00:00";
        if (endStr == null) endStr = LocalDate.now().plusDays(1).toString() + " 10:00:00";

        // 1️⃣ 날짜 파싱 (이제 에러 안 남)
        LocalDateTime startDate = LocalDateTime.parse(startStr, DATETIME_FORMATTER);
        LocalDateTime endDate = LocalDateTime.parse(endStr, DATETIME_FORMATTER);
        // 3️⃣ 차량 조회
        // ✅ [수정] 프론트 carId를 실차 vehicleId로 확정
        Long vehicleId = req.getCarId();
        if (vehicleId == null) {
            throw new IllegalArgumentException("vehicleId(carId)가 누락되었습니다.");
        }


// =============================================================
// 🔒 [비관적 락] 차량 상태 확인 및 변경
// =============================================================
        try {
            // 1. 락 획득 시도 (WAIT 3초)
            String currentStatus = vehicleInventoryMapper.selectOperationalStatusForUpdate(vehicleId);

            // 2. 상태 검증
            if (!InventoryOperationalStatus.AVAILABLE.name().equals(currentStatus)) {
                throw new IllegalStateException("해당 차량은 현재 예약할 수 없는 상태입니다: " + currentStatus);
            }

            // 예약 INSERT 성공 후에 바꾸는 게 정석입니다.
//            // 3. 상태 변경
//            vehicleInventoryMapper.updateOperationalStatus(
//                    vehicleId,
//                    InventoryOperationalStatus.RESERVED.name()
//            );

        } catch (CannotAcquireLockException e) {
            throw new RuntimeException("현재 예약자가 몰려 처리가 지연되고 있습니다. 잠시 후 다시 시도해주세요.");
        }
        // 2️⃣ 가격 재계산
        ReservationPriceResponseDto price = pricingService.estimate(
                req.getCarId(),
                req.getInsuranceCode(),
                startStr, // 보정된 시간 사용
                endStr
        );


        // 3️⃣ 예약번호 생성
        String reservationNo = "R-" + System.currentTimeMillis();
        boolean isDelivery = "delivery".equalsIgnoreCase(req.getMethod());

        // 4️⃣ Reservation 엔티티 구성
        Reservation r = new Reservation();
        r.setReservationNo(reservationNo);
        r.setUserId(userId);
        r.setVehicleId(vehicleId);  // ✅ 이거 추가!


        // DRIVER (운전자 정보)
        if (req.getDriverInfo() != null) {
            r.setDriverLastName(req.getDriverInfo().getLastname());
            r.setDriverFirstName(req.getDriverInfo().getFirstname());
            r.setDriverPhone(req.getDriverInfo().getPhone());
            r.setDriverEmail(req.getDriverInfo().getEmail());

            if (req.getDriverInfo().getBirth() != null) {
                try {
                    // "19921021" 같은 생년월일 처리
                    r.setDriverBirthdate(LocalDate.parse(req.getDriverInfo().getBirth(), DateTimeFormatter.ofPattern("yyyyMMdd")));
                } catch (Exception e) {
                    // 실패하면 기본값
                    r.setDriverBirthdate(LocalDate.of(1990, 1, 1));
                }
            }
        }

        // WHEN
        r.setStartDate(startDate);
        r.setEndDate(endDate);

        // =============================================================
        // 🚨 [안전장치 3] 지점 ID가 없으면 무조건 1번(김포공항점)으로 설정
        // =============================================================
        Long pickupBranchId = (req.getPickupBranchId() != null) ? req.getPickupBranchId() : 1L;
        Long returnBranchId = (req.getReturnBranchId() != null) ? req.getReturnBranchId() : 1L;

        // WHERE
        r.setPickupType(isDelivery ? PickupType.DELIVERY : PickupType.VISIT);
        r.setPickupBranchId(pickupBranchId); // ✅ 이제 절대 null 아님
        r.setPickupAddress(null);

        r.setReturnType(isDelivery ? ReturnTypes.COLLECTION : ReturnTypes.VISIT);
        r.setReturnBranchId(returnBranchId); // ✅ 이제 절대 null 아님
        r.setReturnAddress(null);
// =============================================================
        // 🔥 [수정] 보험 코드 -> ID 매핑 (SQL 순서 기반)
        // 1: NONE (미가입)
        // 2: STANDARD (일반자차)
        // 3: FULL (완전자차)
        // =============================================================
        Long insuranceId = 1L; // 기본값 (혹시 모르면 NONE)
        String code = req.getInsuranceCode(); // 프론트에서 "FULL", "STANDARD", "NONE" 옴

        if ("FULL".equalsIgnoreCase(code)) {
            insuranceId = 3L; // 완전자차는 3번
        } else if ("STANDARD".equalsIgnoreCase(code) || "NORMAL".equalsIgnoreCase(code)) {
            insuranceId = 2L; // 일반자차는 2번
        } else {
            insuranceId = 1L; // 미가입은 1번
        }

        r.setInsuranceId(insuranceId);


        // SNAPSHOT
        r.setBaseRentFeeSnapshot(BigDecimal.valueOf(price.getCarDailyPrice()));
        r.setRentDiscountAmountSnapshot(BigDecimal.ZERO);
        r.setBaseInsuranceFeeSnapshot(BigDecimal.valueOf(price.getInsurancePrice()));
        r.setInsuranceDiscountAmountSnapshot(BigDecimal.ZERO);
        r.setOptionFeeSnapshot(BigDecimal.ZERO);
        r.setCouponDiscountSnapshot(BigDecimal.ZERO);
        r.setMemberDiscountRateSnapshot(BigDecimal.ZERO);
        r.setEventDiscountAmountSnapshot(BigDecimal.ZERO);

        r.setTotalAmountSnapshot(BigDecimal.valueOf(price.getTotalPrice()));
        r.setAppliedRentFeeSnapshot(BigDecimal.valueOf(price.getCarDailyPrice()));
        r.setAppliedInsuranceFeeSnapshot(BigDecimal.valueOf(price.getInsurancePrice()));

        r.setAgreementYn("Y");
        r.setReservationStatus(ReservationStatus.PENDING);
        r.setUseYn("Y");

        // =============================================================
        // 7️⃣ 예약 저장
        // =============================================================
        reservationMapper.insertReservation(r);

        // =============================================================
        // 8️⃣ 차량 상태 변경 (INSERT 성공 후!)
        // =============================================================
        vehicleInventoryMapper.updateOperationalStatus(
                vehicleId,
                InventoryOperationalStatus.RESERVED.name()
        );
        // 6️9️⃣ 상태 이력
        ReservationStatusHistory history = ReservationStatusHistory.builder()
                .reservationId(r.getReservationId())
                .statusPrev(null)
                .statusCurr(ReservationStatus.PENDING)
                .actorType(ActorType.SYSTEM)
                .actorId("SYSTEM")
                .reason("예약 생성")
                .build();
        historyMapper.insertHistory(history);

        // 7️🔟 응답
        return new ReservationCreateResponseDto(
                reservationNo,
                req.getCarId(),
                req.getInsuranceCode(),
                price.getCarDailyPrice(),
                price.getInsurancePrice(),
                price.getTotalPrice(),
                "예약이 완료 되었습니다."
        );
    }

}
