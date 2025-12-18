import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useReservationStore = create(
  persist(
    (set, get) => ({
      driverInfo: null, // 운전자 정보
      insuranceInfo: { type: "basic", price: 48000 }, // 보험 선택: type, price
      pickupReturn: { method: "visit" }, // 대여/반납방식
      vehiclePrice: 39900, // 차량 요금
      paymentSummary: null, // 결제 요약 정보
      cardPayment: { // 카드 결제 정보
        cardNumber: "",
        expiry: "",
        cvc: "",
        password2: "",
        cardType: "personal",
        installment: "일시불",
        agree: false,
      },
      agreement: true, // 약관 동의 여부

      // 업데이트 액션들
      setDriverInfo: (info) => set({ driverInfo: info }),
      setInsuranceInfo: (info) => set({ insuranceInfo: info }),
      setPickupReturn: (info) => set({ pickupReturn: info }),
      setVehiclePrice: (price) => set({ vehiclePrice: price }),
      setCardPayment: (info) => set({ cardPayment: info }),
      setAgreement: (agree) => set({ agreement: agree }),

      // 결제 요약 계산
      calculatePaymentSummary: () => {
        const state = get();
        const vehiclePrice = state.vehiclePrice || 0;
        const insurancePrice = state.insuranceInfo?.price || 0;
        const totalPrice = vehiclePrice + insurancePrice;
        const point = Math.floor(totalPrice * 0.01);

        const summary = {
          vehiclePrice,
          insurancePrice,
          totalPrice,
          point,
        };

        set({ paymentSummary: summary });
        return summary;
      },

      // 최종 결제 데이터 모으기
      getReservationData: () => {
        const state = get();
        return {
          driverInfo: state.driverInfo,
          insuranceInfo: state.insuranceInfo,
          pickupReturn: state.pickupReturn,
          paymentSummary: state.paymentSummary,
          cardPayment: state.cardPayment,
          agreement: state.agreement,
        };
      },
    }),
    { name: "reservation-storage" }
  )
);

export default useReservationStore;
