import { useLocation } from "react-router-dom";

const OrderComplete = () => {
  const location = useLocation();
  console.log(location); 
  const { orderId, totalPrice } = location.state || {};

  return (
    <div className="w-full max-w-[640px] mx-auto mt-[67px] text-center p-6">
      <h1 className="text-2xl font-bold text-green-600 mb-4">결제가 완료되었습니다 🎉</h1>
      <p className="text-gray-700 mb-6">주문이 정상적으로 처리되었습니다.</p>

      {/* 주문번호와 금액 표시 */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <p className="text-sm text-gray-600">주문번호: <span className="font-semibold">{orderId}</span></p>
        <p className="text-sm text-gray-600">결제금액: <span className="font-semibold">{totalPrice}원</span></p>
      </div>

      <button
        onClick={() => (window.location.href = "/mypage")}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        마이페이지로 이동
      </button>
    </div>
  );
};

export default OrderComplete;
