import { useFormContext } from "react-hook-form";
import { useEffect } from "react";
import useReservationStore from "../../store/useReservationStore";

const DriverInfoSection = () => {
  const { register, setValue, reset, formState: { errors } } = useFormContext();
  const driverInfo = useReservationStore((state) => state.driverInfo);

  // 컴포넌트 마운트 시 Zustand 값으로 폼 복원
  useEffect(() => {
    if (driverInfo) {
      reset(driverInfo);
    }
  }, [driverInfo, reset]);

  // 입력 시 Zustand에도 반영
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValue(name, value, { shouldValidate: true });
    useReservationStore.getState().setDriverInfo({
      ...driverInfo,
      [name]: value,
    });
  };

  return (
    <section className="w-full max-w-[640px] xx:p-2 sm:p-4">
      <h2 className="xx:text-base sm:text-lg font-semibold mb-4">운전자 정보</h2>
      <div className="space-y-4 xx:space-y-2">
        {/* 성 / 이름 */}
        <div className="w-full flex xx:flex-col sm:flex-row xx:gap-2 sm:gap-4">
          <div className="sm:flex-1">
            <input
              type="text"
              placeholder="성"
              {...register("lastName")}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
            )}
          </div>
          <div className="sm:flex-1">
            <input
              type="text"
              placeholder="이름"
              {...register("firstName")}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
            )}
          </div>
        </div>

        {/* 생년월일 */}
        <div>
          <input
            type="text"
            placeholder="생년월일 (YYYYMMDD)"
            {...register("birth")}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.birth && (
            <p className="text-red-500 text-sm mt-1">{errors.birth.message}</p>
          )}
        </div>

        {/* 휴대폰 번호 */}
        <div>
          <input
            type="tel"
            placeholder="휴대폰 번호"
            {...register("phone")}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* 이메일 */}
        <div>
          <input
            type="email"
            placeholder="이메일"
            {...register("email")}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>

      {/* 안내 문구 */}
      <p className="mt-3 xx:text-xs sm:text-sm text-purple-600">
        차량 대여 시, 운전자는 유효한 운전면허증을 꼭 지참해주세요. <br />
        면허증 확인과 계약서 작성 시 필요합니다.
      </p>
    </section>
  );
};

export default DriverInfoSection;
