// src/pages/guest/GuestCancel.jsx
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
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

        if (!reservation?.driverEmail || !reservation?.reservationNo) {
            alert('예약 정보가 없습니다. 예약 조회부터 다시 진행해주세요.');
            navigate('/guest');
            return;
        }

        setLoading(true);
        try {
            const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
            const fullUrl = `${API_BASE}/api/guest/reservation/cancel`;

            console.log(' 취소 요청 URL:', fullUrl);
            console.log(' 취소 요청 데이터:', {
                email: reservation.driverEmail,
                reservationNumber: reservation.reservationNo,
                reason: reason
            });

            // 백엔드 취소 API 호출
            const response = await axios.post(fullUrl, {
                email: reservation.driverEmail,
                reservationNumber: reservation.reservationNo,
                reason: reason
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 10000,
                withCredentials: true  //  CORS/세션 문제 해결
            });

            console.log('취소 성공:', response.data);
            alert('예약이 취소되었습니다!');
            navigate('/guest/cancel/complete', {
                state: {
                    ...reservation,
                    status: 'CANCELED',
                    cancelReason: reason
                }
            });
        } catch (error) {
            console.error('❌ 취소 실패 상세:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
                url: error.config?.url
            });

            const errorMsg = error.response?.data?.message ||
                error.response?.statusText ||
                error.message ||
                '예약 취소에 실패했습니다.';

            alert(`취소 실패: ${errorMsg}\n\nNetwork 탭에서 OPTIONS/POST 요청 확인하세요!`);
        } finally {
            setLoading(false);
        }
    };

    if (!reservation) {
        return (
            <div className="flex justify-center min-h-screen items-center">
                <div className="text-center p-8">
                    <ContentTopLogo title="비회원 예약취소" />
                    <p className="text-gray-500 mt-4">예약 정보가 없습니다. 예약 조회부터 진행해주세요.</p>
                    <button
                        onClick={() => navigate('/guest')}
                        className="mt-4 bg-brand hover:bg-brand-dark text-white py-3 px-8 rounded-xl font-medium"
                    >
                        예약 조회하기
                    </button>
                </div>
            </div>
        );
    }

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
                        <span className="break-all">{reservation.driverEmail}</span>
                    </div>
                </div>

                {/* 취소 사유 선택 */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        취소 사유 선택 <span className="text-red-500">*</span>
                    </label>
                    <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand disabled:bg-gray-100"
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
                        예약을 취소하면 복구할 수 없습니다.<br />
                        다시 예약하려면 신규 예약을 진행해주세요.
                    </p>
                </div>

                {/* 버튼 */}
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-xl font-medium transition-colors disabled:opacity-50"
                        disabled={loading}
                    >
                        돌아가기
                    </button>
                    <button
                        onClick={handleCancel}
                        disabled={!reason || loading}
                        className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-xl font-bold transition-colors"
                    >
                        {loading ? '취소 중...' : '예약 취소하기'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GuestCancel;
