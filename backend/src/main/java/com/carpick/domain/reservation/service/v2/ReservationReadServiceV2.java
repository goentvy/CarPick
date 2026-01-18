package com.carpick.domain.reservation.service.v2;


import com.carpick.domain.reservation.entity.Reservation;
import com.carpick.domain.reservation.mapper.ReservationReadMapperV2;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReservationReadServiceV2 {
    private final ReservationReadMapperV2 reservationReadMapper;

    // ============================================================
    // Public Methods
    // ============================================================

    /**
     * [1] 예약 상세 조회 (예약번호 기준)
     *
     * 사용처:
     * - 결제 완료 후 결과 화면
     * - 마이페이지 예약 상세
     *
     * @param reservationNo 예약번호
     * @return 예약 Entity (없으면 null)
     */
    public Reservation getReservationByNo(String reservationNo) {
        if (reservationNo == null || reservationNo.isBlank()) {
            throw new IllegalArgumentException("예약번호는 필수입니다.");
        }

        Reservation reservation = reservationReadMapper.selectReservationByReservationNo(reservationNo);

        if (reservation == null) {
            log.warn("[예약조회] 예약 정보 없음. reservationNo={}", reservationNo);
            throw new IllegalArgumentException("예약 정보를 찾을 수 없습니다. reservationNo=" + reservationNo);
        }

        log.info("[예약조회] 조회 완료. reservationNo={}, status={}",
                reservationNo, reservation.getReservationStatus());

        return reservation;
    }

    /**
     * [2] 예약 상세 조회 + 권한 검증 (회원용)
     *
     * @param reservationNo 예약번호
     * @param userId 로그인 사용자 ID
     * @return 예약 Entity
     */
    public Reservation getReservationByNoWithAuth(String reservationNo, Long userId) {
        Reservation reservation = getReservationByNo(reservationNo);

        // 1) userId가 없으면 회원 권한 조회 불가
        if (userId == null) {
            log.warn("[예약조회] 로그인 필요. reservationNo={}", reservationNo);
            throw new IllegalArgumentException("로그인이 필요합니다.");
        }

        // 2) 예약이 회원 예약이면 본인만 조회 가능
        //    (reservation.userId가 null이면 비회원 예약이므로 이 메서드로 조회하지 않는 게 안전)
        if (reservation.getUserId() == null || !userId.equals(reservation.getUserId())) {
            log.warn("[예약조회] 권한 없음. reservationNo={}, requestUserId={}, ownerUserId={}",
                    reservationNo, userId, reservation.getUserId());
            throw new IllegalArgumentException("조회 권한이 없습니다.");
        }


        return reservation;
    }

    /**
     * [3] 비회원 예약 조회 (이메일 + 예약번호)
     *
     * @param email 운전자 이메일
     * @param reservationNo 예약번호
     * @return 예약 Entity (없으면 null)
     */
    public Reservation getReservationForNonMember(String email, String reservationNo) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("이메일은 필수입니다.");
        }
        if (reservationNo == null || reservationNo.isBlank()) {
            throw new IllegalArgumentException("예약번호는 필수입니다.");
        }

        Reservation reservation = reservationReadMapper.findByDriverEmailAndReservationNo(email, reservationNo);

        if (reservation == null) {
            log.warn("[비회원조회] 예약 정보 없음. email={}, reservationNo={}", email, reservationNo);
            throw new IllegalArgumentException("예약 정보를 찾을 수 없습니다.");
        }

        log.info("[비회원조회] 조회 완료. reservationNo={}, email={}", reservationNo, email);

        return reservation;
    }

    /**
     * [4] 예약 존재 여부 확인 (간단 조회)
     *
     * @param reservationNo 예약번호
     * @return 존재 여부
     */
    public boolean existsByReservationNo(String reservationNo) {
        if (reservationNo == null || reservationNo.isBlank()) {
            return false;
        }

        Reservation reservation = reservationReadMapper.selectReservationByReservationNo(reservationNo);
        return reservation != null;
    }
}
