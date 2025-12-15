import KakaoPayTest from "./KakaoPayTest";
import InicisPayTest from "./InicisPayTest";

const PaymentTestSection = () => {
  return (
    <section className="max-w-[640px] mx-auto space-y-4 mt-10">
      <h2 className="text-lg font-bold text-gray-800">결제 테스트</h2>
      <KakaoPayTest />
      <InicisPayTest />
    </section>
  );
};

export default PaymentTestSection;
