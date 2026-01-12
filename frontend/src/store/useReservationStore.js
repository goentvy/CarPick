import { create } from "zustand";
import { persist } from "zustand/middleware";

const useReservationStore = create(
    persist(
        (set, get) => ({
            // =================================================
            // 1. 상태 변수 (State)
            // =================================================
            // ✅ 예약번호 저장 (create 응답으로 받음)
            reservationNo: null,

            /**
             * ✅ 지점/날짜 정보 (OrderComplete 표시용)
             */
            pickupBranchName: "",
            startDate: "",
            endDate: "",

            /**
             * 운전자 정보
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
             */
            insurance: {
                code: "NORMAL",
                dailyPrice: 10000,
                summary: null,
            },

            /**
             * 대여/반납 방식 및 지점 정보
             */
            pickupReturn: {
                method: "visit",
                pickupBranch: null,
                dropoffBranch: null,
            },

            /**
             * 대여 기간 (시작/종료)
             */
            rentalPeriod: {
                startDateTime: null,
                endDateTime: null,
            },

            /**
             * 차량 정보
             */
            vehicle: {
                id: null,
                title: "",
                dailyPrice: 39900,
            },

            /**
             * 결제 관련 정보
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

            // =================================================
            // 2. 액션들 (Actions)
            // =================================================
            setReservationNo: (reservationNo) => set({ reservationNo }),

            // ✅ 지점/날짜 액션 추가
            setPickupBranchName: (name) => set({ pickupBranchName: name }),
            setStartDate: (date) => set({ startDate: date }),
            setEndDate: (date) => set({ endDate: date }),

            setDriverInfo: (info) =>
                set((state) => ({ driverInfo: { ...state.driverInfo, ...info } })),

            setRentalPeriod: (period) =>
                set((state) => ({ rentalPeriod: { ...state.rentalPeriod, ...period } })),

            setInsuranceCode: (code) =>
                set((state) => ({ insurance: { ...state.insurance, code } })),
            setInsuranceDailyPrice: (price) =>
                set((state) => ({ insurance: { ...state.insurance, dailyPrice: price } })),
            setInsuranceSummary: (summary) =>
                set((state) => ({ insurance: { ...state.insurance, summary } })),

            setPickupReturn: (info) =>
                set((state) => ({ pickupReturn: { ...state.pickupReturn, ...info } })),

            setVehicle: (vehicle) => set({ vehicle }),

            setCardPayment: (info) =>
                set((state) => ({
                    payment: {
                        ...state.payment,
                        card: { ...state.payment.card, ...info },
                    },
                })),

            setAgreement: (agree) =>
                set((state) => ({ payment: { ...state.payment, agreement: agree } })),

            /**
             * 결제 요약 계산
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

            // =================================================
            // 3. Payload Builders (백엔드 요청용)
            // =================================================
            getCreatePayload: () => {
                const state = get();
                if (!state.rentalPeriod?.startDateTime || !state.rentalPeriod?.endDateTime) {
                    throw new Error("rentalPeriod missing (startDateTime/endDateTime)");
                }
                return {
                    carId: state.vehicle.id,
                    startDateTime: state.rentalPeriod.startDateTime,
                    endDateTime: state.rentalPeriod.endDateTime,
                    method: state.pickupReturn.method,
                    pickUpBranchId: state.pickupReturn.pickupBranch?.branchId ?? null,
                    returnBranchId: state.pickupReturn.dropoffBranch?.branchId ?? null,
                    insuranceCode: state.insurance.code,
                    driverInfo: state.driverInfo,
                    agreement: state.payment.agreement,
                };
            },

            getPayPayload: () => {
                const state = get();
                if (!state.reservationNo) {
                    console.error("❌ reservationNo가 없습니다. /create 먼저 호출하세요.");
                }
                return {
                    reservationNo: state.reservationNo,
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
