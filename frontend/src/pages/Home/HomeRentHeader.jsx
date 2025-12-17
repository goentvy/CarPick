import { useState } from 'react';

const HomeRentHeader = () => {
  const [rentType, setRentType] = useState('short'); // short or long

  return (
    <section 
      className="
        bg-blue-500 text-center
          xx:pb-[22px] xs:pb-7 sm:pb-[37px] xx:px-6 sm:px-[41px] xx:rounded-b-[40px] xs:rounded-b-[50px] sm:rounded-b-[60px]">
      {/* 프로모션 문구 */}
      <button className="xx:hidden sm:inline border border-lime-300 rounded-4xl bg-sky-700 px-3 xx:my-1 sm:my-3">
        <span className="text-xs text-lime-300">✧ AI 기반 즉시 픽업</span>
      </button>
      <p className="xx:text-[28px] sm:text-4xl font-bold text-white xx:mb-0 sm:mb-2">
        도착하면 바로 카픽!
      </p>
      <p className="xx:text-lime-300 sm:text-white text-sm sm:text-base xx:mb-3 sm:mb-6">
        여행의 시작을 가장 가볍게 만드는 AI 모빌리티
      </p>

      {/* 렌트 타입 선택 */}
      <div className="bg-gray-50 rounded-[30px] xx:px-2.5 sm:px-3 pt-3">
        <div className="flex p-[5px] justify-center gap-1 bg-gray-100 rounded-4xl">
          <button
            onClick={() => setRentType('short')}
            className={`flex-1 px-6 py-2 rounded-full font-semibold transition text-sm
              ${rentType === 'short' 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'text-gray-400 hover:bg-blue-400 hover:text-gray-700'}`}
          >
            단기 렌트
          </button>
          <button
            onClick={() => setRentType('long')}
            className={`flex-1 px-6 py-2 rounded-full font-semibold transition text-sm
              ${rentType === 'long' 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'text-gray-400 hover:bg-blue-400 hover:text-gray-700'}`}
          >
            장기 렌트
          </button>
        </div>
        {/* 픽업 장소 */}
        <div className="pt-2">
            <div className="flex items-center bg-gray-100 rounded-lg p-3 shadow-sm">
              {/* 왼쪽 아이콘 */}
              <img
                src="./images/common/location.svg"
                alt="location"
                className="w-6 h-6 mr-3"
              />

              {/* 오른쪽 텍스트 */}
              <div className="flex flex-col">
                <p className="text-left text-xs text-gray-500">픽업 장소</p>
                <p className="text-gray-800">서울역 KTX</p>
              </div>
            </div>
        </div>
        <div className="pt-2">
          <div className="flex items-center bg-gray-100 rounded-lg p-3 shadow-sm">
            {/* 왼쪽 아이콘 */}
            <img
              src="./images/common/calendar.svg"
              alt="calendar"
              className="w-6 h-6 mr-3"
            />

            {/* 오른쪽 텍스트 */}
            <div className="flex flex-col w-full">
              <p className="flex justify-between text-xs text-gray-500">
                <span>이용 일시</span>
                <span>24시간</span>
              </p>
              <p className="text-left text-gray-800 tracking-tighter">
                12.03 14:00 &gt; 12.04 14:00
              </p>
            </div>
          </div>
        </div>
        <div className="py-3">
          <button className="w-full bg-blue-500 text-white font-bold py-2.5 hover:bg-blue-600 rounded-[50px]">차량 찾기</button>
        </div>
      </div>
    </section>
  );
};

export default HomeRentHeader;