import { useLocation } from "react-router-dom";

const ReservationBanner = () => {
  const location = useLocation();
  
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
          src="/images/common/car1.svg"
          alt="Carnival High-Limousine"
          className="w-[400px] h-auto pt-8 object-cover"
        />
      </div>

      {/* 차량 정보 */}
      <div className="xx:p-2 sm:p-4 space-y-1 mb-2">
        <h2 className="xx:text-xl sm:text-2xl font-bold text-gray-800">Carnival High-Limousine</h2>
        <p className="text-sm text-gray-600">가족여행에 최적화 된 공간</p>
      </div>

      {/* 하단 옵션 및 결제 영역 */}
      <div className="xx:px-2 sm:px-4 pb-3 grid grid-cols-1 gap-3">
        {/* 옵션 및 요금 */}
        <div className="space-y-2 text-sm text-gray-700">
          <div className="space-y-1 text-right">
            <span className="bg-gray-100 px-3 py-1 rounded-4xl text-gray-400">유아 카시트 2개</span>
            <span className="bg-gray-100 px-3 py-1 rounded-4xl text-gray-400">넓은 트렁크</span>
          </div>
          <hr className="border border-gray-200"/>
          <div className="flex flex-row justify-between py-2">
            <div className="flex flex-row xx:gap-2 gap-4">
                <div className="flex flex-row xx:gap-1 gap-2 items-center">
                    <img src="./images/common/gas.svg" alt="gas" />
                    <span className="xx:text-xs text-gray-400">Petrol</span>
                </div>
                <div className="flex flex-row xx:gap-1 gap-2 items-center">
                    <img src="./images/common/user.svg" alt="gas" />
                    <span className="xx:text-xs text-gray-400">4</span>
                </div>
                <div className="flex flex-row xx:gap-1 gap-2 items-center">
                    <img src="./images/common/carlogo.svg" alt="gas" />
                    <span className="xx:text-xs text-gray-400">Hatchback</span>
                </div>
            </div>
            <p className="text-gray-500">
                <span className="xx:text-sm sm:text-xl font-semibold text-gray-400">55,000/day</span>
            </p>
          </div>
          <hr className="border border-gray-200"/>
        </div>

        {/* 총 금액 및 버튼 */}
        { location.pathname === "/reservation" ? 
          <span></span>
        : 
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-col flex-1 text-sm text-gray-500 mb-2">
              <span>총 이용 금액:</span>
              <span className="xx:text-2xl text-4xl font-bold text-blue-500">128,000원</span>
            </div>
            <button
              type="button"
              className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              선택하기
            </button>
          </div>
        }
      </div>
    </section>
  );
};

export default ReservationBanner;
