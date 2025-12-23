import { create } from "zustand";
import { persist } from "zustand/middleware";

const useReservationStore = create(
  persist(
    (set, get) => ({
      /**
       * 운전자 정보
       * - 성, 이름, 생년월일, 연락처, 이메일 등
       * - DriverInfoSection에서 입력받아 저장
       */
      driverInfo: null,

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

      // 운전자 정보 업데이트
      setDriverInfo: (info) => set({ driverInfo: info }),

      // 보험 관련 업데이트
      setInsuranceCode: (code) =>
        set((state) => ({ insurance: { ...state.insurance, code } })),
      setInsuranceDailyPrice: (price) =>
        set((state) => ({ insurance: { ...state.insurance, dailyPrice: price } })),
      setInsuranceSummary: (summary) =>
        set((state) => ({ insurance: { ...state.insurance, summary } })),

      // 대여/반납 정보 업데이트
      setPickupReturn: (info) => set({ pickupReturn: info }),

      // 차량 정보 업데이트
      setVehicle: (vehicle) => set({ vehicle }),

      // 카드 결제 정보 업데이트
      setCardPayment: (info) =>
        set((state) => ({ payment: { ...state.payment, card: info } })),
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
      getReservationData: () => {
        const state = get();
        return {
          driverInfo: {
            firstName: state.driverInfo.firstName,
            lastName: state.driverInfo.lastName,
            birth: state.driverInfo.birth,
            phone: state.driverInfo.phone,
            email: state.driverInfo.email,
          },
          pickupReturn: {
            method: state.pickupReturn.method,
            branch: state.pickupReturn.branch,
            time: state.pickupReturn.time,
            deliveryOption: state.pickupReturn.deliveryOption,
          },
          insuranceInfo: {
            type: state.insurance.code,                   // 보험 코드 (NONE, NORMAL, FULL)
            coverage: state.insurance.coverage || "기본", // 보험 보장내용 (프론트에서 기본값 세팅 가능)
            fee: state.insurance.dailyPrice,              // 보험 요금
          },
          paymentSummary: {
            carFee: state.vehicle.dailyPrice,         // 차량 요금
            insuranceFee: state.insurance.dailyPrice, // 보험 요금
            total: state.payment.summary.totalPrice,  // 총 결제금액
          },
          cardPayment: {
            cardNumber: state.payment.card.cardNumber,
            expiry: state.payment.card.expiry,
            cvc: state.payment.card.cvc,
            password2: state.payment.card.password2,
            cardType: state.payment.card.cardType,
            installment: state.payment.card.installment,
            agree: state.payment.card.agree,
          },
          agreement: state.payment.agreement,       // 약관 동의 여부
        };
      },
    }),
    { name: "reservation-storage" } // 로컬스토리지에 저장 (새로고침해도 유지)
  )
);

export default useReservationStore;
