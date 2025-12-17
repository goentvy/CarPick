import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useReservationStore = create(
  persist(
    (set) => ({
      driverInfo: null,
      insuranceInfo: null,
      pickupReturn: { method: "visit" },
      paymentSummary: null,
      cardPayment: {
        cardNumber: "",
        expiry: "",
        cvc: "",
        password2: "",
        cardType: "personal",
        installment: "일시불",
        agree: false,
      },
      agreement: true,

      // 업데이트 액션들
      setDriverInfo: (info) => set({ driverInfo: info }),
      setInsuranceInfo: (info) => set({ insuranceInfo: info }),
      setPickupReturn: (info) => set({ pickupReturn: info }),
      setPaymentSummary: (info) => set({ paymentSummary: info }),
      setCardPayment: (info) => set({ cardPayment: info }),
      setAgreement: (agree) => set({ agreement: agree }),

      // 최종 결제 데이터 모으기
      getReservationData: () => {
        const state = useReservationStore.getState();
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
