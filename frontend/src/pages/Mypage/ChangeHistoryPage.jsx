// src/pages/mypage/ChangeHistoryPage.jsx
import { useState } from "react";

function ChangeHistoryPage() {
    const [filter, setFilter] = useState("all"); // all | cancel | change
    const items = []; // 나중에 실제 데이터로 교체

    const filteredItems = items.filter((item) => {
        if (filter === "all") return true;
        if (filter === "cancel") return item.type === "CANCEL";
        if (filter === "change") return item.type === "CHANGE";
        return true;
    });

    const contentMinHeight = "calc(100vh - 80px - 72px)";

    return (
        <div
            id="content"
            className="font-pretendard"
            style={{ minHeight: contentMinHeight, backgroundColor: "#E7EEFF" }}
        >

            <div className="px-4 py-4 space-y-4">
                {/* 필터 탭 */}
                <div className="flex gap-2 text-xs">
                    <button
                        onClick={() => setFilter("all")}
                        className={`px-3 py-1.5 rounded-full border ${
                            filter === "all"
                                ? "bg-[#2C7FFF] border-[#2C7FFF] text-white"
                                : "bg-white border-[#d0d5dd] text-[#344054]"
                        }`}
                    >
                        전체
                    </button>
                    <button
                        onClick={() => setFilter("cancel")}
                        className={`px-3 py-1.5 rounded-full border ${
                            filter === "cancel"
                                ? "bg-[#2C7FFF] border-[#2C7FFF] text-white"
                                : "bg-white border-[#d0d5dd] text-[#344054]"
                        }`}
                    >
                        취소
                    </button>
                    <button
                        onClick={() => setFilter("change")}
                        className={`px-3 py-1.5 rounded-full border ${
                            filter === "change"
                                ? "bg-[#2C7FFF] border-[#2C7FFF] text-white"
                                : "bg-white border-[#d0d5dd] text-[#344054]"
                        }`}
                    >
                        변경
                    </button>
                </div>

                {/* 리스트 or 빈 상태 */}
                {filteredItems.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm px-5 py-10 flex flex-col items-center justify-center text-center">
                        <p className="text-sm text-[#666666] leading-relaxed">
                            해당하는 내역이 없습니다.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filteredItems.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-2xl shadow-sm px-4 py-3 text-sm text-[#333333]"
                            >
                                예약번호 {item.reservationCode}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ChangeHistoryPage;
