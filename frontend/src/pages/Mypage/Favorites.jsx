// src/pages/mypage/Favorites.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../store/useUserStore";

function Favorites() {
    const navigate = useNavigate();
    const { accessToken, user } = useUserStore();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ✅ 1️⃣ 페이지 로드 시 DB에서 찜 목록 조회
    useEffect(() => {
        fetchFavorites();
    }, [accessToken]);

    const fetchFavorites = async () => {
        // ⚠️ 주의점: 토큰 없으면 조회 불가
        if (!accessToken) {
            setLoading(false);
            setFavorites([]);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await fetch("/api/favorites/me", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            });

            // ⚠️ 주의점: 401/403 → 로그인 페이지로 이동
            if (response.status === 401 || response.status === 403) {
                useUserStore.setState({ accessToken: null, user: null });
                navigate("/login");
                return;
            }

            // ⚠️ 주의점: 500 에러 → 사용자 친화적 메시지
            if (!response.ok) {
                throw new Error(`서버 오류: ${response.status}`);
            }

            // ✅ 응답 파싱 (배열 형태)
            const data = await response.json();
            setFavorites(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("선호 차량 조회 실패:", err);
            setError("선호 차량을 불러올 수 없습니다. 다시 시도해주세요.");
            setFavorites([]);
        } finally {
            setLoading(false);
        }
    };

    // ✅ 2️⃣ 찜 추가 (day/month 페이지에서 호출)
    const addFavorite = async (carId, carName, carImageUrl) => {
        if (!accessToken) {
            navigate("/login");
            return;
        }

        try {
            const response = await fetch(`/api/favorites/${carId}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    carName: carName,
                    carImageUrl: carImageUrl
                })
            });

            // ⚠️ 주의점: 401 → 로그인
            if (response.status === 401 || response.status === 403) {
                useUserStore.setState({ accessToken: null, user: null });
                navigate("/login");
                return;
            }

            if (response.ok) {
                // ✅ 낙관적 업데이트 (새로고침 없이 즉시 추가)
                const newFavorite = {
                    id: Date.now(),  // 임시 ID
                    carId: carId,
                    carName: carName,
                    carImageUrl: carImageUrl,
                    createdAt: new Date().toISOString()
                };
                setFavorites(prev => [newFavorite, ...prev]);
                alert("찜 추가 완료!");
            } else if (response.status === 409) {
                alert("이미 찜한 차량입니다.");
            }
        } catch (err) {
            console.error("찜 추가 실패:", err);
            alert("찜 추가에 실패했습니다.");
        }
    };

    // ✅ 3️⃣ 찜 삭제
    const deleteFavorite = async (favoriteId) => {
        if (!window.confirm("이 차량을 찜에서 삭제하시겠습니까?")) return;

        if (!accessToken) {
            navigate("/login");
            return;
        }

        try {
            // ✅ 낙관적 업데이트 (먼저 UI 삭제)
            setFavorites(prev => prev.filter(f => f.id !== favoriteId));

            const response = await fetch(`/api/favorites/${favoriteId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            });

            // ⚠️ 주의점: 실패 시 다시 로드
            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    useUserStore.setState({ accessToken: null, user: null });
                    navigate("/login");
                    return;
                }
                // 삭제 실패 시 다시 조회
                await fetchFavorites();
                alert("삭제에 실패했습니다.");
            }
        } catch (err) {
            console.error("찜 삭제 실패:", err);
            // 에러 시 다시 조회해서 원래 상태로 복구
            await fetchFavorites();
            alert("삭제 중 오류가 발생했습니다.");
        }
    };

    // ⚠️ 로딩 중
    if (loading) {
        return (
            <div id="content" className="font-pretendard min-h-screen bg-[#E7EEFF] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2C7FFF] mx-auto"></div>
                    <p className="text-sm text-[#666666] mt-4">선호 차량 불러오는 중...</p>
                </div>
            </div>
        );
    }

    // ⚠️ 에러 발생
    if (error) {
        return (
            <div id="content" className="font-pretendard min-h-screen bg-[#E7EEFF] flex flex-col">
                <div className="px-4 py-6">
                    <div className="bg-white rounded-2xl shadow-sm px-5 py-10 flex flex-col items-center justify-center text-center">
                        <h2 className="text-base font-semibold text-red-500 mb-2">오류 발생</h2>
                        <p className="text-sm text-[#666666] mb-6">{error}</p>
                        <button
                            onClick={fetchFavorites}
                            className="h-11 px-6 rounded-xl bg-[#2C7FFF] text-white text-sm font-medium shadow-sm hover:bg-[#1E5BBF]"
                        >
                            다시 시도
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ✅ 메인 UI
    return (
        <div id="content" className="font-pretendard min-h-screen bg-[#E7EEFF] flex flex-col">
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
                        <button
                            type="button"
                            onClick={() => navigate("/day")}
                            className="h-11 px-6 rounded-xl bg-[#2C7FFF] text-white text-sm font-medium shadow-sm hover:bg-[#1E5BBF] transition-colors"
                        >
                            차량 목록 보러가기
                        </button>
                    </div>
                )}

                {/* 선호차량 있을 때 */}
                {favorites.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-[#1A1A1A] px-2 py-2">
                            선호 차량 {favorites.length}개
                        </h3>
                        {favorites.map((fav) => (
                            <div
                                key={fav.id}
                                className="bg-white rounded-2xl shadow-sm px-4 py-4 flex items-center gap-3 hover:shadow-md transition-shadow"
                            >
                                {/* 왼쪽: 하트 + 차량 이미지 */}
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => deleteFavorite(fav.id)}
                                        className="flex items-center justify-center hover:scale-110 transition-transform"
                                        aria-label="찜 삭제"
                                    >
                                        <span className="text-red-500 text-2xl">♥</span>
                                    </button>

                                    <div className="w-20 h-20 rounded-xl flex items-center justify-center">
                                        <img
                                            src={fav.carImageUrl || "/images/common/car1.svg"}
                                            alt={fav.carName}
                                            className="w-16 h-16 object-contain"
                                        />
                                    </div>
                                </div>

                                {/* 가운데: 차량 정보 */}
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-semibold text-[#1A1A1A] truncate">
                                        {fav.carName}
                                    </div>
                                </div>

                                {/* 오른쪽: 차량 보기 버튼 */}
                                <div className="flex items-center">
                                    <button
                                        type="button"
                                        onClick={() => navigate(`/car/detail/${fav.carId}`)}
                                        className="text-[11px] bg-[#2C7FFF] text-white px-3 py-1.5 rounded-lg font-medium hover:bg-[#1E5BBF] transition-colors shadow-sm whitespace-nowrap"
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