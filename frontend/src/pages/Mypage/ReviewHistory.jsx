// src/pages/mypage/ReviewHistory.jsx
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import StarRating from "../Home/StarRating";

function ReviewHistory() {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [editingReview, setEditingReview] = useState(null);
    const [editContent, setEditContent] = useState("");
    const [editingRating, setEditingRating] = useState(0);

    useEffect(() => {
        setReviews([
            {
                id: 1,
                reservationId: 1,
                rating: 5,
                content: "깨끗하고 상태 좋은 차량이었습니다. 만족합니다!",
                createdAt: "2025-12-10",
                carName: "K5 프리미엄",
                period: "2025.12.01 ~ 2025.12.03",
            },
            {
                id: 2,
                reservationId: 2,
                rating: 3.5,
                content: "주행이 부드럽고 연비도 좋았어요.",
                createdAt: "2025-12-05",
                carName: "모닝 스마트",
                period: "2025.12.02 ~ 2025.12.04",
            },
            {
                id: 3,
                reservationId: 3,
                rating: 3,
                content: "일반적인 차량이었으나 에어컨이 약간 약함",
                createdAt: "2025-12-01",
                carName: "소나타",
                period: "2025.11.28 ~ 2025.11.30",
            },
            {
                id: 4,
                reservationId: 4,
                rating: 1.5,
                content: "구렷어요",
                createdAt: "2025-12-01",
                carName: "소나타",
                period: "2025.11.28 ~ 2025.11.30",
            },
        ]);
    }, []);

    const handleEdit = (review) => {
        setEditingReview(review);
        setEditContent(review.content);
        setEditingRating(review.rating);
    };

    const handleSave = () => {
        setReviews(reviews.map(r =>
            r.id === editingReview.id
                ? { ...r, content: editContent, rating: editingRating }
                : r
        ));
        setEditingReview(null);
        setEditContent("");
        setEditingRating(0);
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

    // ✅ footer 높이에 맞춰 한 번에 관리 (예: 72px)
    const FOOTER_HEIGHT = 72;

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
                    paddingBottom: `${FOOTER_HEIGHT}px`, // ✅ footer에 안 가리도록 여유
                    backgroundColor: "#E7EEFF",
                    boxSizing: "border-box",
                }}
            >
                <div className="px-4 py-6">
                    <h1 className="text-xl font-bold text-[#1A1A1A] mb-4 pl-2">
                        내가 쓴 리뷰
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
