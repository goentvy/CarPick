// src/pages/mypage/ReviewHistory.jsx
import { useNavigate } from "react-router-dom";

function ReviewHistory() {
    const navigate = useNavigate();

    return (
        <div
            id="content"
            className="font-pretendard"
            style={{
                minHeight: "calc(100vh - 80px - 72px)",
                backgroundColor: "#E7EEFF",
            }}
        >


            {/* 빈 상태 카드 */}
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

export default ReviewHistory;
