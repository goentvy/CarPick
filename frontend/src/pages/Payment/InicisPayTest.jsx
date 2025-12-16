import axios from "axios";

const InicisPayTest = () => {
  const handleInicisPay = async () => {
    try {
      const res = await axios.post("/api/pay/inicis/ready", {
        orderId: "ORDER789",
        amount: 55000,
      });

      const { mid, orderId, amount, returnUrl } = res.data;
      const payUrl = `https://inipaytest.inicis.com/payForm?mid=${mid}&orderId=${orderId}&amount=${amount}&returnUrl=${returnUrl}`;

      window.location.href = payUrl;
    } catch (err) {
      console.error("이니시스 결제 준비 실패:", err);
      alert("KG이니시스 결제 준비 중 오류가 발생했습니다.");
    }
  };

  return (
    <button
      onClick={handleInicisPay}
      className="w-full px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
    >
      KG이니시스 테스트 결제
    </button>
  );
};

export default InicisPayTest;
