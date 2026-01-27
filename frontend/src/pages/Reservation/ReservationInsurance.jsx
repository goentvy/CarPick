import InsuranceDetailModal from "./InsuranceDetailModal";
import useReservationStore from "../../store/useReservationStore";
import { useMemo, useState } from "react";

// ✅ 백 정책과 동일: 24시간 올림(ceil), 최소 1일
const MINUTES_PER_DAY = 24 * 60;

function parseKoreanDateTime(str) {
  // "yyyy-MM-dd HH:mm:ss" -> Date 파싱용
  // 브라우저별 파싱 이슈 방지용으로 T로 치환
  return new Date(str.replace(" ", "T"));
}

function calcChargeDays(startStr, endStr) {
  if (!startStr || !endStr) return 1;

  const start = parseKoreanDateTime(startStr);
  const end = parseKoreanDateTime(endStr);

  const diffMs = end.getTime() - start.getTime();
  if (!Number.isFinite(diffMs) || diffMs <= 0) return 1;

  const totalMinutes = Math.ceil(diffMs / 60000);
  const days = Math.floor((totalMinutes + MINUTES_PER_DAY - 1) / MINUTES_PER_DAY); // ceil
  return Math.max(1, days);
}

const ReservationInsurance = ({ options }) => {
  const [showModal, setShowModal] = useState(false);

  const insurance = useReservationStore((s) => s.insurance);
  const priceLoading = useReservationStore((s) => s.priceLoading);
  const priceError = useReservationStore((s) => s.priceError);
  const rentalPeriod = useReservationStore((s) => s.rentalPeriod);
  const rentType = useReservationStore((s) => s.rentType);

  const selectInsuranceAndRefreshPrice = useReservationStore(
    (s) => s.selectInsuranceAndRefreshPrice
  );

  const selectedOption = insurance?.code || "NONE";

  const chargeDays = useMemo(() => {
    if ((rentType || "SHORT").toUpperCase() !== "SHORT") return 0;
    return calcChargeDays(rentalPeriod?.startDateTime, rentalPeriod?.endDateTime);
  }, [rentType, rentalPeriod?.startDateTime, rentalPeriod?.endDateTime]);

  const handleInsuranceChange = async (code, extraDailyPrice) => {
    try {
      await selectInsuranceAndRefreshPrice(code, extraDailyPrice);
    } catch (err) {
      console.error("가격 재계산 실패:", err);
    }
  };

  return (
    <div className="w-full max-w-[640px] xx:p-2 sm:p-4 xx:space-y-3 sm:space-y-4">
      <h2 className="xx:text-base sm:text-lg font-bold">어떤 보험을 선택할까요?</h2>
      <p className="xx:text-sm sm:text-base text-gray-600">
        상대방과 나를 보호하는 종합보험이 포함되어 있어요.
      </p>

      {priceLoading && <div className="text-sm text-gray-500">가격을 다시 계산 중입니다...</div>}
      {!!priceError && (
        <div className="text-sm text-red-500">
          가격 재계산에 실패했습니다. 잠시 후 다시 시도해주세요.
        </div>
      )}

      <ul className="xx:space-y-3 sm:space-y-4">
        {options.map((option) => {
          const daily = Number(option.extraDailyPrice ?? 0);

          // ✅ 카드 오른쪽 표시 금액을 "기간 반영 총액"으로 변경
          const displayTotal =
            (rentType || "SHORT").toUpperCase() === "SHORT"
              ? daily * (chargeDays || 1)
              : 0;

          return (
            <li
              key={String(option.code)}
              className={`border rounded-lg p-4 cursor-pointer transition ${selectedOption === option.code ? "border-blue-500 bg-blue-50" : "border-gray-300"
                }`}
              onClick={() => handleInsuranceChange(option.code, option.extraDailyPrice)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{option.label}</h3>
                  <p className="text-sm text-gray-500">{option.desc}</p>
                  {/* (선택) 기간 표시 */}
                  {(rentType || "SHORT").toUpperCase() === "SHORT" && (
                    <p className="text-xs text-gray-400 mt-1">과금 {chargeDays}일 기준</p>
                  )}
                </div>

                <div className="text-brand font-bold">
                  +{displayTotal.toLocaleString()}원
                </div>
              </div>
            </li>
          );
        })}
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
