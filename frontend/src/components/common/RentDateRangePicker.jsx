import { useState, useMemo } from 'react';
import { DateRange } from 'react-date-range';
import { ko } from 'date-fns/locale';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import Modal from './Modal';

const RentDateRangePicker = ({ onChange, onClose }) => {
  const defaultRange = useMemo(() => [
    {
      startDate: new Date(),
      endDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      key: 'selection',
    },
  ], []);

  const [range, setRange] = useState(defaultRange);
  const [startHour, setStartHour] = useState(10);
  const [endHour, setEndHour] = useState(10);

  const getDurationText = () => {
    const start = new Date(range[0].startDate);
    const end = new Date(range[0].endDate);
    start.setHours(startHour, 0, 0, 0);
    end.setHours(endHour, 0, 0, 0);

    const diffMs = end - start;
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;

    return `총 ${days}일 ${hours}시간 이용`;
  };

  const handleChange = (item) => {
    setRange([item.selection]);
  };

  const handleConfirm = () => {
    const startDate = new Date(range[0].startDate);
    const endDate = new Date(range[0].endDate);
    startDate.setHours(startHour, 0, 0, 0);
    endDate.setHours(endHour, 0, 0, 0);
    onChange?.({ startDate, endDate });
    onClose?.(); // ✅ 모달 닫기
  };

  const handleReset = () => {
    setRange(defaultRange);
    setStartHour(10);
    setEndHour(10);
  };

  const formatDate = (date) =>
    date.toLocaleDateString('ko-KR', {
      month: '2-digit',
      day: '2-digit',
      weekday: 'short',
    });

  return (
    <Modal onClose={onClose}>
        {/* 상단: 대여/반납 날짜 및 시간 */}
        <div className="mx-auto mb-4 w-full">
          <p className="text-sm font-semibold text-gray-700 mb-2">
            {formatDate(range[0].startDate)} {startHour.toString().padStart(2, '0')}:00 ~{' '}
            {formatDate(range[0].endDate)} {endHour.toString().padStart(2, '0')}:00
          </p>
          <div className="flex justify-between gap-2 w-full">
            <div className="flex flex-col w-1/2">
              <label className="text-xs text-gray-500 mb-1">대여시간</label>
              <select
                aria-label="대여시간"
                value={startHour}
                onChange={(e) => setStartHour(Number(e.target.value))}
                className="border rounded-md px-2 py-1 text-sm w-full"
              >
                {[...Array(24)].map((_, i) => (
                  <option key={i} value={i}>
                    {i.toString().padStart(2, '0')}:00
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col w-1/2">
              <label className="text-xs text-gray-500 mb-1">반납시간</label>
              <select
                aria-label="반납시간"
                value={endHour}
                onChange={(e) => setEndHour(Number(e.target.value))}
                className="border rounded-md px-2 py-1 text-sm w-full"
              >
                {[...Array(24)].map((_, i) => (
                  <option key={i} value={i}>
                    {i.toString().padStart(2, '0')}:00
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 안내 문구 */}
        <p className="mt-4 text-xs text-gray-500">
          ※ 24시간 미만 대여는 전화 또는 채팅상담 전용으로 예약 가능합니다.
        </p>

        {/* 중단: 달력 */}
        <DateRange
          locale={ko}
          ranges={range}
          onChange={handleChange}
          months={2}
          direction="vertical"
          showDateDisplay={false}
          minDate={new Date()}
          rangeColors={['#3b82f6']}
          moveRangeOnFirstSelection={false}
        />

        {/* 버튼 영역 */}
        <div className="flex justify-between mt-3 w-full">
          <button
            onClick={handleReset}
            className="w-1/2 mr-2 px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-200 rounded-full hover:bg-gray-300"
          >
            초기화
          </button>
          <button
            onClick={handleConfirm}
            className="w-1/2 ml-2 px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-full hover:bg-blue-600"
          >
            {getDurationText()}
          </button>
        </div>
    </Modal>
  );
};

export default RentDateRangePicker;
