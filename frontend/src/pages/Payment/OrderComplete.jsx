import { useLocation, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useReservationStore from "../../store/useReservationStore";

const OrderComplete = () => {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const reservation = useReservationStore();
    import useUserStore from "../../store/useUserStore";

    // location.state 우선 → URL 파라미터 폴백
    const { orderId, totalPrice } = location.state || {};

    // URL에서 픽업 정보 추출 (하드코딩 제거)
    const pickupBranchName = searchParams.get('pickupBranchName') ||
        reservation.pickupBranchName || '김포공항';
    const startDate = searchParams.get('startDate') ||
        reservation.startDate || '날짜 없음';
    const endDate = searchParams.get('endDate') ||
        reservation.endDate || '날짜 없음';

    const [copyHover, setCopyHover] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async () => {
        if (orderId) {
            try {
                await navigator.clipboard.writeText(orderId);
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            } catch (err) {
                console.error("복사 실패:", err);
            }
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white overflow-hidden">
            <div className="h-[67px] bg-transparent" />
            <main className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-lg mx-auto w-full space-y-8">
                    <div className="text-center">
                        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
                            예약 완료
                        </h1>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            차량 대여가 성공적으로 예약되었습니다.
                        </p>
                        <div className="text-sm text-gray-500 space-y-1 text-center">
                            <p>마이페이지에서 예약 내역을 확인하세요.</p>
                            <p>비회원의 경우 예약번호로 조회할 수 있습니다.</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 space-y-6">
                        <h2 className="text-base font-semibold text-gray-900 text-center">예약 정보</h2>

                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-xs font-medium text-gray-700">예약번호</span>
                            <div className="flex items-center space-x-2">
                                <span className="font-bold text-base text-gray-900 min-w-[100px] text-right">
                                    {orderId || 'RES-'}
                                </span>
                                <button
                                    onClick={handleCopy}
                                    onMouseEnter={() => setCopyHover(true)}
                                    onMouseLeave={() => setCopyHover(false)}
                                    className="p-1.5 text-gray-500 hover:text-brand hover:bg-brand/10 rounded transition-all duration-200 relative"
                                    aria-label="예약번호 복사"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    {copyHover && (
                                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-0.5 rounded shadow-lg whitespace-nowrap">
                                            복사하기
                                        </span>
                                    )}
                                    {isCopied && (
                                        <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-green-600 text-white text-xs px-2 py-0.5 rounded shadow-lg whitespace-nowrap">
                                            복사됨
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">픽업</span>
                                <span className="font-medium text-gray-900">{pickupBranchName}</span>
                            </div>
                            <div className="flex justify-between pt-1">
                                <span className="text-gray-500">대여기간</span>
                                <span className="font-semibold text-gray-900">{startDate} ~ {endDate}</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex justify-between items-baseline">
                            <span className="text-xs font-medium text-gray-700">총 결제금액</span>
                            <span className="text-2xl font-bold text-green-600">
                                {totalPrice?.toLocaleString()}원
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
                        {/* 로그인 여부에 따라 다른 링크 */}
                        {isLoggedIn ? (
                            <button
                                onClick={() => window.location.href = "/mypage/reservations"}
                                className="flex-1 px-6 py-3 bg-brand hover:bg-brand/90 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm"
                            >
                                마이페이지
                            </button>
                        ) : (
                            <button
                                onClick={() => window.location.href = "/guest/view"}
                                className="flex-1 px-6 py-3 bg-brand hover:bg-brand/90 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm"
                            >
                                예약조회
                            </button>
                        )}
                        <button
                            onClick={() => window.location.href = "/"}
                            className="flex-1 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm border"
                        >
                            홈으로
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default OrderComplete;
