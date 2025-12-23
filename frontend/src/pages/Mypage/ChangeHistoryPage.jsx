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

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                console.log('🔥 API TOKEN:', accessToken ? '있음' : '없음');

                if (!accessToken) {
                    console.log('🔥 ❌ 토큰 없음 → 로그인 필요!');
                    setLoading(false);
                    return;
                }

                const response = await fetch('http://localhost:8080/api/reservations/history/me', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'X-User-Id': useUserStore.getState().user?.id?.toString()
                    }
                });

                console.log('🔥 Status:', response.status);

                if (response.ok) {
                    const data = await response.json();
                    console.log('🔥 히스토리 데이터:', data);
                    setItems(data);
                } else {
                    const errorText = await response.text();
                    console.log('🔥 에러:', errorText);
                    setItems([]);
                }
            } catch (error) {
                console.error('🔥 에러:', error);
                setItems([]);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [accessToken]);

    const filteredItems = items.filter(
        (item) => filter === "all" || item.type === filter.toUpperCase()
    );

    const renderChangeInfo = (item) => {
        if (item.type !== "CHANGE") return null;
        const changes = [];

        if (item.changeType === "car" && item.previousCar) {
            changes.push({
                label: "차종",
                before: item.previousCar,
                after: item.carName
            });
        }
        if (item.changeType === "period" && item.previous) {
            changes.push({
                label: "기간",
                before: item.previous,
                after: item.period
            });
        }
        if (item.changeType === "location") {
            if (item.previousLocation) {
                changes.push({
                    label: "위치",
                    before: item.previousLocation,
                    after: item.location
                });
            }
            if (item.previous) {
                changes.push({
                    label: "기간",
                    before: item.previous,
                    after: item.period
                });
            }
        }

        return changes.map((change, index) => (
            <div
                key={index}
                className="flex items-center gap-1 text-xs text-[#FF6B35] font-medium bg-orange-50 px-2 py-1 rounded-lg"
            >
                <span className="text-[#666] min-w-0 flex-shrink">{change.label}</span>
                <span className="min-w-0 flex-shrink-0">:</span>
                <span className="text-[#666] min-w-0 flex-shrink">{change.before}</span>
                <span className="text-[#FF6B35] font-semibold mx-1">→</span>
                <span className="min-w-0 flex-shrink text-[#FF6B35] font-semibold">{change.after}</span>
            </div>
        ));
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
                    <p className="text-sm text-[#666666]">히스토리 불러오는 중...</p>
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
                                            ? "bg-[#2C7FFF] border-[#2C7FFF] text-white shadow-sm"
                                            : "bg-white border-gray-200 text-[#666] hover:border-[#2C7FFF] hover:text-[#2C7FFF]"
                                    }`}
                                >
                                    {f === "all" ? "전체" : f === "cancel" ? "취소" : "변경"}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        {filteredItems.length ? (
                            <div className="divide-y divide-gray-100">
                                {filteredItems.map((item) => (
                                    <div key={item.id} className="p-6 hover:bg-gray-25 transition-colors">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="text-sm font-semibold text-[#1A1A1A] truncate">
                                                        {item.carName}
                                                    </div>
                                                    <div
                                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                            item.type === "CANCEL"
                                                                ? "bg-red-100 text-red-700"
                                                                : "bg-orange-100 text-orange-700"
                                                        }`}
                                                    >
                                                        {item.type === "CANCEL" ? "취소" : "변경"}
                                                    </div>
                                                </div>
                                                <div className="text-xs text-[#888888] mb-3">
                                                    렌트 기간: {item.period}
                                                </div>
                                                {item.type === "CHANGE" && (
                                                    <div className="space-y-1.5 mb-3">
                                                        {renderChangeInfo(item)}
                                                    </div>
                                                )}
                                                <div className="text-xs text-[#555] bg-[#F8F9FA] px-3 py-1.5 rounded-xl truncate">
                                                    {item.reason}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => navigate(`/mypage/reservation-detail/${item.id}`)}
                                                className="text-xs bg-[#2C7FFF] text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-[#1E5BBF] transition-colors whitespace-nowrap flex-shrink-0"
                                            >
                                                상세보기
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 flex flex-col items-center justify-center text-center">
                                <p className="text-lg font-semibold text-[#1A1A1A] mb-2">취소 또는 변경된 예약 내역이 없습니다.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChangeHistoryPage;
