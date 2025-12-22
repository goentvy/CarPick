// src/pages/mypage/ReviewHistory.jsx
import { useNavigate, } from "react-router-dom";
import { useState, useEffect } from "react";
import useUserStore from "../../store/useUserStore";
import StarRating from "../Home/StarRating";

function ReviewHistory() {
    const navigate = useNavigate();
    const accessToken = useUserStore((state) => state.accessToken);  // ← Zustand 토큰!

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingReview, setEditingReview] = useState(null);
    const [editContent, setEditContent] = useState("");
    const [editingRating, setEditingRating] = useState(0);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                console.log('🔥 1. ZUSTAND TOKEN:', accessToken);
                console.log('🔥 2. TOKEN LENGTH:', accessToken ? accessToken.length : 0);

                if (!accessToken) {
                    console.log('🔥 ❌ Zustand 토큰 없음 → 로그인 필요!');
                    setLoading(false);
                    return;
                }

                const response = await fetch('http://localhost:8080/api/reviews/me', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,  // ← Zustand 토큰!
                        'Content-Type': 'application/json',
                    },
                });

                console.log('🔥 3. Status:', response.status);
                console.log('🔥 4. Response URL:', response.url);

                if (response.ok) {
                    const data = await response.json();
                    console.log('🔥 5. 리뷰 데이터:', data);
                    setReviews(data);
                } else {
                    const errorText = await response.text();
                    console.log('🔥 6. 에러 응답:', errorText);
                }
            } catch (error) {
                console.error('🔥 7. 네트워크 에러:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, [accessToken]);  // ← accessToken 변경 감지!

    const handleEdit = (review) => {
        setEditingReview(review);
        setEditContent(review.content);
        setEditingRating(review.rating);
    };

    const handleSave = async () => {
        try {
            const token = useUserStore((state) => state.accessToken);  // ← Zustand!
            const response = await fetch(`http://localhost:8080/api/reviews/${editingReview.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    rating: editingRating,
                    content: editContent,
                }),
            });
            if (response.ok) {
                const updatedReview = await response.json();
                setReviews(reviews.map(r => r.id === updatedReview.id ? updatedReview : r));
                handleCancel();
            }
        } catch (error) {
            console.error('리뷰 수정 실패:', error);
        }
    };

    const handleCancel = () => {
        setEditingReview(null);
        setEditContent("");
        setEditingRating(0);
    };

    const handleStarClick = (starIndex, position) => {
        const starValue = starIndex + 1;
        const newRating = position === 0 ? starValue - 0.5 : starValue;
        setEditingRating(Math.max(0.5, Math.min(newRating, 5)));
    };

    const FOOTER_HEIGHT = 72;

    // 로딩중
    if (loading) {
        return (
            <div
                id="content"
                className="font-pretendard"
                style={{
                    minHeight: "100vh",
                    paddingBottom: `${FOOTER_HEIGHT}px`,
                    backgroundColor: "#E7EEFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2C7FFF] mx-auto mb-4"></div>
                    <p className="text-sm text-[#666666]">리뷰 불러오는 중...</p>
                </div>
            </div>
        );
    }

    // 리뷰 없음
    if (reviews.length === 0) {
        return (
            <div
                id="content"
                className="font-pretendard"
                style={{
                    minHeight: "100vh",
                    paddingBottom: `${FOOTER_HEIGHT}px`,
                    backgroundColor: "#E7EEFF",
                    boxSizing: "border-box",
                }}
            >
                <div className="px-4 py-6">
                    <div className="bg-white rounded-2xl shadow-sm px-5 py-10 flex flex-col items-center justify-center text-center">
                        <h2 className="text-base font-semibold text-[#1A1A1A] mb-2">
                            작성한 리뷰가 없습니다
                        </h2>
                        <p className="text-sm text-[#666666] mb-6">
                            이용하신 렌트에 대한 솔직한 리뷰를 남겨주세요.
                            <br />
                            리뷰를 작성하면 다른 이용자에게 큰 도움이 됩니다.
                        </p>
                        <button
                            type="button"
                            onClick={() => navigate("/mypage/reservations")}
                            className="h-11 px-6 rounded-xl bg-[#2C7FFF] text-white text-sm font-medium shadow-sm"
                        >
                            리뷰 작성 가능한 예약 보기
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div
                id="content"
                className="font-pretendard"
                style={{
                    minHeight: "100vh",
                    paddingBottom: `${FOOTER_HEIGHT}px`,
                    backgroundColor: "#E7EEFF",
                    boxSizing: "border-box",
                }}
            >
                <div className="px-4 py-6">
                    <h1 className="text-xl font-bold text-[#1A1A1A] mb-4 pl-2">
                        내가 쓴 리뷰 ({reviews.length}개)
                    </h1>

                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className="bg-white rounded-2xl shadow-sm px-4 py-4"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <div className="text-sm font-semibold text-[#1A1A1A]">
                                            {review.carName}
                                        </div>
                                        <div className="text-xs text-[#888888] mt-1">
                                            {review.period}
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <StarRating rating={Number(review.rating)} />
                                        <span className="ml-2 text-sm font-medium text-[#1A1A1A]">
                                            {Number(review.rating).toFixed(1)}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-sm text-[#666666] mb-6 leading-relaxed">
                                    {review.content}
                                </p>

                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => handleEdit(review)}
                                        className="text-xs bg-gray-100 text-[#666666] px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                                    >
                                        수정
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => navigate(`/cars/${review.reservationId}`)}
                                        className="text-xs bg-[#2C7FFF] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#1E5BBF] transition-colors shadow-sm"
                                    >
                                        차량 보기
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 리뷰 수정 모달 */}
            {editingReview && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">
                            리뷰 수정
                        </h3>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-[#1A1A1A] mb-4">
                                별점
                            </label>

                            <div className="flex gap-4 justify-center mb-4">
                                {[...Array(5)].map((_, starIndex) => {
                                    const starValue = starIndex + 1;
                                    const fullStars = Math.floor(editingRating);
                                    const hasHalf = editingRating % 1 >= 0.5;

                                    let starSrc = "/images/common/star-empty.svg";
                                    if (editingRating >= starValue) {
                                        starSrc = "/images/common/star-full.svg";
                                    } else if (hasHalf && editingRating >= starValue - 0.5) {
                                        starSrc = "/images/common/star-half.svg";
                                    }

                                    return (
                                        <div key={starIndex} className="relative w-[56px] h-[56px]">
                                            <button
                                                type="button"
                                                onClick={() => handleStarClick(starIndex, 0)}
                                                className="absolute left-0 top-0 w-1/2 h-full z-20 hover:scale-[1.08]"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleStarClick(starIndex, 1)}
                                                className="absolute right-0 top-0 w-1/2 h-full z-20 hover:scale-[1.08]"
                                            />
                                            <img
                                                src={starSrc}
                                                alt=""
                                                width={56}
                                                height={56}
                                                className="w-full h-full object-contain hover:scale-[1.08] transition-all cursor-pointer"
                                            />
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
                            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                                리뷰 내용
                            </label>
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full p-3 border border-gray-200 rounded-xl resize-vertical focus:outline-none focus:ring-2 focus:ring-[#2C7FFF] focus:border-transparent text-sm"
                                rows={4}
                                placeholder="리뷰 내용을 수정해주세요."
                            />
                        </div>

                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 font-medium"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!editContent.trim()}
                                className="px-6 py-2 bg-[#2C7FFF] text-white text-sm font-medium rounded-xl shadow-sm hover:bg-[#1E5BBF] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                수정 완료
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ReviewHistory;
