import DriverInfoSection from "./DriverInfoSection";
import InsuranceInfoSection from "./InsuranceInfoSection";
import PickupReturnSection from "./PickupReturnSection";
import PaymentSummarySection from "./PaymentSummarySection";
import AgreementSection from "./AgreementSection";
import ReservationBanner from "./ReservationBanner";
import CardPaymentForm from "../Payment/CardPaymentForm";
import ReservationInsurance from "./ReservationInsurance";

import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import useReservationStore from "../../store/useReservationStore";
import api from "../../services/api";

// ✅ Yup 스키마 정의
const schema = yup.object().shape({
  // 카드 정보
  cardNumber: yup
    .string()
    .matches(/^\d{4}-\d{4}-\d{4}-\d{4}$/, "카드번호 형식이 올바르지 않습니다")
    .required("카드번호는 필수입니다"),
  expiry: yup
    .string()
    .matches(/^\d{2}\/\d{2}$/, "유효기간은 MM/YY 형식이어야 합니다")
    .required("유효기간은 필수입니다")
    .test("expiry-future", "유효기간이 현재보다 이후여야 합니다", (value) => {
      if (!value) return false;
      const [monthStr, yearStr] = value.split("/");
      const month = parseInt(monthStr, 10);
      const year = parseInt(yearStr, 10);
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear() % 100;
      return year > currentYear || (year === currentYear && month >= currentMonth);
    }),
  cvc: yup.string().length(3, "CVC는 3자리 숫자여야 합니다").required(),
  password2: yup.string().length(2, "비밀번호 앞 2자리를 입력해주세요").required(),
  cardType: yup.string().oneOf(["personal", "corporate"]).required(),
  installment: yup.string().required("할부기간을 선택해주세요"),
  agree: yup.boolean().oneOf([true], "개인정보 수집 및 이용에 동의해주세요"),

  // 운전자 정보
  lastName: yup.string().required("성을 입력해주세요"),
  firstName: yup.string().required("이름을 입력해주세요"),
  birth: yup
    .string()
    .matches(/^\d{8}$/, "생년월일은 YYYYMMDD 형식이어야 합니다")
    .required("생년월일은 필수입니다"),
  phone: yup
    .string()
    .matches(/^01[016789]-\d{3,4}-\d{4}$/, "휴대폰 번호 형식이 올바르지 않습니다")
    .required("휴대폰 번호는 필수입니다"),
  email: yup.string().email("올바른 이메일 주소를 입력해주세요").required("이메일은 필수입니다"),
});


const ReservationPage = () => {
  const [formData, setFormData] = useState(null);
  const { setVehicle, setPickupReturn, setRentalPeriod } = useReservationStore();
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      // 카드 정보
      cardNumber: "",
      expiry: "",
      cvc: "",
      password2: "",
      cardType: "personal",
      installment: "일시불",
      agree: false,

      // 운전자 정보
      lastName: "",
      firstName: "",
      birth: "",
      phone: "",
      email: "",
    },
  });

  // 데이터 초기 셋팅
  useEffect(() => {
    api.get("/reservation/form", { params: { carId: 1 } })
      .then(res => {
        setFormData(res.data);
        setVehicle({
          id: res.data.car.carId,
          title: res.data.car.title,
          dailyPrice: res.data.paymentSummary.carDailyPrice,
        });

        // ▼▼▼ [여기가 핵심!] 이 부분이 없어서 에러가 났던 겁니다. 추가해주세요! ▼▼▼
        setPickupReturn({
          method: "visit", // 기본값 (방문)
          pickupBranch: res.data.pickupBranch,   // 수정 (기존: 1)
          dropoffBranch: res.data.dropoffBranch//  수정 (기존: 1)
        });

        //  [추가/MVP] 날짜를 store에 주입 (null 방지)
        // 실제로는 HomeRentHeader/DateRangePicker에서 넘어온 값을 넣는 게 정석
        setRentalPeriod({
          startDateTime: "2026-01-01 10:00:00",
          endDateTime: "2026-01-02 10:00:00",
        });
      })
      .catch(err => console.error("예약 폼 데이터 불러오기 실패:", err));
  }, []);

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col justify-center items-center mt-[60px]">
        {formData && (
          <>
            {/* 차량 정보 */}
            <ReservationBanner formData={formData} />
            {/* 대여/반납 방식 선택 (업체 방문 vs 배송), 지점 정보, 운영시간, 주소 표시 */}
            <PickupReturnSection
              pickup={formData.pickupBranch}
              dropoff={formData.dropoffBranch}
            />
            {/* 운전자 정보 입력 (성, 이름, 생년월일, 휴대폰, 이메일, 인증요청 버튼 포함) */}
            <DriverInfoSection />
            {/* 보험 선택 UI */}
            <ReservationInsurance options={formData.insuranceOptions} />
            {/* 보험 정보 안내 (보상한도, 자기부담금, 자손/대물/대인 설명 등) */}
            <InsuranceInfoSection />
            {/* 결제 요금 요약 (차량 요금, 보험 요금, 총 결제금액, 포인트 적립 등) */}`
            <PaymentSummarySection />
            {/* 카드결제 폼 */}
            <CardPaymentForm />
            {/* 약관 확인 및 결제 동의 체크박스, 결제 버튼 (회원/비회원) */}
            <AgreementSection isLoggedIn={true} />
          </>
        )}
      </div>
    </FormProvider>
  );
}

export default ReservationPage;