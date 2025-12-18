// src/pages/mypage/ChangeHistoryPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ChangeHistoryPage() {
    const navigate = useNavigate();
    const [filter, setFilter] = useState("all");
    const [items, setItems] = useState([]);

    useEffect(() => {
        localStorage.removeItem("changeHistory");
        console.log("✅ localStorage 초기화 완료");

        const initialData = [
            {
                id: 1,
                reservationCode: "RP-20251201-001",
                type: "CANCEL",
                carName: "K5 프리미엄",
                period: "2025.12.01 ~ 2025.12.03",
                reason: "계획 변경",
            },
            {
                id: 2,
                reservationCode: "RP-20251203-002",
                type: "CHANGE",
                carName: "모닝 스마트",
                period: "2025.12.02 ~ 2025.12.04",
                previous: "2025.12.01 ~ 2025.12.03",
                changeType: "period",
                reason: "날짜 변경",
            },
            {
                id: 3,
                reservationCode: "RP-20251205-003",
                type: "CANCEL",
                carName: "소나타 하이브리드",
                period: "2025.12.10 ~ 2025.12.12",
                reason: "개인 사정",
            },
            {
                id: 4,
                reservationCode: "RP-20251207-004",
                type: "CHANGE",
                carName: "그랜저 IG",
                period: "2025.12.05 ~ 2025.12.07",
                previousCar: "K5 프리미엄",
                changeType: "car",
                reason: "차종 변경",
            },
            {
                id: 5,
                reservationCode: "RP-20251208-005",
                type: "CHANGE",
                carName: "아반떼 N",
                period: "2025.12.15 ~ 2025.12.18",
                previous: "2025.12.10 ~ 2025.12.12",
                previousLocation: "강남지점",
                location: "여의도지점",
                changeType: "location",
                reason: "렌트 위치 변경/날짜 변경",
            },
            {
                id: 6,
                reservationCode: "RP-20251210-006",
                type: "CHANGE",
                carName: "BMW 3시리즈",
                period: "2025.12.20 ~ 2025.12.25",
                previousCar: "소나타 하이브리드",
                changeType: "car",
                reason: "차종 변경",
            },
        ];

        setItems(initialData);
        localStorage.setItem("changeHistory", JSON.stringify(initialData));
        console.log("✅ 초기 데이터 6개 설정 완료:", initialData.length);
    }, []);

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
                                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 0v6m0-6H9m3 0v6m-3-6h6m-6 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="text-lg font-semibold text-[#1A1A1A] mb-2">내역이 없습니다</p>
                                <p className="text-sm text-[#666666] mb-6">취소 또는 변경된 예약 내역이 없습니다.</p>
                                <button
                                    onClick={() => navigate("/mypage/reservationslist")}
                                    className="px-8 py-3 bg-[#2C7FFF] text-white text-sm font-medium rounded-xl shadow-sm hover:bg-[#1E5BBF]"
                                >
                                    예약 내역 보기
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChangeHistoryPage;
