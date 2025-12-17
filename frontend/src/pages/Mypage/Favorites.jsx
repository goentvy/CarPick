// src/pages/mypage/Favorites.jsx
import { useNavigate } from "react-router-dom";

function Favorites() {
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
                        선호 차량이 없습니다
                    </h2>
                    <p className="text-sm text-[#666666] mb-6">
                        관심 있거나 자주 이용하는 차량을 선호 차량으로 등록해 보세요.
                        <br />
                        원하는 차량을 빠르게 찾을 수 있습니다.
                    </p>
                    <button
                        type="button"
                        onClick={() => navigate("/cars")} // 차량 목록 라우트에 맞게 수정
                        className="h-11 px-6 rounded-xl bg-[#2C7FFF] text-white text-sm font-medium shadow-sm"
                    >
                        차량 목록 보러가기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Favorites;
