import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ContentTopLogo from '../../../components/common/ContentTopLogo';

const GuestCancelComplete = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [reservation, setReservation] = useState(() => {
        const saved = localStorage.getItem("guestReservation");
        return saved ? JSON.parse(saved) : location.state || null;
    });

    useEffect(() => {
        if (location.state) {
            localStorage.setItem("guestReservation", JSON.stringify(location.state));
        }
    }, [location.state]);

    if (!reservation) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-[640px] max-h-[90vh] overflow-hidden">
                    <ContentTopLogo
                        title="예약 정보가 없습니다."
                        titleStyle="text-center mb-6 text-xl font-bold"
                    />
                    <div className="bg-white rounded-xl shadow-sm p-6 text-center max-w-md mx-auto h-full flex flex-col justify-center">
                        <p className="text-gray-700 mb-6">
                            잘못된 접근이거나 예약 정보가 사라졌습니다. 다시 예약을 진행해주세요.
                        </p>
                        <button
                            className="bg-brand text-white py-3 px-8 rounded-xl font-bold hover:bg-blue-600 transition mx-auto"
                            onClick={() => navigate('/reservation')}
                        >
                            예약 페이지로 이동
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const formatDateTime = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center pt-1  p-4">
            <div className="w-full max-w-[640px] max-h-[90vh] overflow-hidden">
                <ContentTopLogo
                    title="예약 취소 완료"
                    titleStyle="text-center mb-6 text-xl font-bold"
                />

                <div className="p-6 space-y-6 h-full flex flex-col max-w-md mx-auto">
                    {/* 취소 완료 메시지 (아이콘 제거) */}
                    <div className="text-center flex-1 flex flex-col justify-center">
                        <p className="text-2xl font-bold text-gray mb-2">예약이 취소되었습니다</p>
                    </div>

                    {/* 취소된 예약 정보 */}
                    <div className="bg-gray-50 rounded-xl p-6">
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">예약번호</span>
                                <span className="font-semibold">{reservation.reservationNo}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">예약자</span>
                                <span className="font-semibold">{reservation.driverEmail}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">대여기간</span>
                                <span className="font-semibold">
                                    {formatDateTime(reservation.startDate)} ~ {formatDateTime(reservation.endDate)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 버튼 영역 - 하단 고정 */}
                    <div className="mt-auto pt-6 flex flex-col gap-3">
                        <button
                            onClick={() => navigate('/day')}
                            className="w-full bg-brand hover:bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                        >
                            다시 예약하기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuestCancelComplete;
