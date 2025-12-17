import { useFormContext } from "react-hook-form";
import useReservationStore from "../../store/useReservationStore";
import axios from "axios";
import { Link } from "react-router-dom";

const AgreementSection = ({ isLoggedIn }) => {
  const { handleSubmit } = useFormContext();
  const setCardPayment = useReservationStore((state) => state.setCardPayment);
  const getReservationData = useReservationStore((state) => state.getReservationData);

  // 결제 버튼 클릭 시 실행
  const onSubmit = async (formData) => {
    // 1. Zustand에 카드결제 정보 저장
    setCardPayment(formData);

    // 2. 최종 예약 데이터 모으기
    const reservationData = getReservationData();
    console.log("최종 결제 데이터:", reservationData);

    // 3. API 호출
    try {
      const res = await axios.post("http://localhost:8080/api/reservation/pay", reservationData);
      if (res.data.status === "APPROVED") {
        alert("결제가 완료되었습니다!");
      } else {
        alert("결제 실패: " + res.data.message);
      }
    } catch (err) {
      alert("서버 오류가 발생했습니다.");
      console.error(err);
    }
  };

  return (
    <section className="w-full max-w-[640px] xx:p-2 sm:p-4 mb-[60px]">
      <h2 className="text-lg font-semibold mb-4">약관 및 결제 동의</h2>

      {/* 약관 목록 */}
      <ul className="space-y-2">
        <li><Link to="/agree1">서비스 이용약관</Link></li>
        <li><Link to="/agree2">개인정보 수집 이용 동의</Link></li>
        <li><Link to="">개인정보 제3자 제공 동의</Link></li>
        <li><Link to="">이용 안내</Link></li>
        <li><Link to="">취소 안내</Link></li>
        <li><Link to="">자동차 대여 표준 약관</Link></li>
      </ul>

      {/* 결제 동의 체크박스 */}
      <div className="mt-4">
          <p className="xx:text-sm sm:text-base text-center text-blue-500 font-bold">위 내용을 모두 확인하였으며, 결제에 동의합니다.</p>
      </div>

      {/* 결제 버튼 */}
      <div className="mt-6 flex space-x-4">
        {isLoggedIn ? (
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            className="flex-1 px-6 py-3 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors duration-200"
          >
            49,900원 결제하기
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            className="flex-1 px-6 py-3 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors duration-200"
          >
            비회원 49,900원 결제하기
          </button>
        )}
      </div>
    </section>
  );
};

export default AgreementSection;
