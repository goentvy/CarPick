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
    // 데이터 초기 셋팅
    useEffect(() => {
        const startDateTime = searchParams.get("startDate");
        const endDateTime = searchParams.get("endDate");
        const monthsParam = Number(searchParams.get("months"));
        const months = Number.isFinite(monthsParam) && monthsParam > 0 ? monthsParam : 1;

        if (!startDateTime || !endDateTime) {
            alert("예약 기간 정보가 없습니다. 다시 검색해주세요.");
            navigate("/");
            return;
        }

        const pickupBranchId = Number(searchParams.get("pickupBranchId"));
        const rentTypeParam = (searchParams.get("rentType") || "").toUpperCase();
        const rentType = rentTypeParam === "LONG" || rentTypeParam === "MONTH" ? "LONG" : "SHORT";

        const body = {
            specId,
            pickupBranchId,
            rentType,
            startDateTime,
            endDateTime,
            ...(rentType === "LONG" ? { months } : {}),
            driverInfo: {
                lastname: "",
                firstname: "",
                phone: "",
                email: "",
                birth: "",
            },
        };

        api.post("/reservation/form", body)
            .then(async (res) => {
                const store = useReservationStore.getState();

                setFormData(res.data);

                // rentType/months: 예약 페이지 진입 시점에 고정
                store.setRentType(rentType);
                store.setMonths(rentType === "LONG" ? months : null);

                // 완료페이지 표시용
                store.setPickupBranchName(decodeURIComponent(searchParams.get("pickupBranchName") || ""));
                store.setStartDate(startDateTime.split(" ")[0] || "");
                store.setEndDate(endDateTime.split(" ")[0] || "");

                // 차량
                setVehicle({
                    specId: res.data.car?.specId,
                    vehicleId: res.data.car?.specId,
                    title: res.data.car?.title,
                });

                // 픽업/반납 + 기본 returnType
                setPickupReturn({
                    pickupType: "VISIT",
                    pickupBranch: res.data.pickupLocation,
                    dropoffBranch: res.data.returnLocation,
                    returnType: "VISIT",
                    dropzoneId: null,
                });

                // 기간
                setRentalPeriod({ startDateTime, endDateTime });

                // ✅ 가격 API 호출 추가
                try {
                    const priceRes = await api.get("/v2/reservations/price", {
                        params: {
                            specId,
                            rentType,
                            startDate: startDateTime,
                            endDate: endDateTime,
                            insuranceCode: "NONE",
                            ...(rentType === "LONG" ? { months } : {}),
                        }
                    });

                    // ✅ 스토어에 가격 정보 저장
                    store.setPaymentSummary({
                        rentFee: priceRes.data.rentFee,
                        insuranceFee: priceRes.data.insuranceFee,
                        totalAmount: priceRes.data.totalAmount,
                    });
                } catch (priceErr) {
                    console.error("가격 조회 실패:", priceErr);
                }
            })
            .catch((err) => console.error("예약 폼 데이터 불러오기 실패:", err));

    }, [searchParams, setVehicle, setPickupReturn, setRentalPeriod, navigate, specId]);

    const isShort = formData?.rentType === "SHORT";

    return (
        <FormProvider {...methods}>
            <div className="flex flex-col justify-center items-center mt-[60px]">
                {formData && (
                    <>
                        <ReservationBanner formData={formData} />
                        <PickupReturnSection
                            pickup={formData.pickupLocation}
                            dropoff={formData.returnLocation}
                            startDateTime={searchParams.get("startDate")}
                            endDateTime={searchParams.get("endDate")}
                        />

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