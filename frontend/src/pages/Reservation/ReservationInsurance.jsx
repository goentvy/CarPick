import InsuranceDetailModal from "./InsuranceDetailModal";
import useReservationStore from "../../store/useReservationStore";
import { useState } from "react";
import axios from "axios";

const ReservationInsurance = ({ options }) => {
  // 스토어에서 보험 관련 상태와 액션 가져오기
  const {
    insurance,
    setInsuranceCode,
    setInsuranceDailyPrice,
    setInsuranceSummary,
    calculatePaymentSummary,
  } = useReservationStore();

  // 현재 선택된 보험 코드
  const selectedOption = insurance?.code || "NONE";
  const [showModal, setShowModal] = useState(false);

  const handleInsuranceChange = (code, price) => {
    setInsuranceCode(code); // 보험 코드 저장
    setInsuranceDailyPrice(price); // 보험 일일 요금 저장
    calculatePaymentSummary(); // 결제 요약 재계산

    // 가격 재계산 API 호출
    axios
      .post(`/api/reservation/price?carId=1`, { insuranceCode: code })
      .then((res) => {
        // 보험 가격 업데이트
        setInsuranceDailyPrice(res.data.insurancePrice);
        // 전체 요약 저장
        setInsuranceSummary(res.data);
        // 결제 요약 재계산 및 결제 요약 컴포넌트 갱신
        calculatePaymentSummary();
      })
      .catch((err) => console.error("가격 재계산 실패:", err));
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
            className={`border rounded-lg p-4 cursor-pointer transition ${
              selectedOption === option.code
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
