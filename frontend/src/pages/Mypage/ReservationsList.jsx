// src/pages/Mypage/ReservationsList.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../store/useUserStore";
import api from "../../services/api";

const STATUS_MAP = {
    PENDING: { label: "결제 대기", color: "text-yellow-600" },
    CONFIRMED: { label: "예약 확정", color: "text-blue-600" },
    ACTIVE: { label: "이용 중", color: "text-green-600" },
    COMPLETED: { label: "이용 완료", color: "text-gray-500" },
    CANCELED: { label: "예약 취소", color: "text-red-500" },
    CHANGED: { label: "예약 변경", color: "text-purple-600" },
};

const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    const weekday = weekdays[date.getDay()];
    return `${year}. ${month}. ${day} (${weekday})`;
};

const formatPrice = (price) => {
    if (!price) return "0";
    return Number(price).toLocaleString();
};

function ReservationsList() {
    const navigate = useNavigate();
    const accessToken = useUserStore((state) => state.accessToken);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingReview, setEditingReview] = useState(null);
    const [editContent, setEditContent] = useState("");
    const [editingRating, setEditingRating] = useState(0);
    const [reviewedReservations, setReviewedReservations] = useState(new Set());

    // 공통 모달 상태
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [modalData, setModalData] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const res = await api.get("/mypage/reservations-list");
                setReservations(res.data);
                try {
                    const reviewRes = await api.get("/reviews/me");
                    const reviewedIds = new Set(reviewRes.data.map(r => r.reservationId));
                    setReviewedReservations(reviewedIds);
                } catch (reviewErr) {
                    console.error("리뷰 조회 실패:", reviewErr);
                }
            } catch (err) {
                console.error("예약 목록 조회 실패:", err);
                setError("예약 목록을 불러오는데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };
        fetchReservations();
    }, []);

    const openModal = (type, reservation) => {
        setModalType(type);
        setModalData(reservation);
        setShowModal(true);
    };

    const handleModalConfirm = async () => {
        setIsProcessing(true);

        try {
            if (modalType === 'cancel') {
                await api.post(`/reservation/${modalData.reservationId}/cancel`, {
                    action_type: 'CANCEL',
                    old_start_date: modalData.startDate,
                    old_end_date: modalData.endDate,
                    old_car_name: `${modalData.brand} ${modalData.displayNameShort}`,
                    reason: '사용자 취소 요청'
                });

                // 상태 즉시 업데이트
                setReservations(prev =>
                    prev.map(r => r.reservationId === modalData.reservationId
                        ? { ...r, reservationStatus: 'CANCELED' }
                        : r
                    )
                );

                // 성공 모달로 전환
                setModalType('success');
                setModalData({
                    ...modalData,
                    message: '예약이 취소되었습니다.',
                    carInfo: `${modalData.brand} ${modalData.displayNameShort}`
                });
            } else if (modalType === 'change') {
                navigate(`/Mypage/ReservationsList/${modalData.reservationId}/change`);
            }
        } catch (err) {
            console.error(`${modalType} 실패:`, err);
            setModalType('error');
            setModalData({
                message: '취소에 실패했습니다.',
                carInfo: `${modalData.brand} ${modalData.displayNameShort}`
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const closeModal = () => {
        if (modalType === 'success' || modalType === 'error') {
            // 성공/에러 모달은 2초 후 자동 닫기
            setTimeout(() => {
                setShowModal(false);
                setModalType(null);
                setModalData(null);
            }, 2000);
        } else {
            setShowModal(false);
            setModalType(null);
            setModalData(null);
        }
    };

    const handleReviewClick = (e, reservation) => {
        e.stopPropagation();
        setEditingReview(reservation);
        setEditContent("");
        setEditingRating(0);
    };

    const handleSave = async () => {
        try {
            const userId = useUserStore.getState().user?.id;
            const response = await fetch('http://localhost:8080/api/reviews', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'X-User-Id': userId?.toString() || ''
                },
                body: JSON.stringify({
                    reservationId: Number(editingReview.reservationId),
                    carName: `${editingReview.brand} ${editingReview.displayNameShort}`,
                    rating: editingRating,
                    content: editContent.trim()
                })
            });

            if (response.ok) {
                setReviewedReservations(prev => new Set([...prev, editingReview.reservationId]));
                handleCloseReview();
                // 리뷰 성공 모달
                setModalType('success');
                setModalData({ message: '리뷰가 작성되었습니다!' });
                setShowModal(true);
            }
        } catch (error) {
            console.error('리뷰 작성 실패:', error);
            setModalType('error');
            setModalData({ message: '리뷰 작성에 실패했습니다.' });
            setShowModal(true);
        }
    };

    const handleCloseReview = () => {
        setEditingReview(null);
        setEditContent("");
        setEditingRating(0);
    };

    const handleStarClick = (starIndex, position) => {
        const starValue = starIndex + 1;
        const newRating = position === 0 ? starValue - 0.5 : starValue;
        setEditingRating(Math.max(0.5, Math.min(newRating, 5)));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[300px]">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-2 text-gray-600">예약 내역을 불러오는 중...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-[300px]">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <>
            <div className="max-w-[640px] mx-auto p-4">
                <h2 className="text-xl font-bold mb-4">예약 내역</h2>

                {reservations.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                        예약 내역이 없습니다.
                    </div>
                ) : (
                    <div className="space-y-6">
                        {reservations.map((item) => {
                            const status = STATUS_MAP[item.reservationStatus] || {
                                label: item.reservationStatus,
                                color: "text-gray-600",
                            };

                            const isCancelable = ["PENDING", "CONFIRMED"].includes(item.reservationStatus);
                            const isChangeable = ["PENDING", "CONFIRMED"].includes(item.reservationStatus);
                            const isReviewable = item.reservationStatus === "COMPLETED";
                            const isReviewed = reviewedReservations.has(item.reservationId);

                            return (
                                <div key={item.reservationId} className="bg-white rounded-lg shadow-sm">
                                    <div className="flex justify-between items-center px-4 py-3 border-b">
                                        <span className="font-bold text-[15px]">
                                            {formatDate(item.startDate)} 예약
                                        </span>
                                        <button
                                            onClick={() => navigate(`/Mypage/Reservations/${item.reservationId}`)}
                                            className="text-sm text-[#1D6BF3] hover:underline"
                                        >
                                            예약 상세보기 &gt;
                                        </button>
                                    </div>

                                    <div className="p-4 flex">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`font-bold ${status.color}`}>
                                                    {status.label}
                                                </span>
                                                <span className="text-gray-400">·</span>
                                                <span className="text-sm text-gray-600">
                                                    {formatDate(item.endDate)} 반납 예정
                                                </span>
                                            </div>

                                            <p className="text-[14px] text-gray-800 mb-1">
                                                {item.brand} {item.displayNameShort}
                                            </p>

                                            <p className="text-[14px] text-gray-800">
                                                <span className="font-bold">{formatPrice(item.totalAmountSnapshot)}</span>
                                                <span className="text-gray-500"> 원</span>
                                            </p>
                                        </div>

                                        <div className="flex flex-col gap-2 ml-4">
                                            <button
                                                onClick={() => navigate(`/Mypage/ReservationsList/${item.reservationId}`)}
                                                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                            >
                                                상세보기
                                            </button>

                                            {isCancelable && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openModal('cancel', item);
                                                    }}
                                                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                                >
                                                    취소하기
                                                </button>
                                            )}

                                            {isChangeable && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openModal('change', item);
                                                    }}
                                                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                                >
                                                    변경하기
                                                </button>
                                            )}

                                            {isReviewable && (
                                                <button
                                                    onClick={(e) => handleReviewClick(e, item)}
                                                    disabled={isReviewed}
                                                    className={`px-4 py-2 text-sm rounded-lg transition font-medium shadow-sm ${
                                                        isReviewed
                                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                            : 'bg-[#2C7FFF] text-white hover:bg-[#1E5BBF]'
                                                    }`}
                                                >
                                                    {isReviewed ? '리뷰작성됨' : '리뷰작성'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* 리뷰 작성 모달 */}
            {editingReview && (
                <div className="fixed inset-0 bg-black/10 backdrop-blur-[2px] flex items-center justify-center z-[1000] p-4 animate-in fade-in zoom-in duration-200"
                     style={{ backdropFilter: 'blur(4px)' }}>
                    <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border border-white/50">
                        <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">리뷰 작성</h3>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-[#1A1A1A] mb-4">별점</label>
                            <div className="flex gap-4 justify-center mb-4">
                                {[...Array(5)].map((_, starIndex) => {
                                    const starValue = starIndex + 1;
                                    let starSrc = "/images/common/star-empty.svg";
                                    if (editingRating >= starValue) {
                                        starSrc = "/images/common/star-full.svg";
                                    } else if (editingRating % 1 >= 0.5 && editingRating >= starValue - 0.5) {
                                        starSrc = "/images/common/star-half.svg";
                                    }

                                    return (
                                        <div key={starIndex} className="relative w-[56px] h-[56px]">
                                            <button type="button" onClick={() => handleStarClick(starIndex, 0)}
                                                    className="absolute left-0 top-0 w-1/2 h-full z-20 hover:scale-[1.08]" />
                                            <button type="button" onClick={() => handleStarClick(starIndex, 1)}
                                                    className="absolute right-0 top-0 w-1/2 h-full z-20 hover:scale-[1.08]" />
                                            <img src={starSrc} alt="" width={56} height={56}
                                                 className="w-full h-full object-contain hover:scale-[1.08] transition-all cursor-pointer" />
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="text-center">
                                <span className="text-lg font-semibold text-[#2C7FFF]">
                                    {editingRating.toFixed(1)}점
                                </span>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">리뷰 내용</label>
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full p-3 border border-gray-200 rounded-xl resize-vertical focus:outline-none focus:ring-2 focus:ring-[#2C7FFF] focus:border-transparent text-sm"
                                rows={4}
                                placeholder="리뷰 내용을 작성해주세요."
                            />
                        </div>

                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={handleCloseReview}
                                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 font-medium"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!editContent.trim() || editingRating === 0}
                                className="px-6 py-2 bg-[#2C7FFF] text-white text-sm font-medium rounded-xl shadow-sm hover:bg-[#1E5BBF] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                리뷰 작성
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 공통 모달 (확인/성공/에러) */}
            {showModal && modalData && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[2000] p-4 animate-in fade-in zoom-in duration-200">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-gray-200 text-center">
                        {modalType === 'success' && (
                            <>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{modalData.message}</h3>
                                {modalData.carInfo && (
                                    <p className="text-sm text-gray-600">{modalData.carInfo}</p>
                                )}
                            </>
                        )}

                        {modalType === 'error' && (
                            <>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{modalData.message}</h3>
                                {modalData.carInfo && (
                                    <p className="text-sm text-gray-600">{modalData.carInfo}</p>
                                )}
                            </>
                        )}

                        {['cancel', 'change'].includes(modalType) && (
                            <>
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {modalType === 'cancel' ? '예약을 취소하시겠습니까?' : '예약을 변경하시겠습니까?'}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        <span className="font-medium">{modalData.brand} {modalData.displayNameShort}</span>
                                        <br />
                                        {formatDate(modalData.startDate)} ~ {formatDate(modalData.endDate)}
                                    </p>
                                </div>

                                <div className="flex justify-end space-x-3 pt-2">
                                    <button
                                        onClick={handleModalConfirm}
                                        disabled={isProcessing}
                                        className={`px-6 py-2 text-sm text-white font-medium rounded-xl shadow-sm border-2 transition-all flex-1 flex items-center justify-center ${
                                            modalType === 'cancel'
                                                ? 'bg-red-500 hover:bg-red-600 border-red-500 hover:border-red-600'
                                                : 'bg-[#2C7FFF] hover:bg-[#1E5BBF] border-[#2C7FFF] hover:border-[#1E5BBF]'
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                처리 중...
                                            </>
                                        ) : (
                                            modalType === 'cancel' ? '취소' : '변경하기'
                                        )}
                                    </button>
                                    <button
                                        onClick={closeModal}
                                        disabled={isProcessing}
                                        className="px-6 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium hover:bg-gray-50 border-2 border-gray-300 hover:border-gray-400 rounded-xl transition-all flex-1"
                                    >
                                        아니요
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default ReservationsList;
