import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import ContentTopLogo from '../../../components/common/ContentTopLogo';

const GuestView = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [reservationNumber, setReservationNumber] = useState('');

    const handleSearch = async () => {
        if (!email.trim() || !reservationNumber.trim()) {
            alert('이메일과 예약번호를 모두 입력하세요.');
            return;
        }

        try {
            const res = await axios.get('http://localhost:8080/api/guest/reservation', {
                params: { email: email.trim(), reservationNumber: reservationNumber.trim() }
            });
            navigate('/guest/reservation-detail', { state: res.data });
        } catch (err) {
            const message = err.response?.data?.message || '예약을 찾을 수 없습니다.';
            alert(message);
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg max-h-[90vh] overflow-hidden">
                <ContentTopLogo
                    title="비회원 예약조회"
                    titleStyle="text-center mb-4 text-xl font-bold"
                />
                <div className="mb-2">
                    <label htmlFor="email" className="font-semibold block mb-1">이메일</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="이메일을 입력하세요"
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="reservationNumber" className="font-semibold block mb-1">예약번호</label>
                    <input
                        type="text"
                        id="reservationNumber"
                        value={reservationNumber}
                        onChange={(e) => setReservationNumber(e.target.value)}
                        placeholder="예약번호 (GUEST-001)"
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    onClick={handleSearch}
                    className="w-full bg-brand text-white py-3 rounded-xl font-bold text-lg hover:bg-blue-600 transition mb-4"
                    disabled={!email.trim() || !reservationNumber.trim()}
                >
                    예약조회
                </button>
            </div>
        </div>
    );
};

export default GuestView;
