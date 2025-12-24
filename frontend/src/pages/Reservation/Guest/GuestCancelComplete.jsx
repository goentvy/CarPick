import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ContentTopLogo from '../../../components/common/ContentTopLogo';

const GuestCancelComplete = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ 초기값을 localStorage에서 불러오기
  const [reservation, setReservation] = useState(() => {
    const saved = localStorage.getItem("guestReservation");
    return saved ? JSON.parse(saved) : location.state || null;
  });

  // ✅ location.state가 새로 들어오면 localStorage 업데이트만 수행
  useEffect(() => {
    if (location.state) {
      localStorage.setItem("guestReservation", JSON.stringify(location.state));
    }
  }, [location.state]);

  if (!reservation) {
    return (
      <div className="flex justify-center min-h-screen w-full mt-[67px]">
        <div className="w-full max-w-md p-8 text-center">
          <ContentTopLogo 
            title="예약 정보가 없습니다."
            titleStyle="text-xl font-bold mb-4"
          />
          <p className="text-gray-700 mb-4">
            잘못된 접근이거나 예약 정보가 사라졌습니다. 다시 예약을 진행해주세요.
          </p>
          <button
            className="bg-brand text-white px-4 py-2 rounded-xl"
            onClick={() => navigate('/reservation')}
          >
            예약 페이지로 이동
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center min-h-screen w-full mt-[67px]">
      <div className="w-full max-w-md p-8">
        <ContentTopLogo 
          title="예약이 성공적으로 취소되었습니다."
          titleStyle="text-xl font-bold mb-4"
        />
        <p className="text-gray-700 mb-2">
          다시 예약하시려면 아래 버튼을 눌러주세요.
        </p>
        <div className="bg-gray-100 p-4 rounded-xl mb-4">
          <p><strong>이메일:</strong> {reservation.email}</p>
          <p><strong>예약번호:</strong> {reservation.reservationNumber}</p>
          <p><strong>차량:</strong> {reservation.carName}</p>
          <p><strong>날짜:</strong> {reservation.reservationDate}</p>
        </div>
        <div className="flex justify-center">
          <button
            className="bg-brand text-white px-4 py-2 rounded-xl"
            onClick={() => navigate('/reservation')}
          >
            다시 예약하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuestCancelComplete;
