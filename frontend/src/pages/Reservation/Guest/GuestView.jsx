import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import ContentTopLogo from '../../../components/common/ContentTopLogo';

const GuestView = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [reservationNumber, setReservationNumber] = useState('');

  const handleSearch = async () => {
    try {
      const res = await axios.get('/api/guest/reservation', {
        params: { email, reservationNumber }
      });
      
      navigate('/guest/cancel', { state: res.data });
    } catch (err) {
      alert('예약을 찾을 수 없습니다.');
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center min-h-screen w-full mt-[67px]">
      <div className="w-full max-w-md p-8">
        <ContentTopLogo 
          title="비회원 예약조회"
          titleStyle="text-center mb-4 text-xl font-bold"
        />
        <div className="mb-2">
          <label htmlFor="email" className="font-semibold">이메일</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력하세요"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl my-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-2">
          <label htmlFor="reservationNumber" className="font-semibold">예약번호</label>
          <input
            type="text"
            id="reservationNumber"
            value={reservationNumber}
            onChange={(e) => setReservationNumber(e.target.value)}
            placeholder="예약번호"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl my-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button 
          onClick={handleSearch}
          className="w-full bg-brand text-white py-2 rounded-xl hover:bg-blue-600 transition"
        >
          예약조회
        </button>
        <div className="flex justify-center items-center">
          <button 
            onClick={() => navigate('/login')}
            className="bg-emerald-400 text-white px-11 py-2 mt-4 rounded-xl hover:bg-emerald-500 transition"
          >
            로그인으로 이동하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuestView;
