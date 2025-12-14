const ReservationBanner = () => {
  return (
    <section className="max-w-[640px] w-full mx-auto rounded-2xl bg-white shadow-md overflow-hidden mb-8 mt-2">
      {/* 상단 차량 예약 현황 */}
      <div className="bg-blue-500 px-6 py-3 text-sm text-white text-center">
        <span>총 19대의 차량 중 </span>
        <span className="bg-white px-2 rounded-4xl font-semibold text-blue-600">11대</span>가 예약 가능합니다.
      </div>

      {/* 차량 이미지 */}
      <div className="w-full flex justify-center bg-gray-100">
        <img
          src="/images/common/car1.svg"
          alt="Carnival High-Limousine"
          className="w-[400px] h-auto pt-8 object-cover"
        />
      </div>

      {/* 차량 정보 */}
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-1">Carnival High-Limousine</h2>
        <p className="text-sm text-gray-600 mb-3">가족여행에 최적화 된 공간</p>
      </div>

      {/* 하단 옵션 및 결제 영역 */}
      <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 옵션 및 요금 */}
        <div className="space-y-2 text-sm text-gray-700">
          <div className="space-y-1 text-right">
            <span className="bg-gray-100 px-3 py-1 rounded-4xl text-gray-400">유아 카시트 2개</span>
            <span className="bg-gray-100 px-3 py-1 rounded-4xl text-gray-400">넓은 트렁크</span>
          </div>
          <hr className="border border-gray-200"/>
          <div className="flex flex-row justify-between py-2">
            <div className="flex flex-row gap-4">
                <div className="flex flex-row gap-2 items-center">
                    <img src="./images/common/gas.svg" alt="gas" />
                    <span className="text-gray-400">Petrol</span>
                </div>
                <div className="flex flex-row gap-2 items-center">
                    <img src="./images/common/user.svg" alt="gas" />
                    <span className="text-gray-400">4</span>
                </div>
                <div className="flex flex-row gap-2 items-center">
                    <img src="./images/common/carlogo.svg" alt="gas" />
                    <span className="text-gray-400">Hatchback</span>
                </div>
            </div>
            <p className="text-gray-500">
                <span className="text-xl! font-semibold text-gray-400">55,000/day</span>
            </p>
          </div>
          <hr className="border border-gray-200"/>
        </div>

        {/* 총 금액 및 버튼 */}
        <div className="flex flex-row justify-between items-end">
          <div className="flex flex-col flex-1 text-sm text-gray-500 mb-2">
            <span>총 이용 금액:</span>
            <span className="text-4xl! font-bold text-blue-500">128,000원</span>
          </div>
          <button
            type="button"
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            선택하기
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReservationBanner;
