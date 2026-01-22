// src/pages/Mypage/ReservationChangeDetail.jsx
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import useUserStore from "../../store/useUserStore";
import useReservationStore from "../../store/useReservationStore";
import api from "../../services/api";
import CardPaymentForm from "../Payment/CardPaymentForm.jsx";

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
    if (!price) return "0";
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

    const initialReservation = location.state?.reservation;
    const [reservation, setReservation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCarId, setSelectedCarId] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [cars, setCars] = useState([]); //
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [pickupLocation, setPickupLocation] = useState("김포공항");
    const [showPaymentForm, setShowPaymentForm] = useState(false);

    const startDateRef = useRef(null);
    const endDateRef = useRef(null);

    const methods = useForm({
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

    //  핵심 수정: 지점별 실제 차량 조회
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                let currentReservation;

                if (initialReservation) {
                    currentReservation = initialReservation;
                } else {
                    const res = await api.get(`/mypage/reservations/${reservationId}`);
                    currentReservation = res.data;
                }

                console.log("📋 현재 예약 정보 (branchId 확인):", currentReservation);

                //  1. 지점 차량 조회
                const branchId = currentReservation.branchId || currentReservation.branch_id; // 필드명 확인 필요
                if (branchId) {
                    const carsRes = await api.get(`/branches/${branchId}/cars`);
                    setCars(carsRes.data.cars || carsRes.data); // API 응답 형식에 맞게 조정
                    console.log("🚗 지점 차량 리스트:", carsRes.data);
                }

                const formatDateForAPI = (dateString) => {
                    if (!dateString) return null;
                    return new Date(dateString).toISOString().split('T')[0];
                };

                setReservation(currentReservation);
                setPickupLocation(currentReservation.pickupLocation || "김포공항");
                setSelectedCarId(currentReservation.carId);
                setStartDate(formatDateForAPI(currentReservation.startDate));
                setEndDate(formatDateForAPI(currentReservation.endDate));

                checkAdditionalPayment();

            } catch (err) {
                console.error("데이터 조회 실패:", err);
                setError("예약 정보를 불러올 수 없습니다.");
                // ❌ 지점 차량 API 실패시 임시 하드코딩 복구
                // setCars(HARD_CODED_CARS);
            } finally {
                setLoading(false);
            }
        };

        if (reservationId) {
            fetchData();
        }
    }, [reservationId, initialReservation]);

    const checkAdditionalPayment = () => {
        if (!reservation) return;

        const newPrice = calculateNewPrice();
        const oldPrice = reservation?.totalAmountSnapshot || 0;
        const priceDifference = newPrice - oldPrice;
        const needsAdditionalPayment = priceDifference > 0;

        setShowPaymentForm(needsAdditionalPayment);

        if (!needsAdditionalPayment) {
            methods.reset();
            setCardPayment(null);
        }
    };

    useEffect(() => {
        checkAdditionalPayment();
    }, [startDate, endDate, selectedCarId, reservation]);

    const calculateNewPrice = () => {
        if (!selectedCarId || !startDate || !endDate) return 0;
        if (new Date(endDate) <= new Date(startDate)) return 0;

        const newDays = calculateDays(startDate, endDate);
        const selectedCar = cars.find(c => c.id === selectedCarId);
        return newDays * (selectedCar?.dailyRate || 0);
    };

    const newPrice = calculateNewPrice();
    const oldPrice = reservation?.totalAmountSnapshot || 0;
    const priceDifference = newPrice - oldPrice;
    const isValidSelection = startDate && endDate && new Date(endDate) > new Date(startDate);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isValidSelection) {
            alert("유효한 기간을 선택해주세요.");
            return;
        }

        if (!selectedCarId || cars.length === 0) {
            alert("차종을 선택해주세요.");
            return;
        }

        if (priceDifference > 0) {
            const isFormValid = await methods.trigger();
            if (!isFormValid || !methods.getValues("agree")) {
                alert("결제 정보를 모두 입력하고 동의를 해주세요.");
                return;
            }
            const paymentData = methods.getValues();
            setCardPayment(paymentData);
        }

        setIsSubmitting(true);
        try {
            const selectedCar = cars.find(c => c.id === selectedCarId);
            const newDays = calculateDays(startDate, endDate);

            const payload = {
                action_type: 'CHANGE',
                old_start_date: reservation.startDate,
                old_end_date: reservation.endDate,
                old_car_name: `${reservation.brand} ${reservation.displayNameShort}`,
                old_price: oldPrice,
                new_start_date: startDate,
                new_end_date: endDate,
                new_car_name: `${selectedCar.brand} ${selectedCar.displayNameShort}`,
                new_car_id: selectedCarId,
                new_price: newPrice,
                price_difference: priceDifference,
                days: newDays
            };

            if (priceDifference > 0) {
                payload.payment_info = methods.getValues();
            }

            await api.post(`/reservation/${reservationId}/change`, payload);

            alert("예약이 변경되었습니다.");
            navigate("/Mypage/ReservationsList");
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
                <p className="text-red-500">{error || "예약을 찾을 수 없습니다."}</p>
            </div>
        );
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit} className="max-w-[640px] mx-auto p-4">
                {/* 기존 UI 완전 동일 */}
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
                            <span className="font-medium text-gray-900">{formatDate(reservation.startDate)}</span>
                        </div>
                        <div className="flex justify-between pb-3 border-b border-gray-200">
                            <span className="text-gray-600">반납 날짜</span>
                            <span className="font-medium text-gray-900">{formatDate(reservation.endDate)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">결제 금액</span>
                            <span className="font-bold text-lg text-gray-900">{formatPrice(oldPrice)}원</span>
                        </div>
                    </div>
                </div>

                {/* 변경할 차종 -  실제 지점 데이터 표시 */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">변경할 차종</h3>
                    <label className="block text-sm font-medium text-gray-700 mb-2">차종 선택</label>
                    <select
                        value={selectedCarId || ""}
                        onChange={(e) => setSelectedCarId(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2C7FFF] text-sm"
                        disabled={cars.length === 0}
                    >
                        <option value="">
                            {cars.length === 0 ? "차량 정보를 불러오는 중..." : "차종을 선택해주세요"}
                        </option>
                        {cars.map((car) => (
                            <option key={car.id} value={car.id}>
                                {car.brand} {car.displayNameShort} - {formatPrice(car.dailyRate)}원/일
                            </option>
                        ))}
                    </select>
                    {cars.length === 0 && (
                        <p className="text-xs text-gray-500 mt-1">지점 차량 정보를 불러오는 중...</p>
                    )}
                </div>

                {/* 변경할 기간 */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">변경할 기간</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">픽업 날짜</label>
                            <input
                                ref={startDateRef}
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2C7FFF] text-sm"
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">반납 날짜</label>
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
                <div className={`mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200 ${isValidSelection ? '' : 'opacity-70'}`}>
                    <h4 className="font-semibold text-gray-900 mb-3">금액 계산</h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">기존 금액</span>
                            <span className="text-gray-900">{formatPrice(oldPrice)}원</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">새 금액</span>
                            <span className={`font-medium ${isValidSelection ? 'text-gray-900' : 'text-gray-400'}`}>
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
                                        영업일 기준 1~3일 이내 초기 결제 수단으로 환불됩니다
                                    </p>
                                )}
                            </div>
                            <span className={`font-bold text-lg ${priceDifference > 0 ? 'text-red-600' : 'text-blue-600'}`}>
                                {priceDifference > 0 ? '+' : ''}{formatPrice(Math.abs(priceDifference))}원
                            </span>
                        </div>
                        <div className="text-xs text-red-500">
                            <p>*픽업 위치, 운전자 변경은 취소 후 다시 예약해주세요</p>
                        </div>
                    </div>
                </div>

                {/* 추가 결제 폼 */}
                {showPaymentForm && priceDifference > 0 && (
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-orange-200">
                        <div className="flex items-center mb-4">
                            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                            <h3 className="text-lg font-semibold text-red-600">추가 결제 정보 입력</h3>
                        </div>
                        <CardPaymentForm />
                    </div>
                )}

                {/* 버튼들 */}
                <div className="flex gap-3 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate("/Mypage/ReservationsList")}
                        className="flex-1 px-6 py-3 text-sm text-gray-600 hover:text-gray-900 font-medium hover:bg-gray-50 border border-gray-300 rounded-xl"
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        disabled={!isValidSelection || isSubmitting || (showPaymentForm && !methods.formState.isValid) || cars.length === 0}
                        className="flex-1 px-6 py-3 bg-[#2C7FFF] text-white font-medium rounded-xl shadow-sm hover:bg-[#1E5BBF] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isSubmitting ? "처리 중..." : "변경하기"}
                    </button>
                </div>
            </form>
        </FormProvider>
    );
}

export default ReservationChangeDetail;
