package com.carpick.reservation;


import com.carpick.domain.auth.service.OAuthService;
import com.carpick.domain.inventory.enums.InventoryOperationalStatus;
import com.carpick.domain.inventory.mapper.VehicleInventoryMapper;
import com.carpick.domain.reservation.dto.request.ReservationCreateRequestDto;
import com.carpick.domain.reservation.mapper.ReservationMapper;
import com.carpick.domain.reservation.service.v1.ReservationCommandServiceV1;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@SpringBootTest
@ActiveProfiles("test")
public class ReservationPessimisticLockTest {
    @MockBean
    private OAuthService oAuthService; // 컨트롤러가 의존하면 이걸로 차단 가능


@Autowired
    private ReservationCommandServiceV1 reservationCommandServiceV1;

    @Autowired
    private VehicleInventoryMapper vehicleInventoryMapper;

    @Autowired
    private ReservationMapper reservationMapper;

    @Test
    void 차량_1대에_동시에_여러명이_예약하면_1명만_성공한다() throws InterruptedException {
        // ===============================
        // given
        // ===============================
        int threadCount = 10;
        ExecutorService executorService = Executors.newFixedThreadPool(threadCount);
        CountDownLatch latch = new CountDownLatch(threadCount);

        Long userId = 4L;          // 아무 유저
        Long carSpecId = 1L;       // 같은 차량 스펙
        Long vehicleId = 3L;       // 재고 1대라고 가정

        // 테스트 전 상태 초기화
        vehicleInventoryMapper.updateOperationalStatus(
                vehicleId,
                InventoryOperationalStatus.AVAILABLE.name()
        );

        AtomicInteger successCount = new AtomicInteger();
        AtomicInteger failCount = new AtomicInteger();

        // ===============================
        // when
        // ===============================
        for (int i = 0; i < threadCount; i++) {
            executorService.submit(() -> {
                try {
                    ReservationCreateRequestDto req = new ReservationCreateRequestDto();
                    req.setCarId(carSpecId);
                    req.setInsuranceCode("STANDARD");
                    req.setStartDateTime("2026-01-01 10:00:00");
                    req.setEndDateTime("2026-01-02 10:00:00");
                    req.setMethod("visit");
// 👇👇 [추가할 부분] 운전자 정보가 없어서 에러가 난 겁니다! 👇👇
                    ReservationCreateRequestDto.DriverInfoDto driver = new ReservationCreateRequestDto.DriverInfoDto();
                    driver.setLastname("홍");
                    driver.setFirstname("길동");
                    driver.setPhone("010-1234-5678");
                    driver.setEmail("test@test.com");
                    driver.setBirth("19900101");

                    req.setDriverInfo(driver);
                    // 👆👆 여기까지 추가 👆👆
                    reservationCommandServiceV1.createReservation(req, userId);
                    successCount.incrementAndGet();
                } catch (Exception e) {
                    System.out.println("예약 실패: " + e.getMessage());
                    failCount.incrementAndGet();
                } finally {
                    latch.countDown();
                }
            });
        }

        latch.await();
        executorService.shutdown();

        // ===============================
        // then
        // ===============================
        System.out.println("성공: " + successCount.get());
        System.out.println("실패: " + failCount.get());

        assertThat(successCount.get()).isEqualTo(1);
        assertThat(failCount.get()).isEqualTo(threadCount - 1);

        String status =
                vehicleInventoryMapper.selectOperationalStatusForUpdate(vehicleId);

        assertThat(status).isEqualTo(InventoryOperationalStatus.RESERVED.name());
    }


}
