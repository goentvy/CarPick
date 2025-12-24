import { useState } from 'react';
import RentDateRangePicker from '../../components/common/RentDateRangePicker';
import { useNavigate } from 'react-router-dom';
import PickupLocationModal from '../../components/common/PickupLocationModal';

const RentHeader = () => {
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
    <section id="car-list" className="bg-brand text-center pt-7 pb-9 sm:pb-[37px] px-6 sm:px-[41px] rounded-b-[40px] sm:rounded-b-[60px] relative z-[999]">

      {/* 렌트 타입 선택 */}
      <div className="rentM bg-gray-50 rounded-[30px] xx:px-2.5 sm:px-3 relative z-0">

        {/* 픽업 장소 */}
        <div className="rentM relative p-2">
          <div
            className="rentMBg flex items-center rounded-lg p-1.5 cursor-pointer bg-gray-100"
            onClick={() => setShowLocationPicker((prev) => !prev)}
          >
            <i className="fa-solid fa-magnifying-glass text-[20px] mr-3" alt="차량검색"></i>
            <div className="flex flex-col w-full break-keep">
              <p className="text-left text-gray-800 tracking-tighter text-[16px] font-semibold">
                {pickupLocation}
              </p>
              <p className="flex justify-between text-gray-400 text-[16px] text-left">
                <span id="pickDay">{formatDate(dateRange.startDate)} &gt; {formatDate(dateRange.endDate)}</span>
                <span id="pickTime" className="text-[12px] text-gray-500">{rentalHours}시간</span>
              </p>
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
          {showDatePicker && (
            <div className="absolute left-0 top-full mt-2 z-50 bg-white rounded-xl shadow-lg w-full">
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
      </div>
    </section>
  );
};

export default RentHeader;
