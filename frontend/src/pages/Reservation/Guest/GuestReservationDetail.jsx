// src/pages/guest/GuestReservationDetail.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import ContentTopLogo from '../../../components/common/ContentTopLogo';

const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
};

const formatPrice = (price) => {
    if (!price) return "0";
    return Number(price).toLocaleString();
};

const GuestReservationDetail = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    if (!state) {
        navigate('/guest');
        return null;
    }

    const isCanceled = state.status === 'CANCELED';
    const statusText = isCanceled
        ? '예약 취소됨'
        : state.status === 'CONFIRMED'
            ? '예약 확정'
            : state.status;

    const statusBg = isCanceled
        ? 'bg-gray-100 text-gray-600 border-gray-300'
        : 'bg-blue-100 text-blue-700';

    const cancelButtonStyle = isCanceled
        ? 'bg-gray-300 cursor-not-allowed text-gray-500'
        : 'bg-red-500 hover:bg-red-600 text-white';

    const cancelButtonText = isCanceled ? '이미 취소된 예약입니다' : '예약취소';

    // ✅ 취소 시 예상 환불 금액 계산 (전액 환불 가정)
    const totalAmount = state.totalAmount || 0;
    const refundAmount = isCanceled ? totalAmount : null;
    const priceTitle = isCanceled ? '예상 환불 금액' : '총 결제금액';
    const priceBg = isCanceled ? 'bg-red-50 border-red-200' : 'bg-brand/5 border-brand/20';
    const priceTextColor = isCanceled ? 'text-red-600' : 'text-brand';

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-[640px] max-h-[90vh] overflow-hidden">
                <ContentTopLogo
                    title="예약 상세 정보"
                    titleStyle="text-center mb-6 text-xl font-bold"
                />

                <div className="bg-white rounded-xl shadow-sm p-6 space-y-6 h-full flex flex-col">
                    {/* 예약번호 + 상태 */}
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[13px] text-gray-500 mb-1">예약번호</p>
                            <p className="font-semibold text-lg">{state.reservationNumber}</p>
                        </div>
                        <span className={`px-3 py-1 ${statusBg} text-sm font-bold rounded-full border`}>
                            {statusText}
                        </span>
                    </div>

                    {/* 예약자 정보 */}
                    <div>
                        <p className="text-[13px] text-gray-500 mb-2">예약자 정보</p>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                            <p className="text-sm"><span className="font-medium">이름:</span> {state.driverName}</p>
                            <p className="text-sm"><span className="font-medium">연락처:</span> {state.driverPhone}</p>
                            <p className="text-sm"><span className="font-medium">이메일:</span> {state.driverEmail}</p>
                        </div>
                    </div>

                    {/* 대여 기간 */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-[12px] text-gray-500 mb-1">대여 시작</p>
                            <p className="text-sm font-medium">{formatDateTime(state.startDate)}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-[12px] text-gray-500 mb-1">반납 예정</p>
                            <p className="text-sm font-medium">{formatDateTime(state.endDate)}</p>
                        </div>
                    </div>

                    {/* ✅ 총 결제금액 → 예상 환불 금액 전환 */}
                    <div className={`border-2 rounded-xl p-6 text-center ${priceBg}`}>
                        <p className="text-[13px] text-gray-600 mb-2">{priceTitle}</p>
                        <p className={`text-3xl font-bold ${priceTextColor}`}>
                            {formatPrice(refundAmount || totalAmount)}<span className="text-lg">원</span>
                        </p>
                        {isCanceled && (
                            <p className="text-xs text-gray-500 mt-2">취소일 기준 1~3영업일 내 환불 처리</p>
                        )}
                    </div>

                    {/* 버튼 영역 - 하단 고정 */}
                    <div className="mt-auto pt-6 flex flex-col gap-3">
                        <button
                            onClick={isCanceled ? undefined : () => navigate('/guest/cancel', { state })}
                            disabled={isCanceled}
                            className={`w-full py-3 px-4 rounded-xl font-bold text-lg shadow-lg transition-all text-center ${cancelButtonStyle}`}
                        >
                            {cancelButtonText}
                        </button>
                        {!isCanceled && (
                            <button
                                onClick={() => navigate('/guest')}
                                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-xl font-medium transition-colors"
                            >
                                예약 목록으로
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuestReservationDetail;
