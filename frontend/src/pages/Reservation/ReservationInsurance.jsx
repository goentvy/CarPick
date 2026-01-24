import InsuranceDetailModal from "./InsuranceDetailModal";
import useReservationStore from "../../store/useReservationStore";
import { useState } from "react";

const ReservationInsurance = ({ options }) => {
  const [showModal, setShowModal] = useState(false);

  const insurance = useReservationStore((s) => s.insurance);
  const priceLoading = useReservationStore((s) => s.priceLoading);
  const priceError = useReservationStore((s) => s.priceError);

  // store가 보험 선택 + price API 호출 + payment.summary 갱신까지 책임
  const selectInsuranceAndRefreshPrice = useReservationStore(
    (s) => s.selectInsuranceAndRefreshPrice
  );

  const selectedOption = insurance?.code || "NONE";

  const handleInsuranceChange = async (code, extraDailyPrice) => {
    try {
      await selectInsuranceAndRefreshPrice(code, extraDailyPrice);
    } catch (err) {
      // store가 priceError를 세팅하므로 여기서는 최소 로그만
      console.error("가격 재계산 실패:", err);
    }
  };

  return (
    <div className="w-full max-w-[640px] xx:p-2 sm:p-4 xx:space-y-3 sm:space-y-4">
      <h2 className="xx:text-base sm:text-lg font-bold">어떤 보험을 선택할까요?</h2>
      <p className="xx:text-sm sm:text-base text-gray-600">
        상대방과 나를 보호하는 종합보험이 포함되어 있어요.
      </p>

      {/* 선택: 로딩/에러 UI */}
      {priceLoading && (
        <div className="text-sm text-gray-500">가격을 다시 계산 중입니다...</div>
      )}
      {!!priceError && (
        <div className="text-sm text-red-500">
          가격 재계산에 실패했습니다. 잠시 후 다시 시도해주세요.
        </div>
      )}

      <ul className="xx:space-y-3 sm:space-y-4">
        {options.map((option) => (
          <li
            key={String(option.code)}
            //  여기 백틱(`) 추가했습니다!
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
                +{Number(option.extraDailyPrice ?? 0).toLocaleString()}원
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
