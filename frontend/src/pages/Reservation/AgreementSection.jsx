import { useFormContext } from "react-hook-form";
import useReservationStore from "../../store/useReservationStore";
import api from "../../services/api";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const AgreementSection = ({ isLoggedIn }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const {
        handleSubmit,
        formState: { isSubmitting },
    } = useFormContext();

    // Zustand actions/selectors
    const setCardPayment = useReservationStore((state) => state.setCardPayment);
    const setDriverInfo = useReservationStore((state) => state.setDriverInfo);
    const getCreatePayload = useReservationStore((state) => state.getCreatePayload);
    const getPayPayload = useReservationStore((state) => state.getPayPayload);

    const rentalPeriod = useReservationStore((state) => state.rentalPeriod);
    const totalPrice = useReservationStore((state) => state.payment.summary?.totalPrice || 0);
    const setReservationNo = useReservationStore((state) => state.setReservationNo);

    // ✅ 결제 버튼 클릭 시 실행
    const onSubmit = async (formData) => {
        console.log("===== [onSubmit START] =====");
        console.log("URL search:", window.location.search);
        console.log("rentalPeriod:", rentalPeriod);
        console.log("store create payload (raw):", getCreatePayload());

        // 0) 기간 체크 (스토어 기준)
        const storeStart = rentalPeriod?.startDateTime;
        const storeEnd = rentalPeriod?.endDateTime;
        if (!storeStart || !storeEnd) {
            alert("예약 기간 정보가 누락되었습니다. 다시 처음부터 진행해주세요.");
            navigate("/day");
            return;
        }

        // 1) 운전자 정보 추출 및 store 저장
        const { birth, email, firstName, lastName, phone } = formData;
        setDriverInfo({
            birth,
            email,
            phone,
            firstname: firstName,
            lastname: lastName,
        });

        // 2) 카드 결제 정보 추출 및 store 저장
        const { cardNumber, expiry, cvc, password2, cardType, installment, agree } = formData;
        setCardPayment({
            cardNumber,
            expiry,
            cvc,
            password2,
            cardType,
            installment,
            agree,
        });

        try {
            // store payload는 1번만
            const storeCreatePayload = getCreatePayload();

            // ✅ URL 파라미터 추출 (MVP: startDate/endDate 기준)
            const urlPickupIdRaw = searchParams.get("pickupBranchId");
            const urlReturnIdRaw = searchParams.get("returnBranchId");
            const urlStart = searchParams.get("startDate"); // ✅ startDate
            const urlEnd = searchParams.get("endDate");     // ✅ endDate
            const urlRentTypeRaw = searchParams.get("rentType");

            console.log("[URL PARAMS]", {
                urlPickupIdRaw,
                urlReturnIdRaw,
                urlStart,
                urlEnd,
                urlRentTypeRaw,
            });

            // ✅ 최종 값 계산
            const finalStart = urlStart || storeStart;
            const finalEnd = urlEnd || storeEnd;

            const finalPickupId = Number(urlPickupIdRaw || storeCreatePayload?.pickupBranchId);
            const finalReturnId = Number(urlReturnIdRaw || storeCreatePayload?.returnBranchId || finalPickupId);

            const finalRentType = String(urlRentTypeRaw || storeCreatePayload?.rentType || "SHORT").toUpperCase();
            // ✅ months 계산 (LONG 전용)
            const urlMonthsRaw = searchParams.get("months");
            const storeMonths = storeCreatePayload?.months;

            const finalMonths =
                finalRentType === "LONG"
                    ? Number(urlMonthsRaw || storeMonths || 0)
                    : undefined;

            // 안전장치 (프런트에서 1차 차단)
            if (finalRentType === "LONG" && (!finalMonths || Number.isNaN(finalMonths) || finalMonths <= 0)) {
                alert("장기 렌트 개월 수(months)가 올바르지 않습니다. 다시 선택해주세요.");
                navigate("/day");
                return;
            }

            // ✅ store에서는 carId로 들고있지만 백엔드는 specId 요구
            const finalSpecId = Number(storeCreatePayload?.carId);

            console.log("===== [FINAL VALUES] =====");
            console.log({
                finalSpecId,
                finalPickupId,
                finalReturnId,
                finalStart,
                finalEnd,
                finalRentType,
                insuranceCode: storeCreatePayload?.insuranceCode,
            });

            // ✅ 필수값 검증
            if (!finalSpecId || Number.isNaN(finalSpecId)) {
                alert("차종 정보(specId)가 누락되었습니다. 차량을 다시 선택해주세요.");
                navigate("/day");
                return;
            }
            if (!finalStart || !finalEnd) {
                alert("예약 기간 정보가 누락되었습니다. 다시 검색해주세요.");
                navigate("/day");
                return;
            }
            if (!finalPickupId || Number.isNaN(finalPickupId)) {
                alert("인수 지점(pickupBranchId) 정보가 누락되었습니다. 다시 검색해주세요.");
                navigate("/day");
                return;
            }

            // (MVP 핵심) create 직전 서버 가격 확정 → 버튼/표시 totalPrice 동기화
            // - startDate/endDate 로 호출
            const priceRes = await api.get("/v2/reservations/price", {
                params: {
                    specId: finalSpecId,
                    rentType: finalRentType,
                    startDate: finalStart,
                    endDate: finalEnd,
                    insuranceCode: storeCreatePayload?.insuranceCode || "STANDARD",
                    months: finalMonths,
                    // couponCode: storeCreatePayload?.couponCode,
                },
            });
            console.log({ urlMonthsRaw, finalMonths })
            console.log(" PRICE res:", priceRes.data);

            const serverTotal = priceRes.data?.totalAmount ?? 0;

            // 버튼 표시용 totalPrice를 서버값으로 덮어쓰기 (MVP)
            useReservationStore.getState().setPaymentSummary?.({
                totalPrice: serverTotal,
            });

            // ✅ driverInfo는 formData 기준으로 보내는 게 안전
            const driverInfo = {
                birth,
                email,
                phone,
                firstname: firstName,
                lastname: lastName,
            };

            // ✅ 최종 create payload
            const createPayload = {
                specId: finalSpecId,
                startDateTime: finalStart, // 서버 create DTO가 startDateTime을 받는 구조 유지
                endDateTime: finalEnd,
                rentType: finalRentType,
                pickupBranchId: finalPickupId,
                returnBranchId: finalReturnId,
                insuranceCode: storeCreatePayload?.insuranceCode || "STANDARD",
                driverInfo,
                agreement: true,
            };

            console.log("🚀 FINAL CREATE payload:", createPayload);

            const createRes = await api.post("/reservation/create", createPayload);

            const newReservationNo = createRes.data?.reservationNo;
            if (!newReservationNo) {
                alert("예약번호 생성에 실패했습니다.");
                return;
            }

            setReservationNo(newReservationNo);
            console.log("✅ reservationNo 저장:", newReservationNo);

            // create 응답 totalPrice가 있으면 최종적으로 한 번 더 반영(없으면 serverTotal 유지)
            const createdTotalPrice = createRes.data?.totalPrice ?? serverTotal ?? 0;
            useReservationStore.getState().setPaymentSummary?.({
                totalPrice: createdTotalPrice,
            });

            // ✅ 결제 승인
            const payPayload = { ...getPayPayload(), reservationNo: newReservationNo };
            console.log("✅ PAY payload:", payPayload);

            const payRes = await api.post("/reservation/pay", payPayload);

            if (payRes.data?.status === "APPROVED") {
                alert("결제가 완료되었습니다!");
                const orderId = payRes.data.orderId || newReservationNo;
                navigate("/order/complete", { state: { orderId, totalPrice: createdTotalPrice } });
            } else {
                alert("결제 실패: " + (payRes.data?.message || "승인 실패"));
            }
        } catch (err) {
            console.error("❌ 최종 결제 중 에러:", {
                message: err.message,
                status: err.response?.status,
                data: err.response?.data,
            });

            const serverMsg = err.response?.data?.message || "서버 오류가 발생했습니다.";
            alert(`예약 실패: ${serverMsg}`);
        }
    };

    return (
        <section className="w-full max-w-[640px] xx:p-2 sm:p-4 mb-[60px]">
            <h2 className="text-lg font-semibold mb-4">약관 및 결제 동의</h2>

            {/* 약관 목록 */}
            <ul className="space-y-2">
                <li><Link to="/agree1">서비스 이용약관</Link></li>
                <li><Link to="/agree2">개인정보 수집 이용 동의</Link></li>
            </ul>

            {/* 결제 동의 문구 */}
            <div className="mt-4">
                <p className="xx:text-sm sm:text-base text-center text-brand font-bold">
                    위 내용을 모두 확인하였으며, 결제에 동의합니다.
                </p>
            </div>

            {/* 결제 버튼 */}
            <div className="mt-6 flex space-x-4">
                <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleSubmit(onSubmit)}
                    className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors duration-200 
            ${isLoggedIn
                            ? isSubmitting
                                ? "bg-gray-400 cursor-not-allowed text-white"
                                : "bg-brand hover:bg-blue-600 text-white"
                            : isSubmitting
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                >
                    {isSubmitting
                        ? "결제 처리 중..."
                        : isLoggedIn
                            ? `${totalPrice.toLocaleString()}원 결제하기`
                            : `비회원 ${totalPrice.toLocaleString()}원 결제하기`}
                </button>
            </div>
        </section>
    );
};

export default AgreementSection;
