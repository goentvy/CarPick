// src/pages/mypage/QnAlist.jsx
import { useNavigate } from "react-router-dom";
import { mockInquiries } from "../inquiry/Inquiry";

// 상태 코드 → 라벨/색 매핑
const getStatusMeta = (status) => {
    switch (status) {
        case "IN_PROGRESS":
            return {
                label: "진행 중",
                className: "bg-[#FFF7D7] text-[#F5C542]", // Warning 팔레트
            };
        case "RESOLVED":
            return {
                label: "답변 완료",
                className: "bg-[#E9F9F1] text-[#2ECC71]", // Success 팔레트
            };
        case "CLOSED":
            return {
                label: "종료",
                className: "bg-[#F4F4F5] text-[#52525B]", // 중립
            };
        default:
            return {
                label: "진행 중",
                className: "bg-[#FFF7D7] text-[#F5C542]",
            };
    }
};

function QnAlist() {
    const navigate = useNavigate();
    const items = mockInquiries; // 임시 데이터

    const contentMinHeight = "calc(100vh - 60px)";

    const formatCategory = (c) => {
        if (c === "reservation") return "예약 문의";
        if (c === "payment") return "결제 문의";
        if (c === "cancel") return "취소/환불";
        return "기타";
    };

    // 빈 상태
    if (!items || items.length === 0) {
        return (
            <div
                id="content"
                className="font-pretendard"
                style={{
                    minHeight: contentMinHeight,
                    backgroundColor: "#E7EEFF",
                }}
            >
                {/* 상단 바 */}
                <div className="px-4 py-4" style={{ backgroundColor: "#2C7FFF" }}>
                    <p className="text-sm text-white font-semibold">1:1 문의 내역</p>
                </div>

                {/* 빈 상태 카드 */}
                <div className="px-4 py-6">
                    <div className="bg-white rounded-2xl shadow-sm px-5 py-10 flex flex-col items-center justify-center text-center">
                        <h2 className="text-base font-semibold text-[#1A1A1A] mb-2">
                            아직 등록된 문의가 없어요
                        </h2>
                        <p className="text-sm text-[#666666] mb-6">
                            궁금한 점이 있다면
                            <br />
                            1:1 문의를 통해 빠르게 답변을 받아보세요.
                        </p>
                        <button
                            type="button"
                            onClick={() => navigate("/cs/inquiry")}
                            className="h-11 px-6 rounded-xl bg-[#2E73FF] text-white text-sm font-medium shadow-sm"
                        >
                            1:1 문의하기
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 문의 내역 있을 때
    return (
        <div
            id="content"
            className="font-pretendard"
            style={{
                minHeight: contentMinHeight,
                backgroundColor: "#E7EEFF",
            }}
        >
            {/* 상단 바 */}
            <div className="px-4 py-4" style={{ backgroundColor: "#2E73FF" }}>
                <p className="text-sm text-white font-semibold">1:1 문의 내역</p>
            </div>

            <div className="px-4 py-6 space-y-3">
                {items.map((item) => {
                    const statusMeta = getStatusMeta(item.status);
                    return (
                        <div
                            key={item.id}
                            className="bg-white rounded-2xl shadow-sm px-4 py-3 text-sm text-[#333333] flex flex-col"
                        >
                            <div className="flex items-center justify-between mb-1">
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#E7EEFF] text-[#2E73FF]">
                  {formatCategory(item.category)}
                </span>
                                <span className="text-[11px] text-[#999999]">
                  {new Date(item.createdAt).toLocaleString()}
                </span>
                            </div>

                            <p className="font-semibold mb-1">{item.title}</p>
                            <p className="text-xs text-[#666666] line-clamp-2">
                                {item.content}
                            </p>

                            {/* 우측 하단 상태 배지 */}
                            <div className="mt-2 flex justify-end">
                <span
                    className={`text-[11px] px-2 py-0.5 rounded-full ${statusMeta.className}`}
                >
                  {statusMeta.label}
                </span>
                            </div>
                        </div>
                    );
                })}

                <div className="pt-2">
                    <button
                        type="button"
                        onClick={() => navigate("/inquiry")}
                        className="w-full h-11 rounded-xl bg-[#2E73FF] text-white text-sm font-medium shadow-sm"
                    >
                        새 문의 남기기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default QnAlist;
