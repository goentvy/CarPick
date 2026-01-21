const ReservationBanner = ({ formData }) => {
  return (
    <section className="max-w-[640px] w-full overflow-hidden">
      {/* 상단 차량 예약 현황 */}
      <div className="bg-sky-500 py-3 text-sm text-white text-center">
        <span>총 19대의 차량 중 </span>
        <span className="bg-white px-2 rounded-4xl font-semibold text-blue-600">11대</span>가 예약 가능합니다.
      </div>

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

      {/* 하단 옵션 및 결제 영역 */}
      <div className="xx:px-2 sm:px-4 pb-3 grid grid-cols-1 gap-3">
        {/* 옵션 및 요금 */}
        <div className="space-y-2 text-sm text-gray-700">
          <div className="space-y-1 text-right">
            <span className="bg-gray-100 px-3 py-1 rounded-4xl text-gray-400">유아 카시트 2개</span>
            <span className="bg-gray-100 px-3 py-1 rounded-4xl text-gray-400">넓은 트렁크</span>
          </div>

        </div>




      </div>
    </section>
  );
};

export default ReservationBanner;
