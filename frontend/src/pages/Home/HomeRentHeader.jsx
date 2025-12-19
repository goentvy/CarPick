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

  const rentalHours = Math.round(
    (dateRange.endDate - dateRange.startDate) / (1000 * 60 * 60)
  );

  const handleSearch = () => {
    const params = new URLSearchParams({
      pickupLocation, rentType, startDate: dateRange.startDate.toISOString(),
      endDate: dateRange.endDate.toISOString(),
    });
    console.log(params);
    navigate(`/result?${params.toString()}`);
  };

  return (
    <section className="bg-blue-500 pb-[37px] px-[41px] text-center rounded-b-[60px]">
      {/* 프로모션 문구 */}
      <button className="border border-lime-300 rounded-4xl bg-sky-700 px-3 my-3">
        <span className="text-xs text-lime-300">✧ AI 기반 즉시 픽업</span>
      </button>
      <p className="xx:text-xl xs:text-3xl sm:text-4xl font-bold text-white mb-2">
        도착하면 바로 카픽!
      </p>
      <p className="text-white text-xs sm:text-base mb-6">
        여행의 시작을 가장 가볍게 만드는 AI 모빌리티
      </p>

      {/* 렌트 타입 선택 */}
      <div className="bg-gray-50 rounded-[30px] px-[12px] pt-[12px]">
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
              <p className="flex justify-between text-left text-xs text-gray-500">
                <span>이용 일시</span>
                <span>{rentalHours}시간</span>
              </p>
              <p className="text-sm font-semibold text-gray-800 tracking-tighter">
                12.03 14:00 &gt; 12.04 14:00
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
          <button className="w-full bg-blue-500 text-white font-bold py-[10px] hover:bg-blue-600 rounded-[50px]">차량 찾기</button>
        </div>
      </div>
    </section>
  );
};

export default HomeRentHeader;
