import { useState, useEffect, useRef } from 'react';
import RentDateRangePicker from '../../components/common/RentDateRangePicker';
import { useNavigate, useLocation } from 'react-router-dom';
import PickupLocationModal from '../../components/common/PickupLocationModal';

// `calculateMonths`를 함수 선언식으로 변경
function calculateMonths(start, end) {
  const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  return months || 1; // 최소 1개월 보장
}

const RentHeader = ({ type, location }) => {
  const navigate = useNavigate();
  const locationObj = useLocation();
  const query = new URLSearchParams(locationObj.search);

  // URL 쿼리에서 값 가져오기, 없으면 기본값
  const initialRentType = query.get('rentType') || 'short';
  const initialPickupLocation = query.get('pickupLocation') || '서울역 KTX';
  const queryStartDate = query.get('startDate') ? new Date(query.get('startDate')) : null;
  const queryEndDate = query.get('endDate') ? new Date(query.get('endDate')) : null;

  // dateRange를 URL값으로 초기화
  const initialDateRange = queryStartDate && queryEndDate
    ? {
      startDate: queryStartDate,
      endDate: queryEndDate,
      months: calculateMonths(queryStartDate, queryEndDate), // 자동 계산
    }
    : {
      startDate: new Date(),
      endDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      months: 1,
    };

  const [rentType, setRentType] = useState(initialRentType);
  const [pickupLocation, setPickupLocation] = useState(initialPickupLocation);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState(initialDateRange);

  const [pickupBranchId, setPickupBranchId] = useState(query.get('pickupBranchId') || null);
  const prevType = useRef(initialRentType);
  const prevQueryDates = useRef({
    start: queryStartDate,
    end: queryEndDate
  });

  // type 변경 시 초기화
  useEffect(() => {
    const today = new Date();

    if (prevType.current !== type) {
      if (type === 'short') {
        setDateRange({
          startDate: today,
          endDate: new Date(today.getTime() + 24 * 60 * 60 * 1000),
          months: 1,
        });
      } else if (type === 'long') {
        const nextMonth = new Date(today);
        nextMonth.setMonth(today.getMonth() + 1);
        setDateRange({
          startDate: today,
          endDate: nextMonth,
          months: calculateMonths(today, nextMonth), // 자동 계산
        });
      }
      prevType.current = type;
    }
  }, [type]);

  useEffect(() => {
    if (showLocationPicker || showDatePicker) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showLocationPicker, showDatePicker]);

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
    const diffMs = dateRange.endDate - dateRange.startDate;
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const months = dateRange.months || 1;
    return `${months}개월 (${days}일)`;
  };

  // URL로 파라미터를 기반으로 페이지 이동
  const handleSearch = () => {
    const params = new URLSearchParams({
      pickupLocation,
      pickupBranchId,
      rentType,
      startDate: dateRange.startDate.toISOString(),
      endDate: dateRange.endDate.toISOString(),
    });
    navigate(`/${rentType === 'short' ? 'day' : 'month'}?${params.toString()}`);
  };

  return (
    <section id="car-list" className="bg-brand text-center pt-7 pb-9 sm:pb-[37px] px-6 sm:px-[41px] rounded-b-[40px] sm:rounded-b-[60px] relative z-[999]">
      <div className="rentM bg-gray-50 rounded-[30px] xx:px-2.5 sm:px-3 relative z-0">
        {/* 픽업 장소 */}
        <div className="rentM relative p-2">
          <div className="rentMBg flex items-center rounded-lg p-1.5 cursor-pointer bg-gray-100">
            <i className="fa-solid fa-magnifying-glass text-[20px] mr-3"></i>
            <div id="rentInfo" className="flex flex-col w-full break-keep relative">
              <p
                id="rentLoca"
                className="text-left text-gray-800 tracking-tighter text-[16px] font-semibold"
                onClick={() => setShowLocationPicker(prev => !prev)}
              >
                {pickupLocation}
              </p>
              <p
                id="rentTime"
                className="flex justify-between text-gray-400 text-[16px] text-left"
                onClick={() => setShowDatePicker(prev => !prev)}
              >
                <span id="pickDay">{formatDate(dateRange.startDate)} &gt; {formatDate(dateRange.endDate)}</span>
                <span id="pickTime" className="text-[12px] text-gray-500">
                  {type == 'short' ? getDurationText() : getLongTermText()}
                </span>
              </p>
            </div>
          </div>

          {showLocationPicker && (
            <PickupLocationModal
              onClose={() => setShowLocationPicker(false)}
              onSelect={(branch) => {
                setPickupLocation(branch.branchName);
                setPickupBranchId(branch.branchId);
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
                    months: calculateMonths(selection.startDate, selection.endDate),
                  });
                  setShowDatePicker(false);

                  const params = new URLSearchParams({
                    pickupLocation,
                    pickupBranchId,
                    rentType: selection.activeType,
                    startDate: selection.startDate.toISOString(),
                    endDate: selection.endDate.toISOString(),
                  });

                  navigate(
                    selection.activeType === 'short'
                      ? `/day?${params.toString()}`
                      : `/month?${params.toString()}`
                  );
                }}
                onClose={() => setShowDatePicker(false)}
                type={type}
                location={location}
              />
            </div>
          )}
        </div>

        {/* 차량 찾기 버튼 */}
        <div className="py-3">
          <button
            className="w-full bg-brand text-white font-bold py-2.5 hover:bg-blue-600 rounded-[50px]"
            onClick={handleSearch}
          >
            차량 찾기
          </button>
        </div>
      </div>
    </section>
  );
};

export default RentHeader;
