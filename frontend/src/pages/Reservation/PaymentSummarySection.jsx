import useReservationStore from "../../store/useReservationStore";

const PaymentSummarySection = () => {
  const summary = useReservationStore((s) => s.payment.summary);
  const priceLoading = useReservationStore((s) => s.priceLoading);

  if (!summary) {
    return priceLoading ? (
      <section className="w-full max-w-[640px] xx:p-2 sm:p-4">
        <h2 className="xx:text-base sm:text-lg font-semibold mb-4">결제정보</h2>
        <div className="p-4 border rounded-lg bg-gray-50 text-sm text-gray-500">
          가격을 계산 중입니다...
        </div>
      </section>
    ) : null;
  }

  const point = Math.floor((summary.totalAmount ?? 0) * 0.01);

  return (
    <section className="w-full max-w-[640px] xx:p-2 sm:p-4">
      <h2 className="xx:text-base sm:text-lg font-semibold mb-4">결제정보</h2>

      <div className="p-4 border rounded-lg bg-gray-50 space-y-2">
        <div className="flex justify-between text-sm">
          <span>차량 대여 요금</span>
          <span className="font-medium">
            {(summary.rentFee ?? 0).toLocaleString()}원
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span>보험 요금</span>
          <span className="font-medium">
            {(summary.insuranceFee ?? 0).toLocaleString()}원
          </span>
        </div>

        <div className="flex justify-between text-base font-semibold border-t pt-2">
          <span>총 결제금액</span>
          <span className="text-blue-600">
            {(summary.totalAmount ?? 0).toLocaleString()}원
          </span>
        </div>

        <div className="flex justify-between text-xs text-gray-500">
          <span>포인트 적립</span>
          <span>1% → {point.toLocaleString()}원</span>
        </div>
      </div>
    </section>
  );
};

export default PaymentSummarySection;
