import { useState } from 'react';

const HomeRentHeader = () => {
  const [rentType, setRentType] = useState('short'); // short or long

  return (
    <section className="bg-blue-500 py-10 px-6 text-center rounded-b-4xl">
      {/* 프로모션 문구 */}
      <button className="border border-lime-300 rounded-4xl bg-sky-700 px-3 my-3">
        <img src="" alt="" />
        <span className="text-xs! text-lime-300">AI 기반 즉시 픽업</span>
      </button>
      <p className="text-4xl sm:text-4xl font-bold text-white mb-2">
        도착하면 바로 카픽!
      </p>
      <p className="text-white text-sm sm:text-base mb-6">
        여행의 시작을 가장 가볍게 만드는 AI 모빌리티
      </p>

      {/* 렌트 타입 선택 */}
      <div className="bg-gray-50">
        <div className="flex p-4 justify-center gap-4">
          <button
            onClick={() => setRentType('short')}
            className={`flex-1 px-6 py-2 rounded-full font-semibold transition 
              ${rentType === 'short' 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'text-gray-400 hover:bg-blue-400 hover:text-gray-700'}`}
          >
            단기 렌트
          </button>
          <button
            onClick={() => setRentType('long')}
            className={`flex-1 px-6 py-2 rounded-full font-semibold transition 
              ${rentType === 'long' 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'text-gray-400 hover:bg-blue-400 hover:text-gray-700'}`}
          >
            장기 렌트
          </button>
        </div>
        {/* 픽업 장소 */}
        <div className="mb-2 p-2">
            <div className="flex items-center bg-gray-100 rounded-lg p-3 shadow-sm">
              {/* 왼쪽 아이콘 */}
              <img
                src="./images/common/location.svg"
                alt="location"
                className="w-6 h-6 mr-3"
              />

              {/* 오른쪽 텍스트 */}
              <div className="flex flex-col">
                <p className="text-left text-xs! text-gray-500">픽업 장소</p>
                <p className="text-gray-800">서울역 KTX</p>
              </div>
            </div>
        </div>
        <div className="mb-2 p-2">
          <div className="flex items-center bg-gray-100 rounded-lg p-3 shadow-sm">
            {/* 왼쪽 아이콘 */}
            <img
              src="./images/common/calendar.svg"
              alt="calendar"
              className="w-6 h-6 mr-3"
            />

            {/* 오른쪽 텍스트 */}
            <div className="flex flex-col">
              <p className="text-left text-xs! text-gray-500">이용 일시</p>
              <p className="text-xl font-semibold text-gray-800">
                <span className="tracking-widest!">2025 . 12 . 03 14 : 00 &gt; 2025 . 12 . 04 14 : 00&nbsp;&nbsp;</span><span className="text-xs! text-gray-500">24시간</span>
              </p>
            </div>
          </div>
        </div>
        <div className="p-2">
          <button className="w-full bg-lime-300 text-blue-500 border border-2 text-sm py-2 hover:bg-lime-400 rounded-3xl">AI 차량 찾기</button>
        </div>
      </div>
    </section>
  );
};

export default HomeRentHeader;