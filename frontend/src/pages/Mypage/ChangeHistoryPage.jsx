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
        // 2중, 3중
        return "복합 변경";
    };

    // 서브 태그용 라벨들
    const getSubChangeLabels = (item) => {
        const types = parseChangeTypes(item.changeTypes);
        return types.map((t) => {
            switch (t) {
                case "CAR":
                    return "차종";
                case "PERIOD":
                    return "기간";
                case "LOCATION":
                    return "위치";
                default:
                    return t;
            }
        });
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
                    "http://localhost:8080/api/reservations/history/me",
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

    // 취소/변경 카드 - 타입별로 완전히 다른 내용 표시
    const renderChangeCard = (item) => {
        const isCancel = item.actionType === "CANCEL";

        if (isCancel) {
            // 취소 전용 카드
            return (
                <div className="p-4 rounded-2xl border bg-gradient-to-r from-red-50 to-pink-50 border-red-100">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                        <p className="text-xs font-medium">취소</p>
                    </div>
                    <p className="text-xs text-red-600 font-medium">
                        {item.reason || "고객 취소"}
                    </p>
                </div>
            );
        }

        // 변경 타입 확인
        const showCar = hasType(item, "CAR");
        const showPeriod = hasType(item, "PERIOD");
        const showLocation = hasType(item, "LOCATION");

        // 라벨 결정
        let labelText = "변경";
        if (showCar && !showPeriod && !showLocation) {
            labelText = "차종 변경";
        } else if (showPeriod && !showCar && !showLocation) {
            labelText = "기간 변경";
        } else if (showLocation && !showCar && !showPeriod) {
            labelText = "위치 변경";
        } else {
            labelText = "복합 변경";
        }

        return (
            <div className="p-4 rounded-2xl border bg-gradient-to-r from-orange-50 to-amber-50 border-orange-100">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>
                    <p className="text-xs font-medium">{labelText}</p>

                    {/* 복합 변경이면 서브 태그 표시 */}
                    {(showCar && showPeriod) ||
                    (showCar && showLocation) ||
                    (showPeriod && showLocation) ? (
                        <div className="flex flex-wrap gap-1 ml-1">
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
                    ) : null}
                </div>

                <div className="space-y-2 text-xs text-gray-700">
                    {/* 차종 변경 영역 */}
                    {showCar && (
                        <div className="flex items-center gap-1">
                            <span className="text-gray-500 line-through">
                                {item.oldCarName}
                            </span>
                            <span className="text-orange-600 font-semibold mx-1">
                                →
                            </span>
                            <span className="font-semibold">
                                {item.newCarName}
                            </span>
                        </div>
                    )}

                    {/* 기간 변경 영역 */}
                    {showPeriod && (
                        <div className="flex items-center gap-1">
                            <span className="text-gray-500 line-through">
                                {item.oldStartDate} ~ {item.oldEndDate}
                            </span>
                            <span className="text-orange-600 font-semibold mx-1">
                                →
                            </span>
                            <span className="font-semibold">
                                {item.newStartDate} ~ {item.newEndDate}
                            </span>
                        </div>
                    )}

                    {/* 위치 변경 영역 */}
                    {showLocation && (
                        <div className="flex items-center gap-1">
                            <span className="text-gray-500 line-through">
                                {item.oldLocation}
                            </span>
                            <span className="text-orange-600 font-semibold mx-1">
                                →
                            </span>
                            <span className="font-semibold">
                                {item.newLocation}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div
                id="content"
                className="font-pretendard"
                style={{
                    minHeight: "calc(100vh - 60px)",
                    paddingBottom: "72px",
                    backgroundColor: "#E7EEFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2C7FFF] mx-auto mb-4"></div>
                    <p className="text-sm text-[#666666]">
                        히스토리 불러오는 중...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            id="content"
            className="font-pretendard"
            style={{
                minHeight: "calc(100vh - 60px)",
                paddingBottom: "72px",
                backgroundColor: "#E7EEFF",
                boxSizing: "border-box",
            }}
        >
            <div className="px-4 py-6">
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
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

                    <div>
                        {filteredItems.length ? (
                            <div>
                                {filteredItems.map((item) => {
                                    const isCancel =
                                        item.actionType === "CANCEL";
                                    const mainLabel =
                                        getMainChangeLabel(item);

                                    return (
                                        <div key={item.id} className="p-6">
                                            <div className="flex flex-col gap-3">
                                                {/* 상단: 차량명 + 태그 */}
                                                <div className="flex items-center gap-2">
                                                    <div className="ml-2 text-sm font-semibold text-[#1A1A1A] truncate">
                                                        {item.newCarName ||
                                                            item.oldCarName}
                                                    </div>
                                                    <div
                                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                            isCancel
                                                                ? "bg-red-100 text-red-700"
                                                                : "bg-orange-100 text-orange-700"
                                                        }`}
                                                    >
                                                        {mainLabel}
                                                    </div>
                                                </div>

                                                {/* 카드 + 상세보기 버튼 같이 */}
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                                    <div className="flex-1 min-w-0">
                                                        {(item.actionType ===
                                                            "CHANGE" ||
                                                            item.actionType ===
                                                            "CANCEL") && (
                                                            <div>
                                                                {renderChangeCard(
                                                                    item
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <button
                                                        onClick={() =>
                                                            navigate(
                                                                `/mypage/reservation-detail/${item.id}`
                                                            )
                                                        }
                                                        className="text-xs bg-[#1D6BF3] text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-[#1E5BBF] transition-colors whitespace-nowrap"
                                                    >
                                                        상세보기
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
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
