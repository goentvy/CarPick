import { useLocation } from "react-router-dom";

const OrderFail = () => {
  const location = useLocation();
  const { message } = location.state || {};

  return (
    <div className="w-full max-w-[640px] mx-auto mt-[67px] text-center p-6">
      <h1 className="text-2xl font-bold text-red-600 mb-4">결제에 실패했습니다 ❌</h1>
      <p className="text-gray-700 mb-6">{message || "결제 승인 중 오류가 발생했습니다."}</p>

      <button
        onClick={() => (window.location.href = "/payment")}
        className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
      >
        다시 결제하기
      </button>
    </div>
  );
};

export default OrderFail;
