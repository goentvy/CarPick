import DriverInfoSection from "./DriverInfoSection";
import InsuranceInfoSection from "./InsuranceInfoSection";
import PickupReturnSection from "./PickupReturnSection";
import PaymentSummarySection from "./PaymentSummarySection";
import AgreementSection from "./AgreementSection";
import ReservationBanner from "./ReservationBanner";

const ReservationPage = () => {
  return (
    <div className="flex flex-col justify-center items-center mt-[67px]">
        {/* 차량 정보 */}
        <ReservationBanner />
        {/* 대여/반납 방식 선택 (업체 방문 vs 배송), 지점 정보, 운영시간, 주소 표시 */}
        <PickupReturnSection />
        {/* 운전자 정보 입력 (성, 이름, 생년월일, 휴대폰, 이메일, 인증요청 버튼 포함) */}
        <DriverInfoSection />
        {/* 보험 정보 안내 (보상한도, 자기부담금, 자손/대물/대인 설명 등) */}
        <InsuranceInfoSection />
        {/* 결제 요금 요약 (차량 요금, 보험 요금, 총 결제금액, 포인트 적립 등) */}
        <PaymentSummarySection />
        {/* 약관 확인 및 결제 동의 체크박스, 결제 버튼 (회원/비회원) */}
        <AgreementSection isLoggedIn={true}/>
    </div>
  );
}

export default ReservationPage;