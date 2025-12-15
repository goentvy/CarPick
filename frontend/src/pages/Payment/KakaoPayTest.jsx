import axios from "axios";

const KakaoPayTest = () => {
  const handleKakaoPay = async () => {
    try {
      const res = await axios.post("/api/pay/kakao/ready", {
        orderId: "ORDER123",
        userId: "USER456",
        itemName: "테스트 상품",
        amount: 55000,
      });

      const redirectUrl = res.data.next_redirect_pc_url;
      window.location.href = redirectUrl;
    } catch (err) {
      console.error("카카오페이 결제 준비 실패:", err);
      alert("카카오페이 결제 준비 중 오류가 발생했습니다.");
    }
  };

  return (
    <button
      onClick={handleKakaoPay}
      className="w-full px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition"
    >
      카카오페이 테스트 결제
    </button>
  );
};

export default KakaoPayTest;
