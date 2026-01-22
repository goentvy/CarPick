import { useState, useMemo, useEffect } from 'react';
import { DateRange } from 'react-date-range';
import { ko } from 'date-fns/locale';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import Modal from './Modal';

const RentDateRangePicker = ({
  onChange,
  onClose,
  type,
  location,
  onTabChange,
  initialRange,
}) => {
  // 탭 상태 (short/long)
  const [activeTab, setActiveTab] = useState(type);

  // range 상태 (단기/장기 날짜)
  const shortDefaultRange = useMemo(() => [
    {
      startDate: new Date(),
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      key: 'selection',
    },
  ], []);

  const longDefaultRange = useMemo(() => [
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ], []);


  const [shortRange, setShortRange] = useState(shortDefaultRange);
  const [longRange, setLongRange] = useState(longDefaultRange);

  // 단기 렌트 시간
  const [startHour, setStartHour] = useState(10);
  const [endHour, setEndHour] = useState(10);

  // 장기 렌트 개월
  const [selectedMonths, setSelectedMonths] = useState(
    initialRange?.months || 1
  );

  const [showLongCalendar, setShowLongCalendar] = useState(false);


  const monthOptions = [
    { months: 1, days: 30 },
    { months: 2, days: 60 },
    { months: 3, days: 90 },
    { months: 4, days: 120 },
    { months: 5, days: 150 },
    { months: 6, days: 180 },
    { months: 7, days: 210 },
    { months: 8, days: 240 },
    { months: 9, days: 270 },
    { months: 10, days: 300 },
    { months: 11, days: 330 },
    { months: 12, days: 360 },
  ];

  // 단기 렌트 이용 시간 텍스트
  const getDurationText = () => {
    const start = new Date(shortRange[0].startDate);
    const end = new Date(shortRange[0].endDate);
    start.setHours(startHour, 0, 0, 0);
    end.setHours(endHour, 0, 0, 0);

    const diffMs = end - start;
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;

    return `총 ${days}일 ${hours}시간 이용`;
  };

  // 장기 렌트 텍스트
  const getLongTermText = () => {
    const start = new Date(longRange[0].startDate);
    const end = new Date(longRange[0].endDate);
    const diffMs = end - start;
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return `${selectedMonths}개월 (${days}일)`;
  };

  const formatDate = (date) =>
    date.toLocaleDateString('ko-KR', {
      month: '2-digit',
      day: '2-digit',
      weekday: 'short',
    });

  // 탭 변경
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    handleReset();
    if (onTabChange) onTabChange(tab);
  };

  // DateRange 변경
  const handleChange = (item) => {
    setRange([item.selection]);
  };

  // 단기렌트 확인
  const handleConfirm = () => {
    const startDate = new Date(shortRange[0].startDate);
    const endDate = new Date(shortRange[0].endDate);

    startDate.setHours(startHour, 0, 0, 0);
    endDate.setHours(endHour, 0, 0, 0);

    onChange?.({ startDate, endDate, activeType: activeTab });
    onClose?.();
  };

  // 장기렌트 확인
  const handleLongTermConfirm = () => {
    const startDate = new Date(longRange[0].startDate);
    startDate.setHours(startHour, 0, 0, 0);
    const endDate = calculateLongTermEndDate(startDate, selectedMonths);

    onChange?.({ startDate, endDate, activeType: activeTab, months: selectedMonths });
    onClose?.();
  };

  const calculateLongTermEndDate = (startDate, months) => {
    const end = new Date(startDate);

    // 정확한 날짜 계산을 위해 `setMonth` 사용
    end.setMonth(startDate.getMonth() + months);

    if (end.getDate() < startDate.getDate()) {
      end.setMonth(end.getMonth() + 1);
    }

    return end;
  };


  // 초기화
  const handleReset = () => {
    setShortRange(shortDefaultRange);
    setStartHour(10);
    setEndHour(10);
  };

  return (
    <Modal onClose={onClose}>
      <div className="flex flex-row justify-between">
        <div className="font-lg font-bold p-3">언제 필요하세요?</div>
        <div className="p-3 text-right">
          <img
            src="./images/common/close.svg"
            alt="close"
            onClick={() => onClose()} />
        </div>
      </div>
      {/* 탭 */}
      <div className="flex bg-blue-50 rounded-full max-w-[528px] mx-auto w-full mb-2 p-1">
        <button
          type="button"
          onClick={() => handleTabClick('short')}
          className={`flex rounded-full w-[50%] py-1 justify-center cursor-pointer text-sm cursor-pointer ${activeTab === 'short' ? 'bg-blue-500 text-white' : 'text-black-500'
            }`}
        >
          단기렌트
        </button>
        <button
          type="button"
          onClick={() => handleTabClick('long')}
          className={`flex rounded-full w-[50%] py-1 justify-center cursor-pointer text-sm cursor-pointer ${activeTab === 'long' ? 'bg-blue-500 text-white' : 'text-black-500'
            }`}
        >
          월 렌트
        </button>
      </div>

      {/* 단기렌트 모달 */}
      {activeTab === 'short' && (
        <div className="tab">
          <div className="mx-auto w-full max-w-[528px] text-center">
            <div className="flex bg-blue-50 rounded-[5px] px-3 py-2 mb-2 items-center text-left">
              <i className="fa-regular fa-calendar text-blue-500"></i>
              <div className="flex flex-col pl-2">
                <p className="text-sm font-semibold">
                  {formatDate(shortRange[0].startDate)} {startHour.toString().padStart(2, '0')}:00 ~{' '}
                  {formatDate(shortRange[0].endDate)} {endHour.toString().padStart(2, '0')}:00
                </p>
                <p className="text-xs text-gray-500">
                  도착 시간에 맞춰 카픽이 차량을 준비해 드려요
                </p>
              </div>
            </div>

            <div className="flex justify-between gap-2 w-full xx:px-2 xs:px-0">
              <div className="flex flex-col w-1/2">
                <label className="text-sm mb-1 text-left">대여시간</label>
                <select
                  value={startHour}
                  onChange={(e) => setStartHour(Number(e.target.value))}
                  className="border border-gray-300 rounded-sm px-2 py-1 text-sm w-full bg-blue-50"
                >
                  {[...Array(24)].map((_, i) => (
                    <option key={i} value={i}>
                      {i.toString().padStart(2, '0')}:00
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col w-1/2">
                <label className="text-sm mb-1 text-left">반납시간</label>
                <select
                  value={endHour}
                  onChange={(e) => setEndHour(Number(e.target.value))}
                  className="border border-gray-300 rounded-sm px-2 py-1 text-sm w-full bg-blue-50"
                >
                  {[...Array(24)].map((_, i) => (
                    <option key={i} value={i}>
                      {i.toString().padStart(2, '0')}:00
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-center mt-3">
              <DateRange
                locale={ko}
                ranges={shortRange}
                onChange={(item) => setShortRange([item.selection])}
                months={2}
                direction="vertical"
                showDateDisplay={false}
                minDate={new Date()}
                rangeColors={['#3b82f6']}
                moveRangeOnFirstSelection={false}
              />
            </div>

            <div className="flex justify-between mt-3 w-full max-w-[528px] mx-auto xx:px-2">
              <button
                onClick={handleReset}
                className="w-1/2 mr-2 px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-200 rounded-full hover:bg-gray-300"
              >
                초기화
              </button>
              <button
                onClick={handleConfirm}
                className="w-1/2 ml-2 px-4 py-2 text-sm font-semibold text-white bg-brand rounded-full hover:bg-blue-600"
              >
                {getDurationText()}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 장기렌트 모달 */}
      {activeTab === 'long' && (
        <div className="tab">
          <div className="mx-auto w-full max-w-[528px] text-center">
            <div className="flex flex-col mt-3 mb-2">
              <label className="text-sm mb-1 text-left">대여 시작 날짜 선택</label>
              <div
                className="startDay flex bg-blue-50 rounded-full px-4 py-2 items-center text-left cursor-pointer"
                onClick={() => setShowLongCalendar(true)}
              >
                <i className="fa-regular fa-calendar text-blue-500"></i>
                <div className="flex flex-col pl-2">
                  <p className="text-sm font-semibold">
                    {formatDate(longRange[0].startDate)} {startHour.toString().padStart(2, '0')}:00
                  </p>
                </div>
              </div>
            </div>

            {showLongCalendar && (
              <div className="flex justify-center mt-3">
                <DateRange
                  locale={ko}
                  ranges={longRange}
                  onChange={(item) => {
                    setLongRange([item.selection]);
                    setShowLongCalendar(false); // 날짜 선택 후 닫기
                  }}
                  months={1}
                  direction="vertical"
                  showDateDisplay={false}
                  minDate={new Date()}
                  rangeColors={['#3b82f6']}
                  moveRangeOnFirstSelection={false}
                />
              </div>
            )}

            <div className="dateCalendar flex flex-wrap max-w-[528px] w-full mx-auto justify-between m-4 border-b border-t border-gray-300 py-4">
              {monthOptions.map(({ months, days }) => {
                const isSelected = selectedMonths === months;
                return (
                  <label
                    key={months}
                    onClick={() => setSelectedMonths(months)}
                    className={`cursor-pointer w-[49%] text-center rounded-full text-sm py-1 mb-2 border ${isSelected
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-blue-50 border-gray-200'
                      }`}
                  >
                    {months}개월
                    <input type="radio" className="hidden" checked={isSelected} value={months} readOnly />
                  </label>
                );
              })}
            </div>

            <div className="flex justify-between mt-3 w-full max-w-[528px] mx-auto xx:px-2">
              <button
                onClick={() => {
                  setSelectedMonths(1);
                  setRange(defaultRange);
                }}
                className="w-1/2 mr-2 px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-200 rounded-full hover:bg-gray-300 cursor-pointer"
              >
                초기화
              </button>
              <button
                onClick={handleLongTermConfirm}
                className="w-1/2 ml-2 px-4 py-2 text-sm font-semibold text-white bg-brand rounded-full hover:bg-blue-600 cursor-pointer"
              >
                {selectedMonths ? `${selectedMonths}개월` : '0개월'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default RentDateRangePicker;
