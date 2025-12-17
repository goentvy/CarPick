import useReservationStore from "../../store/useReservationStore";

const PickupReturnSection = () => {
  const pickupReturn = useReservationStore((state) => state.pickupReturn);
  const setPickupReturn = useReservationStore((state) => state.setPickupReturn);

  const handleMethodChange = (method) => {
    setPickupReturn({ ...pickupReturn, method });
  };

  return (
    <section className="w-full max-w-[640px] xx:p-2 sm:p-4">
      <h2 className="xx:text-base sm:text-lg font-semibold mb-2">대여/반납 방식</h2>
      <div className="flex xx:justify-center sm:justify-normal space-x-2 mt-1">
        <button
          type="button"
          onClick={() => handleMethodChange("visit")}
          className={`px-6 py-2 rounded-lg border-2 font-medium transition-colors duration-200 ${
            pickupReturn?.method === "visit"
              ? "bg-blue-100 text-blue-500 border-blue-500"
              : "bg-white text-blue-500 border-gray-300 hover:bg-blue-100"
          }`}
        >
          업체 방문
        </button>
        <button
          type="button"
          onClick={() => handleMethodChange("delivery")}
          className={`px-6 py-2 rounded-lg border-2 font-medium transition-colors duration-200 ${
            pickupReturn?.method === "delivery"
              ? "bg-blue-100 text-blue-500 border-blue-500"
              : "bg-white text-blue-500 border-gray-300 hover:bg-blue-100"
          }`}
        >
          배송 서비스
        </button>
      </div>

      <div className="mt-4 p-4 border rounded-lg bg-gray-50">
        <p><strong>지점:</strong> 강남점</p>
        <p><strong>운영시간:</strong> 08:00 ~ 20:00</p>
        <p><strong>주소:</strong> 서울특별시 강남구 역삼동 667-10번지 주차장</p>
      </div>
    </section>
  );
};

export default PickupReturnSection;
