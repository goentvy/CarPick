// src/pages/guest/GuestCancel.jsx
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import ContentTopLogo from '../../../components/common/ContentTopLogo';

const GuestCancel = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const reservation = location.state;  // GuestReservationDto 데이터
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCancel = async () => {
        if (!reason) {
            alert('취소 사유를 선택해주세요.');
            return;
        }

        setLoading(true);
        try {
            // 백엔드 취소 API 호출 (email, reservationNumber, reason)
            const response = await axios.post('/api/guest/reservation/cancel', {
                email: reservation.driverEmail,        // DTO 필드
                reservationNumber: reservation.reservationNo,  // DTO 필드
                reason: reason
            });

            console.log('취소 성공:', response.data);
            navigate('/guest/cancel/complete', { state: { ...reservation, status: 'CANCELED' } });
        } catch (error) {
            console.error('취소 실패:', error.response?.data || error.message);
            alert('예약 취소에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center min-h-screen w-full mt-[67px]">
            <div className="w-full max-w-md p-8">
                <ContentTopLogo
                    title="비회원 예약취소"
                    titleStyle="text-center mb-6 text-xl font-bold"
                />

                {/* 읽기 전용 예약 정보 */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6 space-y-3">
                    <div className="flex justify-between">
                        <span className="text-sm text-gray-600">예약번호</span>
                        <span className="font-semibold">{reservation.reservationNo}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-gray-600">예약자 이메일</span>
                        <span>{reservation.driverEmail}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-gray-600">대여차종</span>
                        <span>{reservation.carName || 'Carnival'}</span>
                    </div>
                </div>

                {/* 취소 사유 선택 */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        취소 사유 선택 <span className="text-red-500">*</span>
                    </label>
                    <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        disabled={loading}
                    >
                        <option value="">취소 사유를 선택해주세요</option>
                        <option value="일정이 변경되었어요">일정이 변경되었어요</option>
                        <option value="차량 종류를 변경하고 싶어요">차량 종류를 변경하고 싶어요</option>
                        <option value="예약을 다시 잡고 싶어요">예약을 다시 잡고 싶어요</option>
                        <option value="다른 업체에서 예약했어요">다른 업체에서 예약했어요</option>
                        <option value="단순 변심이에요">단순 변심이에요</option>
                    </select>
                </div>

                {/* 경고 메시지 */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                    <p className="text-sm text-yellow-800">
                        예약을 취소하면 복구할 수 없습니다.<br/> 다시 예약하려면 신규 예약을 진행해주세요.
                    </p>
                </div>

                {/* 버튼 */}
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-xl font-medium transition-colors"
                        disabled={loading}
                    >
                        취소
                    </button>
                    <button
                        onClick={handleCancel}
                        disabled={!reason || loading}
                        className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white py-3 px-4 rounded-xl font-bold transition-colors"
                    >
                        {loading ? '취소 중...' : '예약 취소하기'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GuestCancel;
