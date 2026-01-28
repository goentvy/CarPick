import { useFormContext } from "react-hook-form";
import { useEffect } from "react";
import useReservationStore from "../../store/useReservationStore";

const CardPaymentForm = () => {
  const { register, setValue, reset, formState: { errors } } = useFormContext();
  const cardPayment = useReservationStore((state) => state.cardPayment);

  // 카드번호 포맷 함수
  const formatCardNumber = (value) =>
    value.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1-");

  // 유효기간 포맷 함수
  const formatExpiry = (value) =>
    value.replace(/\D/g, "").slice(0, 4).replace(/(\d{2})(?=\d)/, "$1/");

  // 컴포넌트 마운트 시 Zustand 값으로 폼 복원
  useEffect(() => {
    if (cardPayment) {
      reset(cardPayment);
    }
  }, [cardPayment, reset]);

  return (
    <div className="w-full max-w-[640px] xx:p-2 sm:p-4">
      <div className="w-full space-y-3">
        <h2 className="text-xl font-bold text-gray-800 border-b pb-4">카드결제</h2>

        {/* 카드번호 */}
        <div>
          <label className="block text-sm text-gray-600">카드번호</label>
          <input
            type="text"
            {...register("cardNumber")}
            onChange={(e) =>
              setValue("cardNumber", formatCardNumber(e.target.value), { shouldValidate: true })
            }
            placeholder="####-####-####-####"
            className="w-full border rounded px-3 py-2"
          />
          {errors.cardNumber && <p className="text-red-500 text-sm">{errors.cardNumber.message}</p>}
        </div>

        {/* 유효기간 + CVC */}
        <div className="flex space-x-4">
          <div className="w-1/2">
            <label className="block text-sm text-gray-600">유효기간 (MM/YY)</label>
            <input
              type="text"
              {...register("expiry")}
              onChange={(e) =>
                setValue("expiry", formatExpiry(e.target.value), { shouldValidate: true })
              }
              placeholder="07/30"
              className="w-full border rounded px-3 py-2 mt-1"
            />
            {errors.expiry && <p className="text-red-500 text-sm">{errors.expiry.message}</p>}
          </div>
          <div className="w-1/2">
            <label className="block text-sm text-gray-600">CVC</label>
            <input
              type="text"
              {...register("cvc")}
              maxLength={3}
              placeholder="123"
              className="w-full border rounded px-3 py-2 mt-1"
            />
            {errors.cvc && <p className="text-red-500 text-sm">{errors.cvc.message}</p>}
          </div>
        </div>

        {/* 비밀번호 앞 2자리 */}
        <div>
          <label className="block text-sm text-gray-600">비밀번호 앞 2자리</label>
          <input
            type="password"
            {...register("password2")}
            maxLength={2}
            className="w-full border rounded px-3 py-2 mt-1"
          />
          {errors.password2 && <p className="text-red-500 text-sm">{errors.password2.message}</p>}
        </div>

        {/* 카드 종류 */}
        <div>
          <label className="block text-sm text-gray-600">카드 종류</label>
          <div className="flex space-x-4 mt-1">
            <label className="flex items-center space-x-2">
              <input type="radio" value="personal" {...register("cardType")} />
              <span>개인</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" value="corporate" {...register("cardType")} />
              <span>법인</span>
            </label>
          </div>
          {errors.cardType && <p className="text-red-500 text-sm">{errors.cardType.message}</p>}
        </div>

        {/* 할부기간 */}
        <div>
          <label className="block text-sm text-gray-600">할부기간</label>
          <select {...register("installment")} className="w-full border rounded px-3 py-2 mt-1">
            <option value="일시불">일시불</option>
            <option value="2개월">2개월</option>
            <option value="3개월">3개월</option>
            <option value="6개월">6개월</option>
          </select>
          {errors.installment && <p className="text-red-500 text-sm">{errors.installment.message}</p>}
        </div>

        {/* 개인정보 동의 */}
        <div className="flex items-center space-x-2">
          <input type="checkbox" {...register("agree")} />
          <label className="text-sm text-gray-600">개인정보 수집 및 이용 동의</label>
          {errors.agree && <p className="text-red-500 text-sm">{errors.agree.message}</p>}
        </div>
      </div>
    </div>
  );
};

export default CardPaymentForm;
