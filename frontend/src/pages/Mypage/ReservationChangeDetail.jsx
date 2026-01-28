// src/pages/Mypage/ReservationChangeDetail.jsx
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import useReservationStore from "../../store/useReservationStore";
import api from "../../services/api";
import CardPaymentForm from "../Payment/CardPaymentForm.jsx";
import InsuranceDetailModal from "../../pages/Reservation/InsuranceDetailModal.jsx"; // ✅ 추가

const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    const weekday = weekdays[date.getDay()];
    return `${year}. ${month}. ${day} (${weekday})`;
};

const formatPrice = (price) => {
    if (!price && price !== 0) return "0";
    return Number(price).toLocaleString();
};

const calculateDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
};

function ReservationChangeDetail() {
    const navigate = useNavigate();
    const location = useLocation();
    const { reservationId } = useParams();
    const setCardPayment = useReservationStore((state) => state.setCardPayment);

    // ✅ 로컬 보험 상태
    const [localInsurance, setLocalInsurance] = useState({
        code: "NONE",
        extraDailyPrice: 0,
        price: 0
    });
    // ✅ 모달 상태
    const [showInsuranceModal, setShowInsuranceModal] = useState(false);

    const [reservation, setReservation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedCarId, setSelectedCarId] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [cars, setCars] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [pickupLocation, setPickupLocation] = useState("");
    const [showPaymentForm, setShowPaymentForm] = useState(false);

    const startDateRef = useRef(null);
    const endDateRef = useRef(null);

    const methods = useForm({
        mode: "onChange",
        defaultValues: {
            cardNumber: "",
            expiry: "",
            cvc: "",
            password2: "",
            cardType: "personal",
            installment: "일시불",
            agree: false
        }
    });

    const calculateNewPrice = useCallback(() => {
        if (!selectedCarId || !startDate || !endDate) return 0;
        if (new Date(endDate) <= new Date(startDate)) return 0;

        const days = calculateDays(startDate, endDate);
        const selectedCar = cars.find((c) => String(c.specId) === String(selectedCarId)
        );
        if (!selectedCar) return 0;

        const carDailyPrice = Number(
            selectedCar.dailyPrice || selectedCar.originalPrice || 0
        );
        const extraDailyInsurance = Number(localInsurance?.extraDailyPrice || 0);

        const totalPerDay = carDailyPrice + extraDailyInsurance;
        const total = totalPerDay * days;

        console.log("💰 금액 계산:", {
            car: selectedCar.displayNameShort,
            carDailyPrice,
            extraDailyInsurance,
            days,
            totalPerDay,
            total
        });

        return total;
    }, [selectedCarId, startDate, endDate, cars, localInsurance?.extraDailyPrice]);

    const newPrice = useMemo(() => calculateNewPrice(), [calculateNewPrice]);
    const oldPrice = reservation?.totalAmountSnapshot || 0;
    const priceDifference = newPrice - oldPrice;
    const isValidSelection =
        startDate && endDate && new Date(endDate) > new Date(startDate);

    useEffect(() => {
        console.log("📊 의존성 변경 감지:", {
            insurance: localInsurance?.extraDailyPrice,
            startDate,
            endDate,
            selectedCarId
        });

        if (!reservation) return;

        const currentNewPrice = calculateNewPrice();
        const oldPriceVal = reservation?.totalAmountSnapshot || 0;

        console.log("✅ 최종 가격 업데이트:", {
            newPrice: currentNewPrice,
            oldPrice: oldPriceVal,
            priceDiff: currentNewPrice - oldPriceVal
        });

        setShowPaymentForm(currentNewPrice - oldPriceVal > 0);
    }, [startDate, endDate, selectedCarId, reservation, cars, localInsurance?.extraDailyPrice]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const res = await api.get(`/mypage/reservations-list/${reservationId}`);
                const currentReservation = res.data;
                console.log("📋 현재 예약 정보:", currentReservation);

                const branchId = currentReservation.pickupBranchId;
                if (!branchId) throw new Error("브랜치 ID가 존재하지 않습니다.");

                let pickupLocationName = "";
                try {
                    const branchRes = await api.get(`/branches/${branchId}`);
                    pickupLocationName =
                        branchRes.data.name || branchRes.data.branchName || "픽업 지점";
                } catch (branchErr) {
                    console.error("❌ 브랜치 에러:", branchErr);
                    pickupLocationName =
                        currentReservation.pickupAddress || "픽업 지점";
                }

                const formatDateForAPI = (dateString) =>
                    dateString
                        ? new Date(dateString).toISOString().split("T")[0]
                        : null;

                const formattedStartDate = formatDateForAPI(currentReservation.startDate);
                const formattedEndDate = formatDateForAPI(currentReservation.endDate);

                let carsData = [];
                if (formattedStartDate && formattedEndDate) {
                    const carsParams = {
                        pickupBranchId: String(branchId),
                        returnBranchId: String(branchId),
                        rentType: "SHORT",
                        startDate: `${formattedStartDate} 10:00:00`,
                        endDate: `${formattedEndDate} 10:00:00`
                    };

                    const carsRes = await api.get(`/cars`, { params: carsParams });
                    console.log("✅ 차량 API 응답:", carsRes.data);

                    carsData = Array.isArray(carsRes.data)
                        ? carsRes.data
                        : carsRes.data?.cars || [];

                    carsData = carsData.map((car) => ({
                        ...car,
                        dailyPrice: Number(car.originalPrice || car.finalPrice || 0),
                        specId: car.specId
                    }));

                    setCars(carsData);

                    const currentSpecId =
                        currentReservation.specId ||
                        currentReservation.vehicleId ||
                        currentReservation.carId;
                    const matched = carsData.find((car) => car.specId === currentSpecId);
                    if (matched) {
                        setSelectedCarId(matched.specId);
                        console.log("🎯 현재 차량 선택:", matched.displayNameShort);
                    }
                }

                setReservation(currentReservation);
                setPickupLocation(pickupLocationName);
                setStartDate(formattedStartDate);
                setEndDate(formattedEndDate);
            } catch (err) {
                console.error("❌ 데이터 조회 실패:", err);
                setError("예약 정보를 불러올 수 없습니다.");
            } finally {
                setLoading(false);
            }
        };

        if (reservationId) fetchData();
    }, [reservationId]);

    const resolveInsuranceId = () => {
        const extra = Number(localInsurance?.extraDailyPrice || 0);
        if (extra === 0) return 1;
        if (extra === 15000) return 2;
        if (extra === 30000) return 3;
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isValidSelection) {
            alert("유효한 기간을 선택해주세요.");
            return;
        }
        if (!selectedCarId) {
            alert("차종을 선택해주세요.");
            return;
        }

        if (priceDifference > 0) {
            const isValidForm = await methods.trigger();
            if (!isValidForm || !methods.getValues("agree")) {
                alert("결제 정보를 모두 입력하고 동의를 해주세요.");
                return;
            }
            setCardPayment(methods.getValues());
        }

        setIsSubmitting(true);
        try {
            const selectedCar = cars.find((c) => c.specId === selectedCarId);
            const days = calculateDays(startDate, endDate);

            const payload = {
                actionType: "CHANGE",
                oldStartDate: reservation.startDate,
                oldEndDate: reservation.endDate,
                oldCarName: `${reservation.brand} ${reservation.displayNameShort}`,
                oldPrice,
                newStartDate: startDate,
                newEndDate: endDate,
                newCarName: `${selectedCar?.brand || reservation.brand} ${
                    selectedCar?.displayNameShort || reservation.displayNameShort
                }`,
                newCarId: Number(selectedCarId),
                newPrice,
                priceDifference,
                days,
                insuranceExtraDailyPrice: Number(localInsurance?.extraDailyPrice || 0),
                insuranceId: resolveInsuranceId()
            };

            if (priceDifference > 0) {
                payload.paymentInfo = methods.getValues();
            }

            console.log("📦 예약 변경 payload:", payload);

            await api.post(`/reservation/${reservationId}/change`, payload);
            alert("예약이 변경되었습니다.");
            navigate("/mypage/reservations");
        } catch (err) {
            console.error("예약 변경 실패:", err);
            alert(err.response?.data?.message || "예약 변경에 실패했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[300px]">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-2 text-gray-600">정보를 불러오는 중...</span>
            </div>
        );
    }

    if (error || !reservation) {
        return (
            <div className="flex justify-center items-center min-h-[300px]">
                <p className="text-red-500">
                    {error || "예약을 찾을 수 없습니다."}
                </p>
            </div>
        );
    }

    return (
        <>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit} className="max-w-[640px] mx-auto p-4">
                    <div className="mb-6">
                        <button
                            type="button"
                            onClick={() => navigate("/Mypage/ReservationsList")}
                            className="text-sm text-[#1D6BF3] hover:underline"
                        >
                            &lt; 돌아가기
                        </button>
                    </div>

                    <h2 className="text-xl font-bold mb-2 ml-2 py-3">예약 변경</h2>

                    {/* 현재 예약 정보 */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
                        <h3 className="text-lg font-semibold mb-4">현재 예약 정보</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                                <span className="text-gray-600">픽업 위치</span>
                                <span className="flex items-center">
                                    <span className="px-2 py-1 bg-gray-100 text-xs text-gray-500 rounded-full mr-2">
                                        변경 불가
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        {pickupLocation}
                                    </span>
                                </span>
                            </div>
                            <div className="flex justify-between pb-3 border-b border-gray-200">
                                <span className="text-gray-600">차종</span>
                                <span className="font-medium text-gray-900">
                                    {reservation.brand} {reservation.displayNameShort}
                                </span>
                            </div>
                            <div className="flex justify-between pb-3 border-b border-gray-200">
                                <span className="text-gray-600">픽업 날짜</span>
                                <span className="font-medium text-gray-900">
                                    {formatDate(reservation.startDate)}
                                </span>
                            </div>
                            <div className="flex justify-between pb-3 border-b border-gray-200">
                                <span className="text-gray-600">반납 날짜</span>
                                <span className="font-medium text-gray-900">
                                    {formatDate(reservation.endDate)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">결제 금액</span>
                                <span className="font-bold text-lg text-gray-900">
                                    {formatPrice(oldPrice)}원
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ✅ 인라인 보험 선택 + 모달 링크 */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
                        <h3 className="text-lg font-semibold mb-4">보험 선택</h3>

                        <div className="grid grid-cols-3 gap-4 mb-4">
                            {[
                                { code: "NONE", label: "미가입", desc: "고객부담 전액", price: 0 },
                                { code: "STANDARD", label: "일반자차", desc: "고객부담 30만", price: 15000 },
                                { code: "FULL", label: "완전자차", desc: "고객부담 면제", price: 30000 }
                            ].map((option) => (
                                <div
                                    key={option.code}
                                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                                        localInsurance?.price === option.price
                                            ? "border-blue-500 bg-blue-50 shadow-md"
                                            : "border-gray-300 hover:border-gray-400"
                                    }`}
                                    onClick={() => setLocalInsurance({
                                        code: option.code,
                                        extraDailyPrice: option.price,
                                        price: option.price
                                    })}
                                >
                                    <div className="text-center">
                                        <div className="font-bold text-lg text-blue-600 mb-1">
                                            +{formatPrice(option.price)}
                                        </div>
                                        <div className="font-semibold text-sm mb-1">{option.label}</div>
                                        <div className="text-xs text-gray-500">{option.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center">
                            <span
                                className="text-sm text-blue-600 cursor-pointer hover:underline"
                                onClick={() => setShowInsuranceModal(true)}
                            >
                                보장내용을 알아볼까요?
                            </span>
                        </div>
                    </div>

                    {/* 차종 선택 */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
                        <h3 className="text-lg font-semibold mb-4">변경할 차종</h3>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            차종 선택
                        </label>
                        <select
                            value={selectedCarId || ""}
                            onChange={(e) => setSelectedCarId(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2C7FFF] text-sm"
                            disabled={cars.length === 0}
                        >
                            <option value="">
                                {cars.length === 0
                                    ? "차량 정보를 불러오는 중..."
                                    : "차종을 선택해주세요"}
                            </option>
                            {cars.map((car) => {
                                const carSpecId = String(car.specId);
                                const carDailyPrice = Number(
                                    car.dailyPrice || car.originalPrice || 0
                                );
                                return (
                                    <option key={carSpecId} value={carSpecId}>
                                        {car.displayNameShort} - {formatPrice(carDailyPrice)}원/일
                                    </option>
                                );
                            })}
                        </select>
                        {cars.length === 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                                지점 차량 정보를 불러오는 중...
                            </p>
                        )}
                    </div>

                    {/* 기간 선택 */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
                        <h3 className="text-lg font-semibold mb-4">변경할 기간</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    픽업 날짜
                                </label>
                                <input
                                    ref={startDateRef}
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2C7FFF] text-sm"
                                    min={new Date().toISOString().split("T")[0]}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    반납 날짜
                                </label>
                                <input
                                    ref={endDateRef}
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2C7FFF] text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 금액 계산 */}
                    <div
                        className={`mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200 ${
                            isValidSelection ? "" : "opacity-70"
                        }`}
                    >
                        <h4 className="font-semibold text-gray-900 mb-3">
                            금액 계산
                        </h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">기존 금액</span>
                                <span className="text-gray-900">
                                    {formatPrice(oldPrice)}원
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">새 금액</span>
                                <span
                                    className={`font-medium ${
                                        isValidSelection
                                            ? "text-gray-900"
                                            : "text-gray-400"
                                    }`}
                                >
                                    {formatPrice(newPrice)}원
                                </span>
                            </div>
                            <div className="border-t border-blue-200 pt-2 flex justify-between items-start">
                                <div>
                                    <span className="font-medium text-gray-900 block">
                                        {priceDifference > 0 ? "추가 결제" : "환불"}
                                    </span>
                                    {priceDifference <= 0 && (
                                        <p className="text-xs text-blue-600 mt-1">
                                            영업일 기준 1~3일 이내 초기 결제 수단으로
                                            환불됩니다
                                        </p>
                                    )}
                                </div>
                                <span
                                    className={`font-bold text-lg ${
                                        priceDifference > 0
                                            ? "text-red-600"
                                            : "text-blue-600"
                                    }`}
                                >
                                    {priceDifference > 0 ? "+" : ""}
                                    {formatPrice(Math.abs(priceDifference))}원
                                </span>
                            </div>
                            <div className="text-xs text-red-500">
                                <p>
                                    픽업 위치, 운전자 변경은 취소 후 다시
                                    예약해주세요
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 결제 폼 */}
                    {showPaymentForm && priceDifference > 0 && (
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-orange-200">
                            <div className="flex items-center mb-4">
                                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                                <h3 className="text-lg font-semibold text-red-600">
                                    추가 결제 정보 입력
                                </h3>
                            </div>
                            <CardPaymentForm />
                        </div>
                    )}

                    {/* 버튼 */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate("/mypage/reservations")}
                            className="flex-1 px-6 py-3 text-sm text-gray-600 hover:text-gray-900 font-medium hover:bg-gray-50 border border-gray-300 rounded-xl"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            disabled={
                                !isValidSelection ||
                                isSubmitting ||
                                (showPaymentForm && !methods.formState.isValid)
                            }
                            className="flex-1 px-6 py-3 bg-[#2C7FFF] text-white font-medium rounded-xl shadow-sm hover:bg-[#1E5BBF] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSubmitting ? "처리 중..." : "변경하기"}
                        </button>
                    </div>
                </form>
            </FormProvider>

                      {/* ✅ 보험 상세 모달 */}
            <InsuranceDetailModal
                isOpen={showInsuranceModal}
                onClose={() => setShowInsuranceModal(false)}
            />
        </>
    );
}

export default ReservationChangeDetail;
