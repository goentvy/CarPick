import { useFormContext } from "react-hook-form";
import useReservationStore from "../../store/useReservationStore";
import api from "../../services/api";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const AgreementSection = ({ isLoggedIn }) => {
    console.log("Agreement URL search =", window.location.search);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    // const { handleSubmit } = useFormContext();
    const { handleSubmit, formState: { isSubmitting } } = useFormContext();

    // Zustand actions/selectors
    const setCardPayment = useReservationStore((state) => state.setCardPayment);
    const setDriverInfo = useReservationStore((state) => state.setDriverInfo);
    const getCreatePayload = useReservationStore((state) => state.getCreatePayload);
    const getPayPayload = useReservationStore((state) => state.getPayPayload);

    const rentalPeriod = useReservationStore((state) => state.rentalPeriod);
    const totalPrice = useReservationStore((state) => state.payment.summary?.totalPrice || 0);
    const setReservationNo = useReservationStore((state) => state.setReservationNo);




    // 결제 버튼 클릭 시 실행
    const onSubmit = async (formData) => {
        //  0) 기간 먼저 체크 (getCreatePayload 호출 전에!)
        const startDateTime = rentalPeriod?.startDateTime;
        const endDateTime = rentalPeriod?.endDateTime;
        if (!startDateTime || !endDateTime) {
            alert("예약 기간 정보가 누락되었습니다. 다시 처음부터 진행해주세요.");
            navigate("/day"); // 또는 /day 로 보내기
            return;
        }
        // 1) 운전자 정보 추출 및 저장
        const { birth, email, firstName, lastName, phone } = formData;
        // ✅ 수정 ①: 백엔드 DTO / store 키와 맞추기
        // (firstName / lastName → firstname / lastname)
        setDriverInfo({
            birth,
            email,
            phone,
            firstname: firstName,
            lastname: lastName,
        });
        // 2) 카드 결제 정보 추출 및 저장
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
        // ✅ AgreementSection.jsx (핵심 부분만)

        try {
            // ✅ store payload는 1번만
            const storeCreatePayload = getCreatePayload();

            // ✅ URL에서 값 추출
            const urlPickupIdRaw = searchParams.get("pickupBranchId");
            const urlReturnIdRaw = searchParams.get("returnBranchId");
            const urlStart = searchParams.get("startDateTime");
            const urlEnd = searchParams.get("endDateTime");
            const urlRentTypeRaw = searchParams.get("rentType");

            // ✅ final 값 먼저 선언(중요)
            const finalStart = urlStart || rentalPeriod?.startDateTime;
            const finalEnd = urlEnd || rentalPeriod?.endDateTime;

            const finalPickupId = Number(urlPickupIdRaw || storeCreatePayload?.pickupBranchId);
            const finalReturnId = Number(urlReturnIdRaw || storeCreatePayload?.returnBranchId || finalPickupId);

            const finalRentType = String(urlRentTypeRaw || storeCreatePayload?.rentType || "SHORT").toUpperCase();
            const finalCarId = Number(storeCreatePayload?.carId);

            // ✅ 이제 로그 찍기 (선언 후!)
            console.log("[Agreement] FINAL", {
                finalCarId,
                finalPickupId,
                finalReturnId,
                finalStart,
                finalEnd,
                finalRentType,
            });

            // ✅ 필수값 검증
            if (!finalCarId || Number.isNaN(finalCarId)) {
                alert("차량 정보(carId)가 누락되었습니다. 차량을 다시 선택해주세요.");
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

            // ✅ driverInfo는 formData 기준으로 만들어서 보내는 게 안전합니다.
            const driverInfo = {
                birth,
                email,
                phone,
                firstname: firstName,
                lastname: lastName,
            };

            // ✅ 최종 create payload
            const createPayload = {
                carId: finalCarId,
                pickupBranchId: finalPickupId,
                returnBranchId: finalReturnId,
                startDateTime: finalStart,
                endDateTime: finalEnd,
                rentType: finalRentType,

                insuranceCode: storeCreatePayload?.insuranceCode || "STANDARD",
                agreement: true,
                driverInfo,
                method: storeCreatePayload?.method || "visit",
            };

            console.log("✅ FINAL CREATE payload:", createPayload);

            const createRes = await api.post("/reservation/create", createPayload);

            const newReservationNo = createRes.data?.reservationNo;
            if (!newReservationNo) {
                alert("예약번호 생성에 실패했습니다.");
                return;
            }

            setReservationNo(newReservationNo);
            console.log("✅ reservationNo 저장:", newReservationNo);
            const createdTotalPrice = createRes.data?.totalPrice ?? 0;

            // store에 넣어서 화면 표시/다음 페이지 전달값을 확정
            useReservationStore.getState().setPaymentSummary?.({
                totalPrice: createdTotalPrice,
            });
            // 결제 승인
            const payPayload = { ...getPayPayload(), reservationNo: newReservationNo };
            console.log("✅ PAY payload:", payPayload);

            const payRes = await api.post("/reservation/pay", payPayload);

            if (payRes.data?.status === "APPROVED") {
                alert("결제가 완료되었습니다!");
                const orderId = payRes.data.orderId || newReservationNo;
                navigate("/order/complete", { state: { orderId, totalPrice } });
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
                <li><Link to="">개인정보 제3자 제공 동의</Link></li>
                <li><Link to="">이용 안내</Link></li>
                <li><Link to="">취소 안내</Link></li>
                <li><Link to="">자동차 대여 표준 약관</Link></li>
            </ul>

            {/* 결제 동의 문구 */}
            <div className="mt-4">
                <p className="xx:text-sm sm:text-base text-center text-brand font-bold">
                    위 내용을 모두 확인하였으며, 결제에 동의합니다.
                </p>
            </div>

            {/* 결제 버튼 */}
            <div className="mt-6 flex space-x-4">
                {isLoggedIn ? (
                    <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={handleSubmit(onSubmit)}
                        className={`flex-1 px-6 py-3 rounded-lg text-white font-semibold transition-colors duration-200 
        ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-brand hover:bg-blue-600"}`}
                    >
                        {isSubmitting ? "결제 처리 중..." : `${totalPrice.toLocaleString()}원 결제하기`}
                        {/* {totalPrice.toLocaleString()}원 결제하기 */}
                    </button>
                ) : (
                    <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={handleSubmit(onSubmit)}
                        className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors duration-200
        ${isSubmitting
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}

                    // className="flex-1 px-6 py-3 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors duration-200"
                    >
                        {isSubmitting ? "처리 중..." : `비회원 ${totalPrice.toLocaleString()}원 결제하기`}
                        {/* 비회원 {totalPrice.toLocaleString()}원 결제하기 */}
                    </button>
                )}
            </div>
        </section>
    );
};

export default AgreementSection;
