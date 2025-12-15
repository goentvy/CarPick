import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const PaymentCallback = () => {
  const navigate = useNavigate();
  const { provider } = useParams();

  useEffect(() => {
    const urlParams = new URL(window.location.href).searchParams;

    const approvePayment = async () => {
      try {
        let res;
        if (provider === "kakao") {
          const pgToken = urlParams.get("pg_token");
          res = await axios.get(`/api/pay/kakao/approve?pg_token=${pgToken}`);
        } else if (provider === "inicis") {
          const orderId = urlParams.get("orderId");
          const tid = urlParams.get("tid");
          res = await axios.post("/api/pay/inicis/approve", {
            orderId,
            tid,
            amount: 55000,
          });
        }

        // 승인 응답에서 주문번호와 금액 추출
        const { orderId, amount } = res.data;

        // 성공 페이지로 이동하면서 데이터 전달
        navigate("/order/complete", { state: { orderId, amount } });
      } catch (err) {
        console.error("승인 실패:", err);
        navigate("/order/fail", { state: { message: "결제 승인 오류" } });
      }
    };

    approvePayment();
  }, [provider, navigate]);

  return <div className="p-6 text-center">결제 승인 처리중...</div>;
};

export default PaymentCallback;
