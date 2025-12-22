import { useState } from 'react';
import RentDateRangePicker from '../../components/common/RentDateRangePicker';
import { useNavigate } from 'react-router-dom';
import PickupLocationModal from '../../components/common/PickupLocationModal';

const HomeRentHeader = () => {
  const navigate = useNavigate();
  const [rentType, setRentType] = useState('short');
  const [pickupLocation, setPickupLocation] = useState('서울역 KTX');
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
  });

  const formatDate = (date) =>
    date.toLocaleDateString('ko-KR', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      weekday: 'short',
    });

  const getDurationText = () => {
    const diffMs = dateRange.endDate - dateRange.startDate;
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    return `${days}일 ${hours}시간`;
  };

  const handleSearch = () => {
    const params = new URLSearchParams({
      pickupLocation, rentType, startDate: dateRange.startDate.toISOString(),
      endDate: dateRange.endDate.toISOString(),
    });
    console.log(params);
    navigate(`/result?${params.toString()}`);
  };

  return (
    <section className="bg-blue-500 text-center xx:pb-[22px] xs:pb-7 sm:pb-[37px] xx:px-6 sm:px-[41px] xx:rounded-b-[40px] xs:rounded-b-[50px] sm:rounded-b-[60px] relative z-999">
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
      <div className="bg-gray-50 rounded-[30px] xx:px-2.5 sm:px-3 pt-3 relative z-0">
        <div className="flex p-[5px] justify-center gap-1 bg-gray-100 rounded-4xl">
          {['short', 'long'].map((type) => (
            <button
              key={type}
              onClick={() => setRentType(type)}
              className={`flex-1 px-6 py-2 rounded-full font-semibold transition text-sm ${
                rentType === type
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-400 hover:bg-blue-400 hover:text-gray-700'
              }`}
            >
              {type === 'short' ? '단기 렌트' : '장기 렌트'}
            </button>
          ))}
        </div>

        {/* 픽업 장소 */}
        <div className="pt-2 relative">
          <div
            className="flex items-center bg-gray-100 rounded-lg p-3 shadow-sm cursor-pointer"
            onClick={() => setShowLocationPicker((prev) => !prev)}
          >
            <img
              src="./images/common/location.svg"
              alt="location"
              className="w-6 h-6 mr-3"
            />
            <div className="flex flex-col">
              <p className="text-left text-xs text-gray-500">픽업 장소</p>
              <p className="text-gray-800">{pickupLocation}</p>
            </div>
          </div>

          {showLocationPicker && (
            <PickupLocationModal
              onClose={() => setShowLocationPicker(false)}
              onSelect={(loc) => {
                setPickupLocation(loc);
                setShowLocationPicker(false);
                setShowDatePicker(true); // ✅ 장소 선택 후 날짜 모달 자동 열림
              }}
            />
          )}
        </div>

        {/* 이용 일시 */}
        <div className="pt-2 relative">
          <div
            className="flex items-center bg-gray-100 rounded-lg p-3 shadow-sm cursor-pointer"
            onClick={() => setShowDatePicker((prev) => !prev)}
          >
            <img
              src="./images/common/calendar.svg"
              alt="calendar"
              className="w-6 h-6 mr-3"
            />
            <div className="flex flex-col w-full">
              <p className="flex justify-between text-xs text-gray-500">
                <span>이용 일시</span>
                <span>{getDurationText()}</span>
              </p>
              <p className="text-left text-gray-800 tracking-tighter">
                {formatDate(dateRange.startDate)} &gt; {formatDate(dateRange.endDate)}
              </p>
            </div>
          </div>

          {showDatePicker && (
            <div className="absolute left-0 top-full mt-2 z-50 bg-white border rounded-xl shadow-lg w-full">
              <RentDateRangePicker
                onChange={(selection) => {
                  setDateRange({
                    startDate: selection.startDate,
                    endDate: selection.endDate,
                  });
                  setShowDatePicker(false); // ✅ 모달 닫기
                }}
                onClose={() => setShowDatePicker(false)}
              />
            </div>
          )}
        </div>

        {/* 차량 찾기 버튼 */}
        <div className="py-3">
          <button 
            className="w-full bg-blue-500 text-white font-bold py-2.5 hover:bg-blue-600 rounded-[50px]"
            onClick={handleSearch}>
            차량 찾기
          </button>
        </div>
      </div>
    </section>
  );
};

export default HomeRentHeader;
