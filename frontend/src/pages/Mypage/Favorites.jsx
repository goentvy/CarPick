// src/pages/mypage/Favorites.jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Favorites() {
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([]);

    const handleMockInsert = () => {
        setFavorites([
            {
                id: 1,
                carName: "K5 프리미엄",
                carId: 1,
            },
        ]);
    };

    const handleToggleFavorite = (id) => {
        setFavorites((prev) => prev.filter((f) => f.id !== id));
    };

    return (
        <div
            id="content"
            className="font-pretendard"
            style={{
                minHeight: "calc(100vh - 80px - 72px)",
                backgroundColor: "#E7EEFF",
            }}
        >
            <div className="px-4 py-6">
                {/* 선호차량 없을 때 */}
                {favorites.length === 0 && (
                    <div className="bg-white rounded-2xl shadow-sm px-5 py-10 flex flex-col items-center justify-center text-center">
                        <h2 className="text-base font-semibold text-[#1A1A1A] mb-2">
                            선호 차량이 없습니다
                        </h2>
                        <p className="text-sm text-[#666666] mb-6">
                            관심 있거나 자주 이용하는 차량을 선호 차량으로 등록해 보세요.
                            <br />
                            원하는 차량을 빠르게 찾을 수 있습니다.
                        </p>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => navigate("/cars")}
                                className="h-11 px-6 rounded-xl bg-[#2C7FFF] text-white text-sm font-medium shadow-sm"
                            >
                                차량 목록 보러가기
                            </button>
                            <button
                                type="button"
                                onClick={handleMockInsert}
                                className="h-11 px-4 rounded-xl bg-gray-100 text-xs text-[#333] font-medium shadow-sm"
                            >
                                Mock 넣기
                            </button>
                        </div>
                    </div>
                )}

                {/* 선호차량 있을 때 */}
                {favorites.length > 0 && (
                    <div className="space-y-3">
                        {favorites.map((fav) => (
                            <div
                                key={fav.id}
                                className="bg-white rounded-2xl shadow-sm px-4 py-4 flex items-center gap-3"
                            >
                                {/* 왼쪽: 하트 + 차량 이미지 */}
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleToggleFavorite(fav.id)}
                                        className="flex items-center justify-center"
                                    >
                                        <span className="text-red-500 text-2xl transition-colors hover:text-gray-300">
                                            ♥
                                        </span>
                                    </button>

                                    <div className="w-20 h-20  rounded-xl  flex items-center justify-center">
                                        <img
                                            src="/images/common/car1.svg"
                                            alt={fav.carName}
                                            className="w-16 h-16"
                                        />
                                    </div>
                                </div>

                                {/* 가운데: 차량 정보 */}
                                <div className="flex-1">
                                    <div className="text-sm font-semibold text-[#1A1A1A]">
                                        {fav.carName}
                                    </div>
                                </div>

                                {/* 오른쪽: 차량 보기 버튼 */}
                                <div className="flex items-center">
                                    <button
                                        type="button"
                                        onClick={() => navigate(`/cars/${fav.carId}`)}
                                        className="text-[11px] bg-[#2C7FFF] text-white px-3 py-1.5 rounded-lg font-medium hover:bg-[#1E5BBF] transition-colors shadow-sm"
                                    >
                                        차량 보기
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Favorites;
