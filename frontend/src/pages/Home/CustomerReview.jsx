import { useState, useEffect } from "react";
import StarRating from "./StarRating";

const CustomerReview = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                // ✅ 백엔드 직접 호출 (프록시 우회)
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/reviews/latest`);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                const data = await response.json();
                setReviews(Array.isArray(data) ? data.slice(0, 3) : data); // ✅ Array 체크
            } catch (error) {
                console.error("리뷰 불러오기 실패:", error);
                setReviews([]); // 빈 배열 fallback
            } finally {
                setLoading(false);
            }
        };


        fetchReviews();
    }, []);

    if (loading) {
        return (
            <section className="mb-8">
                <div className="grid gap-4 text-sm">
                    <div className="bg-blue-50 rounded-lg shadow-sm p-3 animate-pulse h-24" />
                    <div className="bg-blue-50 rounded-lg shadow-sm p-3 animate-pulse h-24" />
                    <div className="bg-blue-50 rounded-lg shadow-sm p-3 animate-pulse h-24" />
                </div>
            </section>
        );
    }

    return (
        <section className="mb-8">
            <div className="grid gap-4 text-sm">
                {reviews.map((r) => (
                    <div key={r.id} className="bg-blue-50 rounded-lg shadow-sm p-3">
                        <p className="font-semibold mb-1">{r.carName}</p>  {/* model → carName */}
                        <StarRating rating={r.rating} />
                        <p className="text-gray-600 text-sm my-3">{r.content}</p>  {/* comment → content */}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CustomerReview;
