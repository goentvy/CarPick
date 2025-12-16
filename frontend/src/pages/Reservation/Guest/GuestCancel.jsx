import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import ContentTopLogo from '../../../components/common/ContentTopLogo';

const GuestCancel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const reservation = location.state;
  const [reason, setReason] = useState('');

  const handleCancel = async () => {
    try {
      const res = await axios.post('/api/guest/reservation/cancel', {
        reservationNumber: reservation.reservationNumber,
        reason
      });
      navigate('/guest/cancel/complete', { state: res.data });
    } catch (err) {
      alert('예약 취소 중 오류가 발생했습니다.');
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center min-h-screen w-full mt-[67px]">
      <div className="w-full max-w-md p-8">
        <ContentTopLogo 
          title="비회원 예약취소"
          titleStyle="text-center mb-4 text-xl font-bold"
        />
        <div className="mb-2">
          <label>이메일</label>
          <input
            type="text"
            value={reservation.email}
            readOnly
            className="w-full px-4 py-2 border rounded-xl mb-4"
          />
        </div>
        <div className="mb-2">
          <label>예약번호</label>
          <input
            type="text"
            value={reservation.reservationNumber}
            readOnly
            className="w-full px-4 py-2 border rounded-xl mb-4"
          />
        </div>
        <p className="text-gray-700 mb-2">
          예약을 취소하면 복구할 수 없습니다. 다시 예약하려면 신규 예약을 진행해주세요.
        </p>
        <select 
          className="w-full px-4 py-2 border rounded-xl mb-4"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        >
          <option value="">취소 사유 선택</option>
          <option>일정이 변경되었어요</option>
          <option>차량 종류를 변경하고 싶어요</option>
          <option>예약을 다시 잡고 싶어요</option>
          <option>다른 업체에서 예약했어요</option>
          <option>단순 변심이에요</option>
        </select>
        <div className="flex justify-center">
          <button 
            onClick={handleCancel}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
          >
            예약 취소하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuestCancel;
