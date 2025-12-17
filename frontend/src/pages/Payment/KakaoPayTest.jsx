import api from "../../services/api";

const KakaoPayTest = () => {
  const handleKakaoPay = async () => {
    try {
      const res = await api.post("/api/pay/kakao/ready", {
        orderId: "ORDER123",
        userId: "USER456",
        itemName: "테스트 상품",
        amount: 55000,
      });
      console.log("전체응답:", res);
      console.log("응답 데이터: ", res.data);

      const redirectUrl = res.data?.next_redirect_pc_url;

      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        console.warn("카카오페이 redirect URL 없음:", res.data);
        alert("결제 페이지 URL을 받아오지 못했습니다.");
      }
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
