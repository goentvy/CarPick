import useReservationStore from "../../store/useReservationStore";

const DriverInfoSection = () => {
  const driverInfo = useReservationStore((state) => state.driverInfo);
  const setDriverInfo = useReservationStore((state) => state.setDriverInfo);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDriverInfo({
      ...driverInfo,
      [name]: value,
    });
  };

  return (
    <section className="w-full max-w-[640px] mt-6">
      <h2 className="text-lg font-semibold mb-4">운전자 정보</h2>
      <div className="space-y-4 xx:space-y-2">
        {/* 성 / 이름 */}
        <div className="w-full flex xx:flex-col sm:flex-row xx:gap-2 sm:gap-4">
          <input
            type="text"
            name="lastName"
            placeholder="성"
            value={driverInfo?.lastName || ""}
            onChange={handleChange}
            className="sm:flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            name="firstName"
            placeholder="이름"
            value={driverInfo?.firstName || ""}
            onChange={handleChange}
            className="sm:flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* 생년월일 */}
        <input
          type="text"
          name="birth"
          placeholder="생년월일 (YYYYMMDD)"
          value={driverInfo?.birth || ""}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* 휴대폰 번호 */}
        <div className="flex space-x-2">
          <input
            type="tel"
            name="phone"
            placeholder="휴대폰 번호"
            value={driverInfo?.phone || ""}
            onChange={handleChange}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* 이메일 */}
        <input
          type="email"
          name="email"
          placeholder="이메일"
          value={driverInfo?.email || ""}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* 안내 문구 */}
      <p className="mt-3 text-sm text-purple-600">
        차량 대여 시, 운전자는 유효한 운전면허증을 꼭 지참해주세요. <br />
        면허증 확인과 계약서 작성 시 필요합니다.
      </p>
    </section>
  );
};

export default DriverInfoSection;
