import { useEffect } from "react";
import useReservationStore from "../../store/useReservationStore";

const PaymentSummarySection = () => {
  const { payment, vehicle, insurance, calculatePaymentSummary } = useReservationStore();

  useEffect(() => {
    calculatePaymentSummary();
  }, [insurance, vehicle, calculatePaymentSummary]);

  if (!payment.summary) return null;

  return (
    <section className="w-full max-w-[640px] xx:p-2 sm:p-4">
      <h2 className="xx:text-base sm:text-lg font-semibold mb-4">결제정보</h2>

      <div className="p-4 border rounded-lg bg-gray-50 space-y-2">
        <div className="flex justify-between text-sm">
          <span>차량 대여 요금</span>
          <span className="font-medium">{payment.summary.vehiclePrice.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>보험 요금</span>
          <span className="font-medium">{payment.summary.insurancePrice.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between text-base font-semibold border-t pt-2">
          <span>총 결제금액</span>
          <span className="text-blue-600">{payment.summary.totalPrice.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>포인트 적립</span>
          <span>1% → {payment.summary.point.toLocaleString()}원</span>
        </div>
      </div>
    </section>
  );
};

export default PaymentSummarySection;
