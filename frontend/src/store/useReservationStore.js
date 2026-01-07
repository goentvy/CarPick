import { create } from "zustand";
import { persist } from "zustand/middleware";

const useReservationStore = create(
  persist(
    (set, get) => ({
      // =================================================
      // 1. 상태 변수 (State)
      // =================================================
      // ✅ 수정: 예약번호 저장 (create 응답으로 받음)
      reservationNo: null,
      /**
       * 운전자 정보
       * - 성, 이름, 생년월일, 연락처, 이메일 등
       * - DriverInfoSection에서 입력받아 저장
       */
      driverInfo: {
        lastname: "",
        firstname: "",
        phone: "",
        email: "",
        birth: "",
      },

      /**
       * 보험 정보
       * - code: 보험 코드 (NONE, NORMAL, FULL)
       * - dailyPrice: 보험 일일 요금
       * - summary: 백엔드에서 계산된 가격 요약 응답
       */
      insurance: {
        code: "NORMAL",
        dailyPrice: 10000,
        summary: null,
      },

      /**
       * 대여/반납 방식 및 지점 정보
       * - method: "visit"(지점 방문) / "delivery"(배송)
       * - pickupBranch: 픽업 지점 정보
       * - dropoffBranch: 반납 지점 정보
       */
      pickupReturn: {
        method: "visit",
        pickupBranch: null,
        dropoffBranch: null,
      },
      /**
       * 대여 기간 (시작/종료)
       */
      // ✅ 수정: 대여 기간 저장
        rentalPeriod: {
          startDateTime: null,
          endDateTime: null,
        },


      /**
       * 차량 정보
       * - id: 차량 ID
       * - title: 차량명
       * - dailyPrice: 차량 일일 요금
       */
      vehicle: {
        id: null,
        title: "",
        dailyPrice: 39900,
      },

      /**
       * 결제 관련 정보
       * - summary: 결제 요약 (차량 + 보험 + 총액 + 포인트)
       * - card: 카드 결제 입력값
       * - agreement: 약관 동의 여부
       */
      payment: {
        summary: null,
        card: {
          cardNumber: "",
          expiry: "",
          cvc: "",
          password2: "",
          cardType: "personal",
          installment: "일시불",
          agree: false,
        },
        agreement: true,
      },

      // ================= 액션들 =================


      // ✅ 수정: 예약번호 저장 액션(create 응답 후 사용)
      setReservationNo: (reservationNo) => set({ reservationNo }),

      // ✅ 수정: driverInfo는 merge 업데이트 (일부 값만 들어와도 기존 유지)
      setDriverInfo: (info) =>
        set((state) => ({ driverInfo: { ...state.driverInfo, ...info } })),
  
    // ✅ 수정: 대여 기간 업데이트 액션
      setRentalPeriod: (period) =>
       set((state) => ({ rentalPeriod: { ...state.rentalPeriod, ...period } })),
      // 보험 관련 업데이트
      setInsuranceCode: (code) =>
        set((state) => ({ insurance: { ...state.insurance, code } })),
      setInsuranceDailyPrice: (price) =>
        set((state) => ({ insurance: { ...state.insurance, dailyPrice: price } })),
      setInsuranceSummary: (summary) =>
        set((state) => ({ insurance: { ...state.insurance, summary } })),

      // ✅ 수정: pickupReturn도 merge 업데이트(기존값 유지하면서 필요한 것만 덮기)
      setPickupReturn: (info) =>
        set((state) => ({ pickupReturn: { ...state.pickupReturn, ...info } })),


      // 차량 정보 업데이트
      setVehicle: (vehicle) => set({ vehicle }),

      // 카드 결제 정보 업데이트
     setCardPayment: (info) =>
  set((state) => ({
    payment: {
      ...state.payment,
      card: { ...state.payment.card, ...info },
    },
  })),
      // 약관 동의 여부 업데이트
      setAgreement: (agree) =>
        set((state) => ({ payment: { ...state.payment, agreement: agree } })),

      /**
       * 결제 요약 계산
       * - 차량 요금 + 보험 요금 → 총액
       * - 총액의 1%를 포인트 적립
       */
      calculatePaymentSummary: () => {
        const state = get();
        const vehiclePrice = state.vehicle.dailyPrice || 0;
        const insurancePrice = state.insurance.dailyPrice || 0;
        const totalPrice = vehiclePrice + insurancePrice;
        const point = Math.floor(totalPrice * 0.01);

        const summary = { vehiclePrice, insurancePrice, totalPrice, point };
        set((state) => ({ payment: { ...state.payment, summary } }));
        return summary;
      },

      /**
       * 최종 결제 데이터 모으기
       * - 결제 API 호출 시 필요한 모든 데이터 반환
       */
     // =================================================
      // 3. Payload Builders (백엔드 요청용)
      // =================================================

      /**
       * ✅ 추가: 예약 생성 요청 바디 (/api/reservation/create)
       * - 백엔드 ReservationCreateRequestDto에 맞춤
       */
      getCreatePayload: () => {
        const state = get();
        return {
          carId: state.vehicle.id,
          startDateTime: state.rentalPeriod.startDateTime,
          endDateTime: state.rentalPeriod.endDateTime,
          method: state.pickupReturn.method,

          // ✅ 수정: 0 넣지 말고 null로(0은 FK/검증에서 위험)
          pickUpBranchId: state.pickupReturn.pickupBranch?.branchId ?? null,
          returnBranchId: state.pickupReturn.dropoffBranch?.branchId ?? null,

          insuranceCode: state.insurance.code,
          driverInfo: state.driverInfo,
          agreement: state.payment.agreement,
        };
      },

      /**
       * ✅ 추가: 결제 승인 요청 바디 (/api/reservation/pay)
       * - 백엔드 ReservationPaymentRequestDto에 맞춤
       */
      getPayPayload: () => {
        const state = get();

        // ✅ 추가: 안전장치 (reservationNo 없으면 create 먼저)
        if (!state.reservationNo) {
          console.error(
            "❌ [오류] reservationNo가 없습니다. /create 먼저 호출하고 setReservationNo 하세요."
          );
        }

        return {
          reservationNo: state.reservationNo, // ✅ 수정/핵심: pay에 reservationNo 포함
          cardPayment: {
            cardNumber: state.payment.card.cardNumber,
            expiry: state.payment.card.expiry,
            cvc: state.payment.card.cvc,
            password2: state.payment.card.password2,
            installment: state.payment.card.installment,
            cardType: state.payment.card.cardType,
            agree: state.payment.card.agree,
          },
        };
      },
    }),
    {
      name: "reservation-storage",
    }
  )
);

export default useReservationStore;
