// src/pages/mypage/ChangeHistoryPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../store/useUserStore";

function ChangeHistoryPage() {
    const navigate = useNavigate();
    const accessToken = useUserStore((state) => state.accessToken);
    const [filter, setFilter] = useState("all");
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // "CAR,PERIOD" -> ["CAR","PERIOD"]
    const parseChangeTypes = (changeTypes) => {
        if (!changeTypes) return [];
        return changeTypes
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);
    };
    const formatWithoutYear = (dateStr) => {
        if (!dateStr) return "";
        const parts = dateStr.split("-");
        if (parts.length !== 3) return dateStr;
        return `${parts[1]}-${parts[2]}`;
    };

    // 타입 포함 여부 확인
    const hasType = (item, type) =>
        parseChangeTypes(item.changeTypes).includes(type);

    // 대표 라벨
    const getMainChangeLabel = (item) => {
        if (item.actionType === "CANCEL") return "취소";

        const types = parseChangeTypes(item.changeTypes);
        if (types.length === 0) return "변경";

        if (types.length === 1) {
            switch (types[0]) {
                case "CAR":
                    return "차종 변경";
                case "PERIOD":
                    return "기간 변경";
                case "LOCATION":
                    return "위치 변경";
                default:
                    return "변경";
            }
        }
        return "복합 변경";
    };

    // 예약번호 포매팅
    const formatReservationId = (id) => {
        return `RES-${id}`;
    };

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                console.log("API TOKEN:", accessToken ? "있음" : "없음");

                if (!accessToken) {
                    console.log("토큰 없음 → 로그인 필요!");
                    setLoading(false);
                    return;
                }

                const response = await fetch(
                    "http://localhost:8080/api/mypage/change-history/me",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "X-User-Id": useUserStore
                                .getState()
                                .user?.id?.toString(),
                        },
                    }
                );

                console.log("Status:", response.status);

                if (response.ok) {
                    const data = await response.json();
                    console.log("히스토리 데이터:", data);
                    setItems(data);
                } else {
                    const errorText = await response.text();
                    console.log("에러:", errorText);
                    setItems([]);
                }
            } catch (error) {
                console.error("에러:", error);
                setItems([]);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [accessToken]);

    const filteredItems = items.filter(
        (item) => filter === "all" || item.actionType === filter.toUpperCase()
    );

    // 취소/변경 카드
    const renderChangeCard = (item) => {
        const isCancel = item.actionType === "CANCEL";

        if (isCancel) {
            return (
                <div className="p-4 rounded-2xl border bg-gradient-to-r from-red-50 to-pink-50 border-red-100">
                    <p className="text-xs text-red-600 font-medium">
                        {item.reason || "고객 취소"}
                    </p>
                </div>
            );
        }

        const showCar = hasType(item, "CAR");
        const showPeriod = hasType(item, "PERIOD");
        const showLocation = hasType(item, "LOCATION");

        return (
            <div className="p-4 rounded-2xl border bg-gradient-to-r from-orange-50 to-amber-50 border-orange-100">
                <div className="flex flex-wrap gap-1 mb-3">
                    {showCar && (
                        <span className="px-2 py-0.5 rounded-full bg-white/70 text-[10px] text-[#555]">
                            차종
                        </span>
                    )}
                    {showPeriod && (
                        <span className="px-2 py-0.5 rounded-full bg-white/70 text-[10px] text-[#555]">
                            기간
                        </span>
                    )}
                    {showLocation && (
                        <span className="px-2 py-0.5 rounded-full bg-white/70 text-[10px] text-[#555]">
                            위치
                        </span>
                    )}
                </div>

                <div className="space-y-2 text-xs text-gray-700">
                    {showCar && (
                        <div className="flex items-center gap-1">
                            <span className="text-gray-500 line-through">
                                {item.oldCarName}
                            </span>
                            <span className="text-orange-600 font-semibold mx-1">→</span>
                            <span className="font-semibold">{item.newCarName}</span>
                        </div>
                    )}
                    {showPeriod && (
                        <div className="flex items-center gap-1">
                            <span className="text-gray-500 line-through">
                                {formatWithoutYear(item.oldStartDate)} ~ {formatWithoutYear(item.oldEndDate)}
                            </span>
                            <span className="text-orange-600 font-semibold mx-1">→</span>
                            <span className="font-semibold">
                                {formatWithoutYear(item.newStartDate)} ~ {formatWithoutYear(item.newEndDate)}
                            </span>
                        </div>
                    )}
                    {showLocation && (
                        <div className="flex items-center gap-1">
                            <span className="text-gray-500 line-through">
                                {item.oldLocation}
                            </span>
                            <span className="text-orange-600 font-semibold mx-1">→</span>
                            <span className="font-semibold">{item.newLocation}</span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div
            id="content"
            className="font-pretendard min-h-screen bg-[#E7EEFF] flex flex-col"
        >
            <div className="px-4 py-6 flex-1">
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    {/* 필터 탭 */}
                    <div className="px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
                        <div className="flex gap-2 text-xs">
                            {["all", "cancel", "change"].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-2 rounded-xl border transition-all ${
                                        filter === f
                                            ? "bg-[#1D6BF3] border-[#2C7FFF] text-white shadow-sm"
                                            : "bg-white border-gray-200 text-[#666] hover:border-[#2C7FFF] hover:text-[#2C7FFF]"
                                    }`}
                                >
                                    {f === "all"
                                        ? "전체"
                                        : f === "cancel"
                                            ? "취소"
                                            : "변경"}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 리스트 */}
                    <div className="divide-y divide-gray-100">
                        {filteredItems.length ? (
                            filteredItems.map((item) => {
                                const isCancel = item.actionType === "CANCEL";

                                return (
                                    <div key={item.id} className="p-6">
                                        <div className="flex flex-col gap-3">
                                            {/* 상단: 예약번호 | 날짜 | 액션 라벨 */}
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <div className="text-sm font-semibold text-[#1A1A1A]">
                                                    {item.reservationNo}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {item.createdAt}
                                                </div>
                                                <div
                                                    className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                                                        isCancel
                                                            ? "bg-red-100 text-red-700"
                                                            : "bg-orange-100 text-orange-700"
                                                    }`}
                                                >
                                                    {isCancel ? "취소" : "변경"}
                                                </div>
                                            </div>

                                            {/* 카드 + 상세보기 버튼 */}
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                                <div className="flex-1 min-w-0">
                                                    {(item.actionType === "CHANGE" || item.actionType === "CANCEL") && (
                                                        <div>{renderChangeCard(item)}</div>
                                                    )}
                                                </div>

                                                <button
                                                    onClick={() => navigate(`/Mypage/Reservations/${item.reservationId}`)}
                                                    className="text-xs bg-[#1D6BF3] text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-[#1E5BBF] transition-colors whitespace-nowrap"
                                                >
                                                    상세보기
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="p-12 flex flex-col items-center justify-center text-center">
                                <p className="text-lg font-semibold text-[#1A1A1A] mb-2">
                                    취소 또는 변경된 예약 내역이 없습니다.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChangeHistoryPage;
