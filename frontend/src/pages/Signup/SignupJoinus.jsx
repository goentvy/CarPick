import { useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import StepProgress from '../../components/common/StepProgress';
import ContentTopLogo from '../../components/common/ContentTopLogo';
import { signup } from '../../services/auth';

// Yup 스키마 정의
const schema = yup.object().shape({
    email: yup.string().email("올바른 이메일을 입력해주세요").required("이메일은 필수입니다"),
    password: yup.string().min(6, "비밀번호는 최소 6자리 이상").required("비밀번호는 필수입니다"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "비밀번호가 일치하지 않습니다")
        .required("비밀번호 확인은 필수입니다."),
    name: yup.string().required("이름은 필수입니다"),
    phone: yup
        .string()
        .matches(/^01[0-9]-\d{3,4}-\d{4}$/, "휴대폰 번호 형식이 올바르지 않습니다")
        .required("휴대폰 번호는 필수입니다"),
    birth: yup
        .date()
        .max(new Date(), "오늘 이후 날짜는 선택할 수 없습니다")
        .min(new Date(1900, 0, 1), "1900년 이후만 선택 가능합니다")
        .required("생년월일은 필수입니다")
        .typeError("올바른 날짜를 선택해주세요"),
    gender: yup.string().required("성별을 선택해주세요"),
    marketingAgree: yup
        .string()
        .oneOf(["agree"], "회원가입은 수신동의 시에만 가능합니다")
        .required("정보제공 수신 여부를 선택해주세요"),
});

const SignupJoinus = () => {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
            name: '',
            phone: '',
            birth: null,
            gender: '',
            marketingAgree: 'agree',
            provider: 'LOCAL',
        },
    });

    // 🔥 휴대폰 실시간 값 감지
    const phoneValue = useWatch({ control, name: "phone" });
    const gender = useWatch({ control, name: "gender" });

    // 🔥 휴대폰 번호 포맷팅
    const formatPhoneNumber = (value) => {
        if (!value) return '';
        const numbers = value.replace(/[^0-9]/g, '');
        if (numbers.length < 4) return numbers;
        if (numbers.length < 8) return `${numbers.slice(0,3)}-${numbers.slice(3)}`;
        return `${numbers.slice(0,3)}-${numbers.slice(3,7)}-${numbers.slice(7,11)}`;
    };

    const handlePhoneChange = (e) => {
        const formatted = formatPhoneNumber(e.target.value);
        setValue('phone', formatted, { shouldValidate: true });
    };

    const onSubmit = async (formData) => {
        const { confirmPassword: _confirmPassword, ...payload } = formData;
        try {
            const data = await signup({
                ...payload,
                marketingAgree: formData.marketingAgree === 'agree',
            });

            if (data.success) {
                alert("가입 정보가 제출되었습니다.");
                navigate("/signup/complete", { state: formData.name});
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error(err);
            alert("회원가입 요청 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="min-h-screen flex justify-center mt-[67px] mb-20">
            <div className="w-full max-w-2xl bg-white p-8">
                <ContentTopLogo
                    title="회원가입"
                    titleStyle={"text-2xl text-center font-semibold my-6"}
                />

                <StepProgress step={2} />

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* 이메일 */}
                    <div>
                        <label className="block font-semibold mb-1">이메일 주소 <span className="text-brand">*</span></label>
                        <input
                            type="email"
                            {...register("email")}
                            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="이메일 주소"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>

                    {/* 비밀번호 */}
                    <div>
                        <label className="block font-semibold mb-1">비밀번호 <span className="text-brand">*</span></label>
                        <input
                            type="password"
                            {...register("password")}
                            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="비밀번호"
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                    </div>

                    {/* 비밀번호 확인 */}
                    <div>
                        <label className="block font-semibold mb-1">비밀번호 확인 <span className="text-brand">*</span></label>
                        <input
                            type="password"
                            {...register("confirmPassword")}
                            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="비밀번호 확인"
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
                    </div>

                    {/* 이름 */}
                    <div>
                        <label className="block font-semibold mb-1">이름 <span className="text-brand">*</span></label>
                        <input
                            type="text"
                            {...register("name")}
                            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="홍길동"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                    </div>

                    {/* 🔥 휴대폰 - 입력하면서 실시간 하이픈 보임 */}
                    <div>
                        <label className="block font-semibold mb-1">휴대폰 번호 <span className="text-brand">*</span></label>
                        <input
                            type="tel"
                            value={formatPhoneNumber(phoneValue || '')}  // 🔥 포맷된 값 실시간 표시
                            onChange={handlePhoneChange}                  // 🔥 포맷팅 함수
                            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="010-0000-0000"
                            maxLength="13"
                        />
                        <input type="hidden" {...register("phone")} />  {/* 🔥 검증용 hidden */}
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                    </div>

                    {/* 생년월일 */}
                    <div>
                        <label className="block font-semibold mb-1">생년월일 <span className="text-brand">*</span></label>
                        <input
                            type="date"
                            max={new Date().toISOString().split('T')[0]}  // 🔥 오늘까지만
                            {...register("birth")}
                            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.birth && <p className="text-red-500 text-sm mt-1">{errors.birth.message}</p>}
                    </div>

                    {/* 성별 버튼 */}
                    <div>
                        <label className="block font-semibold mb-1">성별 <span className="text-brand">*</span></label>
                        <div className="flex space-x-4 mt-1">
                            <button
                                type="button"
                                onClick={() => setValue("gender", "M", { shouldValidate: true })}
                                className={`px-6 py-2 rounded-lg border-2 font-medium transition-colors duration-200 ${
                                    gender === "M"
                                        ? "bg-blue-100 text-brand border-blue-500"
                                        : "bg-white text-brand border-gray-300 hover:bg-blue-100"
                                }`}
                            >
                                남성
                            </button>
                            <button
                                type="button"
                                onClick={() => setValue("gender", "F", { shouldValidate: true })}
                                className={`px-6 py-2 rounded-lg border-2 font-medium transition-colors duration-200 ${
                                    gender === "F"
                                        ? "bg-blue-100 text-brand border-blue-500"
                                        : "bg-white text-brand border-gray-300 hover:bg-blue-100"
                                }`}
                            >
                                여성
                            </button>
                        </div>
                        {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
                    </div>

                    {/* 정보제공 수신 */}
                    <div>
                        <label className="block font-semibold mb-1">정보제공 수신 *</label>
                        <div className="flex space-x-4 mt-1">
                            <label className="flex items-center space-x-1">
                                <input type="radio" value="agree" {...register("marketingAgree")} />
                                <span>수신동의</span>
                            </label>
                            <label className="flex items-center space-x-1">
                                <input type="radio" value="disagree" {...register("marketingAgree")} />
                                <span>수신거부</span>
                            </label>
                        </div>
                        {errors.marketingAgree && <p className="text-red-500 text-sm mt-1">{errors.marketingAgree.message}</p>}
                    </div>

                    {/* 버튼 */}
                    <div className="flex justify-center space-x-4 mt-6">
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="px-8 sm:px-12 py-2 border-2 border-blue-500 text-brand rounded-lg hover:bg-brand hover:text-white"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="px-4 sm:px-12 py-2 bg-brand text-white rounded-lg hover:bg-blue-600"
                        >
                            입력완료
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignupJoinus;
