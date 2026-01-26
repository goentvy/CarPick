
const ReservationBanner = ({ formData }) => {
  console.log("Reservation formData.car =", formData?.car);

  return (
    <section className="max-w-[640px] w-full overflow-hidden">


      {/* 차량 이미지 */}
      <div className="w-full flex justify-center bg-gray-100">
        <img
          // src={formData.car.imageUrl ?? "/images/common/car1.svg"} 
          src="/images/common/car1.svg"
          alt={formData.car.title ?? ''}
          className="w-[400px] h-auto pt-8 object-cover"
        />
      </div>

      {/* 차량 정보 */}
      <div className="xx:p-2 sm:p-4 space-y-1 mb-2">
        <h2 className="xx:text-xl sm:text-2xl font-bold text-gray-800">{formData.car.title ?? ''}</h2>
        <p className="text-sm text-gray-600">{formData.car.subtitle ?? ''}</p>
      </div>


    </section>
  );
};

export default ReservationBanner;
