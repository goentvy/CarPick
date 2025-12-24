import useReservationStore from "../../store/useReservationStore";

const PickupReturnSection = ({ pickup, dropoff }) => {
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
              ? "bg-blue-100 text-brand border-blue-500"
              : "bg-white text-brand border-gray-300 hover:bg-blue-100"
          }`}
        >
          업체 방문
        </button>
        <button
          type="button"
          onClick={() => handleMethodChange("delivery")}
          className={`px-6 py-2 rounded-lg border-2 font-medium transition-colors duration-200 ${
            pickupReturn?.method === "delivery"
              ? "bg-blue-100 text-brand border-blue-500"
              : "bg-white text-brand border-gray-300 hover:bg-blue-100"
          }`}
        >
          탁송 서비스
        </button>
      </div>

      <div className="mt-4 p-4 border rounded-lg bg-gray-50">
        <p><strong>지점: </strong>{dropoff.branchName}</p>
        <p><strong>운영시간: </strong>{dropoff.openHours}</p>
        <p><strong>주소: </strong>{dropoff.address ?? ''}</p>
      </div>
    </section>
  );
};

export default PickupReturnSection;
