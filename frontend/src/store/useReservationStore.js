// src/store/useReservationStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../services/api";

/**
 * 예약/결제 플로우 전용 전역 상태
 *
 * 설계 원칙:
 * 1) 돈(최종 금액)은 서버(/api/v2/reservations/price)가 유일한 진실이다.
 * 2) 컴포넌트는 선택/입력만 한다. 서버 가격 조회와 상태 갱신은 store가 책임진다.
 * 3) create/payment는 store 상태를 기반으로 payload를 만들며, 프런트에서 금액 계산을 하지 않는다.
 */
const useReservationStore = create(
    persist(
        (set, get) => ({
            // =================================================
            // 1. 상태(State)
            // =================================================

            // 예약번호(create 응답)
            reservationNo: null,

            // 완료 페이지 표시용(선택)
            pickupBranchName: "",
            startDate: "",
            endDate: "",

            // 운전자 정보
            driverInfo: {
                lastname: "",
                firstname: "",
                phone: "",
                email: "",
                birth: "",
            },

            /**
             * 보험 상태
             * code: 서버 enum과 동일하게 유지 (NONE / STANDARD / FULL)
             * dailyPrice: 화면 표시용(옵션 리스트의 extraDailyPrice)
             * summary: 서버 price API 원본 저장(디버깅/확장용)
             */
            insurance: {
                code: "NONE", // 변경: 기본값을 서버 enum 기준으로 통일
                dailyPrice: 0,
                summary: null,
            },

            /**
             * 대여/반납 방식 및 지점 정보
             */
            pickupReturn: {
                pickupType: "VISIT",   // enum과 동일
                returnType: "VISIT",   //  enum과 동일 (VISIT / DROPZONE)
                pickupBranch: null,
                dropoffBranch: null,

                //  A안 핵심: 선택된 dropzoneId만 저장
                dropzoneId: null,
            },

            /**
             * 대여 기간 (서버 규격 키로 유지 권장)
             * startDateTime / endDateTime
             */
            rentalPeriod: {
                startDateTime: null,
                endDateTime: null,
            },

            /**
             * rentType / months는 price API 및 create에서 함께 쓰이므로 store에 고정
             */
            rentType: "SHORT", // 추가: 파이널에서는 rentType이 store에 있어야 합니다.
            months: null, // 추가: LONG일 때만 사용

            /**
             * 차량 정보
             * 주의: price API는 specId 기준인 경우가 많고, create는 vehicleId(or carId)일 수 있습니다.
             * 파이널에서는 둘을 분리해서 들고 가는 것이 안전합니다.
             */
            vehicle: {
                vehicleId: null, // 변경: 기존 id를 vehicleId로 명확화
                specId: null,    // 추가: price API용 specId
                title: "",
                dailyPrice: 0,   // 표시용(진실 아님)
                monthlyPrice: 0, // 표시용(진실 아님)
            },

            /**
             * 결제 관련
             * summary는 서버(/v2/reservations/price) 응답을 기준으로만 유지
             */
            payment: {
                summary: {
                    rentFee: 0,
                    insuranceFee: 0,
                    couponDiscount: 0,
                    totalAmount: 0,
                    // 필요 시 확장: billingDays, insuranceCode 등
                }, // 변경: null 대신 기본 객체로 두어 렌더링 단순화
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

            // 서버 통신 상태(선택)
            priceLoading: false, // 추가: 로딩 처리용
            priceError: null,    // 추가: 에러 표시용

            // =================================================
            // 2. 기본 액션(Actions)
            // =================================================
            setReservationNo: (reservationNo) => set({ reservationNo }),
            setReturnType: (returnType) =>
                set((state) => ({
                    pickupReturn: {
                        ...state.pickupReturn,
                        returnType: String(returnType || "VISIT").toUpperCase(),
                        // returnType이 VISIT이면 드롭존 선택값은 무조건 제거 (안전)
                        dropzoneId: String(returnType || "VISIT").toUpperCase() === "VISIT"
                            ? null
                            : state.pickupReturn.dropzoneId,
                    },
                })),

            setDropzoneId: (dropzoneId) =>
                set((state) => ({
                    pickupReturn: {
                        ...state.pickupReturn,
                        // dropzone을 선택하면 반납 타입은 DROPZONE이 자연스럽습니다.
                        returnType: "DROPZONE",
                        dropzoneId: dropzoneId ?? null,
                    },
                })),

            resetDropzone: () =>
                set((state) => ({
                    pickupReturn: { ...state.pickupReturn, dropzoneId: null, returnType: "VISIT" },
                })),

            setPickupBranchName: (name) => set({ pickupBranchName: name }),
            setStartDate: (date) => set({ startDate: date }),
            setEndDate: (date) => set({ endDate: date }),

            setDriverInfo: (info) =>
                set((state) => ({ driverInfo: { ...state.driverInfo, ...info } })),

            setRentalPeriod: (period) =>
                set((state) => ({
                    rentalPeriod: { ...state.rentalPeriod, ...period },
                })),

            setRentType: (rentType) => set({ rentType }), // 추가
            setMonths: (months) => set({ months }),       // 추가

            setInsuranceCode: (code) =>
                set((state) => ({ insurance: { ...state.insurance, code } })),
            setInsuranceDailyPrice: (price) =>
                set((state) => ({ insurance: { ...state.insurance, dailyPrice: price } })),
            setInsuranceSummary: (summary) =>
                set((state) => ({ insurance: { ...state.insurance, summary } })),

            setPickupReturn: (info) =>
                set((state) => {
                    const next = { ...state.pickupReturn, ...info };

                    const prevReturnBranchId = state.pickupReturn.dropoffBranch?.branchId ?? null;
                    const nextReturnBranchId = next.dropoffBranch?.branchId ?? null;

                    // ✅ 반납 지점이 바뀌면 드롭존 선택값 초기화
                    const returnBranchChanged = prevReturnBranchId !== nextReturnBranchId;

                    return {
                        pickupReturn: {
                            ...next,
                            dropzoneId: returnBranchChanged ? null : next.dropzoneId,
                            returnType: returnBranchChanged ? "VISIT" : next.returnType,
                        },
                    };
                }),

            setVehicle: (vehicle) =>
                set((state) => ({ vehicle: { ...state.vehicle, ...vehicle } })), // 변경: 병합 업데이트로 안전성 강화

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
             * 서버 가격 요약을 payment.summary로 저장
             * summary 스키마는 서버를 기준으로 고정
             */
            setPaymentSummary: (summary) => // 추가
                set((state) => ({
                    payment: {
                        ...state.payment,
                        summary: {
                            ...state.payment.summary,
                            ...summary,
                        },
                    },
                })),

            // =================================================
            // 3. 파이널 핵심: 서버 가격 조회(Price API)
            // =================================================

            /**
             * 현재 store 상태를 기반으로 price API 호출 파라미터를 구성
             * 컴포넌트에서 specId/기간/렌트타입을 재조립하지 않도록 store에서 일원화
             */
            buildPriceParams: (override = {}) => {
                const state = get();

                const specId = override.specId ?? state.vehicle.specId;
                const rentType = (override.rentType ?? state.rentType ?? "SHORT").toUpperCase();

                const startDateTime = override.startDateTime ?? state.rentalPeriod?.startDateTime;
                const endDateTime = override.endDateTime ?? state.rentalPeriod?.endDateTime;

                const months = override.months ?? state.months;
                const insuranceCode = (override.insuranceCode ?? state.insurance.code ?? "NONE").toUpperCase();

                if (!specId) throw new Error("specId가 없습니다. vehicle.specId를 먼저 세팅하세요.");
                if (!startDateTime || !endDateTime) throw new Error("기간(startDateTime/endDateTime)이 없습니다.");

                const params = {
                    specId,
                    rentType,

                    // 백엔드가 요구하는 이름으로 전달
                    startDate: startDateTime,
                    endDate: endDateTime,

                    insuranceCode,
                };

                if (rentType === "LONG") {
                    if (!months || Number(months) <= 0) throw new Error("LONG 렌트는 months가 1 이상이어야 합니다.");
                    params.months = months;
                }

                return params;
            },


            /**
             * Price API 호출 → payment.summary 갱신
             * 보험 변경/페이지 진입/기간 변경 등 모든 가격 갱신은 이 액션만 사용
             */
            refreshPriceSummary: async (override = {}) => { // 추가
                set({ priceLoading: true, priceError: null });

                try {
                    const params = get().buildPriceParams(override);

                    const res = await api.get("/v2/reservations/price", { params });

                    const rentFee = res.data?.rentFee ?? 0;
                    const insuranceFee = res.data?.insuranceFee ?? 0;
                    const couponDiscount = res.data?.couponDiscount ?? 0;
                    const totalAmount = res.data?.totalAmount ?? 0;

                    // 서버 원본 저장(선택)
                    set((state) => ({
                        insurance: { ...state.insurance, summary: res.data },
                    }));

                    // 서버 기준 summary 저장
                    set((state) => ({
                        payment: {
                            ...state.payment,
                            summary: {
                                ...state.payment.summary,
                                rentFee,
                                insuranceFee,
                                couponDiscount,
                                totalAmount,
                            },
                        },
                        priceLoading: false,
                        priceError: null,
                    }));

                    return res.data;
                } catch (err) {
                    set({
                        priceLoading: false,
                        priceError: {
                            message: err?.message,
                            status: err?.response?.status,
                            data: err?.response?.data,
                        },
                    });
                    throw err;
                }
            },

            /**
             * 보험 선택(UI) → store 반영 → 즉시 price API 재호출
             * ReservationInsurance 컴포넌트는 이 액션만 호출하면 됩니다.
             */
            selectInsuranceAndRefreshPrice: async (code, extraDailyPrice) => { // 추가
                const nextCode = String(code || "NONE").toUpperCase();

                // LONG이면 보험은 의미가 없으므로 NONE으로 고정(백도 방어하지만 프런트도 일관성 유지)
                const rentType = (get().rentType ?? "SHORT").toUpperCase();
                const safeCode = rentType === "LONG" ? "NONE" : nextCode;

                set((state) => ({
                    insurance: {
                        ...state.insurance,
                        code: safeCode,
                        dailyPrice: Number(extraDailyPrice ?? 0),
                    },
                }));

                return await get().refreshPriceSummary({ insuranceCode: safeCode });
            },

            // =================================================
            // 4. 폼 응답 초기화(ReservationFormResponseDtoV2 연동)
            // =================================================

            /**
             * 예약 페이지 진입 시, Form API 응답을 store에 반영
             * 여기서 차량/specId/기간/rentType/months/보험옵션 초기값 등을 고정합니다.
             *
             * 사용 흐름:
             * 1) form API 호출
             * 2) initFromFormResponse(formRes)
             * 3) refreshPriceSummary() (또는 formRes에 이미 summary가 있으면 생략 가능)
             */
            initFromFormResponse: (formRes) => {
                if (!formRes) return;

                const rentType = String(formRes.rentType ?? "SHORT").toUpperCase();

                // 기간
                const startDateTime = formRes.startDateTime ?? null;
                const endDateTime = formRes.endDateTime ?? null;

                // months
                const months = rentType === "LONG" ? (formRes.rentalMonths ?? null) : null;

                // 차량
                const specId = formRes.car?.specId ?? null;

                // ✅ 보험 초기값: 무조건 NONE으로 고정
                const insuranceCode = "NONE";
                const dailyPrice = 0;

                set((state) => ({
                    rentType,
                    months,
                    rentalPeriod: { ...state.rentalPeriod, startDateTime, endDateTime },
                    vehicle: {
                        ...state.vehicle,
                        specId,
                        title: formRes.car?.title ?? state.vehicle.title,
                        dailyPrice: Number(formRes.car?.dailyPrice ?? 0),
                        monthlyPrice: Number(formRes.car?.monthlyPrice ?? 0),
                    },
                    insurance: {
                        ...state.insurance,
                        code: insuranceCode,     //  SHORT/LONG 상관없이 NONE
                        dailyPrice: dailyPrice,  //  0
                        summary: null,           // (선택) 이전 계산값 남아있으면 꼬일 수 있어 초기화 추천
                    },
                }));
            },


            // =================================================
            // 5. Payload Builders (백엔드 요청용)
            // =================================================

            /**
             * create payload 생성
             * 금액을 포함하지 않고, 서버가 스냅샷 확정하도록 필요한 식별자/기간/보험만 전달
             */
            getCreatePayload: () => {
                const state = get();

                const specId = state.vehicle.specId;
                if (!specId) throw new Error("specId가 없습니다. vehicle.specId를 먼저 세팅하세요.");

                const startDateTime = state.rentalPeriod?.startDateTime;
                const endDateTime = state.rentalPeriod?.endDateTime;
                if (!startDateTime || !endDateTime) throw new Error("기간(startDateTime/endDateTime)이 없습니다.");

                const rentType = String(state.rentType ?? "SHORT").toUpperCase();

                const pickupBranchId = state.pickupReturn.pickupBranch?.branchId ?? null;
                const returnBranchId = state.pickupReturn.dropoffBranch?.branchId ?? null;

                const pickupType = String(state.pickupReturn.pickupType ?? "VISIT").toUpperCase();

                //  returnType은 enum (VISIT / DROPZONE)
                const returnType = String(state.pickupReturn.returnType ?? "VISIT").toUpperCase();
                const dropzoneId = state.pickupReturn.dropzoneId ?? null;

                // 서버 스펙: dropzoneId는 선택(= returnType이 DROPZONE일 때만 의미)
                const safeDropzoneId = returnType === "DROPZONE" ? dropzoneId : null;

                // LONG months 처리
                const months = rentType === "LONG" ? Number(state.months ?? 0) : 0;

                return {
                    specId,
                    startDateTime,
                    endDateTime,
                    rentType,

                    pickupBranchId,
                    pickupType,

                    returnBranchId,
                    returnType,

                    dropzoneId: safeDropzoneId,

                    insuranceCode: String(state.insurance.code ?? "NONE").toUpperCase(),
                    driverInfo: state.driverInfo,
                    months,
                    agreement: Boolean(state.payment.agreement),
                };
            },


            getPayPayload: () => {
                const state = get();
                if (!state.reservationNo) {
                    console.error("reservationNo가 없습니다. /create 먼저 호출하세요.");
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

            // =================================================
            // 6. (선택) 상태 초기화/정리
            // =================================================
            resetReservation: () => { // 추가
                set({
                    reservationNo: null,
                    pickupBranchName: "",
                    startDate: "",
                    endDate: "",
                    driverInfo: {
                        lastname: "",
                        firstname: "",
                        phone: "",
                        email: "",
                        birth: "",
                    },
                    insurance: { code: "NONE", dailyPrice: 0, summary: null },
                    pickupReturn: {
                        pickupType: "VISIT",
                        returnType: "VISIT",
                        pickupBranch: null,
                        dropoffBranch: null,
                        dropzoneId: null,
                    },
                    rentalPeriod: { startDateTime: null, endDateTime: null },
                    rentType: "SHORT",
                    months: null,
                    vehicle: {
                        vehicleId: null,
                        specId: null,
                        title: "",
                        dailyPrice: 0,
                        monthlyPrice: 0,
                    },
                    payment: {
                        summary: { rentFee: 0, insuranceFee: 0, couponDiscount: 0, totalAmount: 0 },
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
                    priceLoading: false,
                    priceError: null,
                });
            },
        }),
        {
            name: "reservation-storage",
            // persist를 유지하되, 가격 summary까지 저장할지 여부는 팀 정책에 따라 선택입니다.
            // 발표 데모가 중요하면 유지해도 괜찮고, 정합성 엄격이면 payment.summary는 제외하는 것도 방법입니다.
            // partialize: (state) => ({ ...state, payment: { ...state.payment, summary: null } }),
        }
    )
);

export default useReservationStore;
