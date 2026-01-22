import { useState, useEffect, useRef } from 'react';
import RentDateRangePicker from '../../components/common/RentDateRangePicker';
import { useNavigate, useLocation } from 'react-router-dom';
import PickupLocationModal from '../../components/common/PickupLocationModal';

// `calculateMonths` 함수
function calculateMonths(start, end) {
  const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  return months || 1;
}

const RentHeader = ({ type, location }) => {
  const navigate = useNavigate();
  const locationObj = useLocation();
  const query = new URLSearchParams(locationObj.search);

  // 초기값 설정
  const initialRentType = query.get('rentType') || 'short';
  const initialPickupBranchName = query.get('pickupBranchName') || '서울역 KTX';
  const queryStartDate = query.get('startDate') ? new Date(query.get('startDate')) : null;
  const queryEndDate = query.get('endDate') ? new Date(query.get('endDate')) : null;

  const initialDateRange = queryStartDate && queryEndDate
    ? {
      startDate: queryStartDate,
      endDate: queryEndDate,
      months: calculateMonths(queryStartDate, queryEndDate),
    }
    : {
      startDate: new Date(),
      endDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      months: 1,
    };

  const [rentType, setRentType] = useState(initialRentType);
  const [pickupBranchName, setPickupBranchName] = useState(query.get('pickupBranchName') || '픽업 장소 선택');
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState(initialDateRange);
  const [pickupBranchId, setPickupBranchId] = useState(query.get('pickupBranchId') || null);

  const prevType = useRef(initialRentType);

  useEffect(() => {
    const today = new Date();

    if (prevType.current !== rentType) {
      if (rentType === 'short') {
        setDateRange({
          startDate: today,
          endDate: new Date(today.getTime() + 24 * 60 * 60 * 1000),
          months: 1,
        });
      } else if (rentType === 'long') {
        const nextMonth = new Date(today);
        nextMonth.setMonth(today.getMonth() + 1);
        setDateRange({
          startDate: today,
          endDate: nextMonth,
          months: calculateMonths(today, nextMonth),
        });
      }
      prevType.current = rentType;
    }
  }, [rentType]);

  useEffect(() => {
    document.body.style.overflow = (showLocationPicker || showDatePicker) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showLocationPicker, showDatePicker]);

  const formatDate = (date) =>
    date.toLocaleDateString('ko-KR', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      weekday: 'short',
    });

  const getDurationText = () => {
    if (!dateRange.startDate || !dateRange.endDate) return '';
    const diffMs = dateRange.endDate - dateRange.startDate;
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    return `총 ${days}일 ${hours}시간 이용`;
  };

  const getLongTermText = () => {
    if (!dateRange.startDate || !dateRange.endDate) return '';
    const months = dateRange.months || 1;
    const diffMs = dateRange.endDate - dateRange.startDate;
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return `${months}개월 (${days}일)`;
  };

  // ✅ 차량 찾기 버튼 클릭 시 이동 로직 (year로 수정)
  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set('pickupBranchName', pickupBranchName);
    params.set('pickupBranchId', pickupBranchId);
    params.set('rentType', rentType);
    params.set('startDate', dateRange.startDate.toISOString());
    params.set('endDate', dateRange.endDate.toISOString());
    params.set('months', dateRange.months || 1);

    navigate(`/day?${params.toString()}`);
  };

  return (
    <section id="car-list" className="bg-brand text-center pt-7 pb-9 sm:pb-[37px] px-6 sm:px-[41px] rounded-b-[40px] sm:rounded-b-[60px] relative z-[999]">
      <div className="rentM bg-gray-50 rounded-[30px] xx:px-2.5 sm:px-3 relative z-0">
        <div className="rentM relative p-2">
          <div className="rentMBg flex items-center rounded-lg p-1.5 cursor-pointer bg-gray-100">
            <i className="fa-solid fa-magnifying-glass text-[20px] mr-3"></i>
            <div id="rentInfo" className="flex flex-col w-full break-keep relative">
              <p className="text-left text-gray-800 tracking-tighter text-[16px] font-semibold" onClick={() => setShowLocationPicker(prev => !prev)}>
                {pickupBranchName}
              </p>
              <p
                id="rentTime"
                className="flex justify-between text-gray-400 text-[16px] text-left"
                onClick={() => setShowDatePicker(prev => !prev)}
              >
                <span id="pickDay">{formatDate(dateRange.startDate)} &gt; {formatDate(dateRange.endDate)}</span>
                <span id="pickTime" className="text-[12px] text-gray-500">
                  {rentType == 'short' ? getDurationText() : getLongTermText()}
                </span>
              </p>
            </div>
          </div>

          {showLocationPicker && (
            <PickupLocationModal
              onClose={() => setShowLocationPicker(false)}
              onSelect={(branchId, branchName) => {
                setPickupBranchName(branchName);
                setPickupBranchId(branchId);
                setShowLocationPicker(false);
                setShowDatePicker(true);
              }}
            />
          )}

          {showDatePicker && (
            <div className="absolute left-0 top-full mt-2 z-50 bg-white rounded-xl shadow-lg w-full">
              <RentDateRangePicker
                initialRange={dateRange}
                onChange={(selection) => {
                  setDateRange({
                    startDate: selection.startDate,
                    endDate: selection.endDate,
                    months: selection.months || 1,
                  });
                  setRentType(selection.activeType);
                  setShowDatePicker(false);

                  const params = new URLSearchParams({
                    pickupBranchName,
                    pickupBranchId,
                    rentType: selection.activeType,
                    startDate: selection.startDate.toISOString(),
                    endDate: selection.endDate.toISOString(),
                    months: selection.months || 1,
                  });

                  navigate(`/day?${params.toString()}`);
                }}
                onClose={() => setShowDatePicker(false)}
                onTabChange={(tab) => setRentType(tab)}
                type={rentType}
                location={location}
              />
            </div>
          )}
        </div>

        <div className="py-3">
          <button className="w-full bg-brand text-white font-bold py-2.5 hover:bg-blue-600 rounded-[50px]" onClick={handleSearch}>
            차량 찾기
          </button>
        </div>
      </div>
    </section>
  );
};

export default RentHeader;