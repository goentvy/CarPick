import DriverInfoSection from "./DriverInfoSection";
import InsuranceInfoSection from "./InsuranceInfoSection";
import { useParams } from "react-router-dom";
import PickupReturnSection from "./PickupReturnSection";
import PaymentSummarySection from "./PaymentSummarySection";
import AgreementSection from "./AgreementSection";
import ReservationBanner from "./ReservationBanner";
import CardPaymentForm from "../Payment/CardPaymentForm";
import ReservationInsurance from "./ReservationInsurance";
import { useNavigate, useSearchParams } from 'react-router-dom';
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
    const navigate = useNavigate();
    const [formData, setFormData] = useState(null);
    const { setVehicle, setPickupReturn, setRentalPeriod } = useReservationStore();
    const [searchParams] = useSearchParams();
    const { id } = useParams();

    const specId = Number(id);

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
        const startDateTime = searchParams.get("startDate");
        const endDateTime = searchParams.get("endDate");
        const monthsParam = Number(searchParams.get("months")); // ✅ 추가
        const months = Number.isFinite(monthsParam) && monthsParam > 0 ? monthsParam : 1;

        if (!startDateTime || !endDateTime) {
            alert("예약 기간 정보가 없습니다. 다시 검색해주세요.");
            navigate("/");
            return;
        }
        //  (수정 2) pickupBranchId / returnBranchId / rentType을 URL에서 같이 꺼내서 body 구성
        const pickupBranchId = Number(searchParams.get("pickupBranchId"));
        // returnBranchId는 FormRequestDtoV2에 없으므로 일단 프런트 store용으로만 쓰거나,
        // 백엔드 DTO에 추가할 계획이 없다면 body에는 넣지 마세요.
        // const returnBranchId = Number(searchParams.get("returnBranchId"));

        const rentTypeRaw = (searchParams.get("rentType") || "").toLowerCase();
        const rentType = rentTypeRaw === "long" ? "LONG" : "SHORT";
        //  (수정 3) 백엔드가 기대하는 @RequestBody(JSON) 형태로 보내기
        // ReservationFormRequestDtoV2에 맞춘 body
        const body = {
            specId,
            pickupBranchId,
            rentType,
            startDateTime,
            endDateTime,
            ...(rentType === "LONG" ? { months } : {}), //  핵심
            driverInfo: {
                lastname: "",
                firstname: "",
                phone: "",
                email: "",
                birth: "",
            },
        };

        api.post("/reservation/form", body)
            .then(res => {
                setFormData(res.data);
                setVehicle({
                    specId: res.data.car?.specId,   // specId로 세팅
                    vehicleId: res.data.car?.specId, // vehicleId도 같이 (create용)
                    title: res.data.car?.title,

                });

                //예약 완료 페이지
                const store = useReservationStore.getState();
                store.setPickupBranchName(decodeURIComponent(searchParams.get("pickupBranchName") || ""));
                store.setStartDate(startDateTime.split(' ')[0] || "");
                store.setEndDate(endDateTime.split(' ')[0] || "");


                setPickupReturn({
                    method: "visit", // 기본값 (방문)
                    pickupBranch: res.data.pickupLocation,   // 수정 (기존: 1)
                    dropoffBranch: res.data.returnLocation//  수정 (기존: 1)
                });


                setRentalPeriod({
                    startDateTime,
                    endDateTime,
                });
            })
            .catch(err => console.error("예약 폼 데이터 불러오기 실패:", err));
    }, [searchParams, setVehicle, setPickupReturn, setRentalPeriod, navigate, specId]);

    const isShort = formData?.rentType === "SHORT";

    return (
        <FormProvider {...methods}>
            <div className="flex flex-col justify-center items-center mt-[60px]">
                {formData && (
                    <>
                        <ReservationBanner formData={formData} />
                        <PickupReturnSection pickup={formData.pickupLocation} dropoff={formData.returnLocation} />
                        <DriverInfoSection />

                        {isShort && <ReservationInsurance options={formData.insuranceOptions} />}
                        {isShort && <InsuranceInfoSection />}

                        <PaymentSummarySection />
                        <CardPaymentForm />
                        <AgreementSection isLoggedIn={true} />
                    </>
                )}
            </div>
        </FormProvider>
    );

}

export default ReservationPage;