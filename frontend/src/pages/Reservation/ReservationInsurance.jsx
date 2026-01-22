import InsuranceDetailModal from "./InsuranceDetailModal";
import useReservationStore from "../../store/useReservationStore";
import { useState } from "react";
import api from "../../services/api";

const ReservationInsurance = ({ options }) => {
  const [showModal, setShowModal] = useState(false);

  const insurance = useReservationStore((s) => s.insurance);
  const setInsuranceCode = useReservationStore((s) => s.setInsuranceCode);
  const setInsuranceDailyPrice = useReservationStore((s) => s.setInsuranceDailyPrice);
  const setInsuranceSummary = useReservationStore((s) => s.setInsuranceSummary);

  // ✅ 1번 전략의 핵심: payment.summary를 직접 갱신
  const setPaymentSummary = useReservationStore((s) => s.setPaymentSummary);

  const rentalPeriod = useReservationStore((s) => s.rentalPeriod);
  const rentType = useReservationStore((s) => s.rentType);
  const months = useReservationStore((s) => s.months);
  const getCreatePayload = useReservationStore((s) => s.getCreatePayload);

  const selectedOption = insurance?.code || "NONE";

  const handleInsuranceChange = async (code, price) => {
    // 1) 즉시 UI 반영(선택 표시용)
    setInsuranceCode(code);
    setInsuranceDailyPrice(price);

    try {
      const startDate = rentalPeriod?.startDateTime;
      const endDate = rentalPeriod?.endDateTime;

      const createPayload = getCreatePayload?.(); // 이벤트에서 1번 호출
      const specId = Number(createPayload?.carId ?? createPayload?.specId);
      const finalRentType = String(rentType || createPayload?.rentType || "SHORT").toUpperCase();

      if (!specId || Number.isNaN(specId)) {
        console.error("specId 누락:", { specId, createPayload });
        return;
      }
      if (!startDate || !endDate) {
        console.error("기간 누락:", { startDate, endDate, rentalPeriod });
        return;
      }

      // ✅ v2 가격 API 호출
      const res = await api.get("/v2/reservations/price", {
        params: {
          specId,
          rentType: finalRentType,
          startDate,
          endDate,
          months: finalRentType === "LONG" ? months : undefined,
          insuranceCode: code,
        },
      });

      console.log("✅ PRICE res:", res.data);

      // ✅ 서버 응답 원본도 저장(선택)
      setInsuranceSummary(res.data);

      // ✅✅✅ (핵심) payment.summary를 서버값으로 “즉시 덮어쓰기”
      setPaymentSummary?.({
        rentFee: res.data?.rentFee ?? 0,
        insuranceFee: res.data?.insuranceFee ?? 0,
        couponDiscount: res.data?.couponDiscount ?? 0,
        totalPrice: res.data?.totalAmount ?? 0, // totalAmount -> totalPrice
      });

    } catch (err) {
      console.error("❌ 가격 재계산 실패:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
    }
  };

  return (
    <div className="w-full max-w-[640px] xx:p-2 sm:p-4 xx:space-y-3 sm:space-y-4">
      <h2 className="xx:text-base sm:text-lg font-bold">어떤 보험을 선택할까요?</h2>
      <p className="xx:text-sm sm:text-base text-gray-600">
        상대방과 나를 보호하는 종합보험이 포함되어 있어요.
      </p>

      <ul className="xx:space-y-3 sm:space-y-4">
        {options.map((option) => (
          <li
            key={option.code}
            className={`border rounded-lg p-4 cursor-pointer transition ${selectedOption === option.code
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300"
              }`}
            onClick={() => handleInsuranceChange(option.code, option.extraDailyPrice)}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{option.label}</h3>
                <p className="text-sm text-gray-500">{option.desc}</p>
              </div>
              <div className="text-brand font-bold">
                +{option.extraDailyPrice.toLocaleString()}원
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="text-center">
        <span
          className="text-sm text-blue-600 cursor-pointer hover:underline"
          onClick={() => setShowModal(true)}
        >
          보장내용을 알아볼까요?
        </span>
      </div>

      <InsuranceDetailModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default ReservationInsurance;
