// src/pages/Mypage/QnAlist.jsx
// ✅ MyLicense와 완전 동일한 패턴 (/me 엔드포인트 + accessToken만)
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useUserStore from "../../store/useUserStore";

// 상태 코드 → 라벨/색 매핑 (DB: pending/answered)
const getStatusMeta = (status) => {
    switch (status) {
        case "PENDING":
            return {
                label: "대기 중",
                className: "bg-[#FFF7D7] text-[#F5C542]",
            };
        case "ANSWERED":
            return {
                label: "답변 완료",
                className: "bg-[#E9F9F1] text-[#2ECC71]",
            };
        default:
            return {
                label: "대기 중",
                className: "bg-[#FFF7D7] text-[#F5C542]",
            };
    }
};

function QnAlist() {
    const navigate = useNavigate();
    const { accessToken } = useUserStore();  // ✅ MyLicense와 동일! userId 불필요
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const contentMinHeight = "calc(100vh - 60px)";

    useEffect(() => {
        if (accessToken) {
            fetchMyInquiries();  // ✅ MyLicense와 동일 패턴
        } else {
            setItems([]);
            setLoading(false);
        }
    }, [accessToken]);  // ✅ accessToken만 의존성

    const fetchMyInquiries = async () => {
        try {
            setLoading(true);


            const response = await fetch("/api/mypage/inquiries", {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'X-User-Id': useUserStore.getState().user?.id?.toString()
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("📥 문의내역 응답:", data);

            // 백엔드 응답 형식에 맞게 (data 또는 data.data)
            const inquiryList = data.data || data || [];
            setItems(Array.isArray(inquiryList) ? inquiryList : []);
        } catch (error) {
            console.error("❌ 문의내역 로드 실패:", error);
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    const formatCategory = (c) => {
        if (c === "reservation") return "예약 문의";
        if (c === "payment") return "결제 문의";
        if (c === "cancel") return "취소/환불";
        return "기타";
    };

    // 로딩 중
    if (loading) {
        return (
            <div
                id="content"
                className="font-pretendard"
                style={{
                    minHeight: contentMinHeight,
                    backgroundColor: "#E7EEFF",
                }}
            >
                <div className="px-4 py-6 flex items-center justify-center">
                    <p className="text-lg text-[#666666]">문의내역 불러오는 중...</p>
                </div>
            </div>
        );
    }

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
                <div className="px-4 py-6">
                    <div className="bg-white rounded-2xl shadow-sm px-5 py-10 flex flex-col items-center justify-center text-center">
                        <h2 className="text-base font-semibold text-[#1A1A1A] mb-2">
                            아직 등록된 문의가 없어요
                        </h2>
                        <p className="text-sm text-[#666666] mb-6">
                            1:1 문의를 남겨주시면 직원이 확인 후
                            <br />
                            빠르게 답변을 해드리겠습니다.
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

            <div className="px-4 py-6 space-y-3">
                {items.map((item) => {
                    const statusMeta = getStatusMeta(item.status);

                    // createdAt 안전하게 처리
                    const formatDate = (dateStr) => {
                        try {
                            return new Date(dateStr).toLocaleString('ko-KR', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                            });
                        } catch {
                            return dateStr || '날짜 없음';
                        }
                    };

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
                                    {formatDate(item.createdAt)}
                                </span>
                            </div>

                            <p className="font-semibold mb-1">{item.title}</p>
                            <p className="text-xs text-[#666666] line-clamp-2">
                                {item.content}
                            </p>

                            {/* 관리자 답변 표시 */}
                            {item.adminReply && (
                                <div className="mt-2 pt-2 border-t border-gray-100">
                                    <p className="text-xs text-[#2E73FF] font-medium mb-1">관리자 답변:</p>
                                    <p className="text-xs text-[#666666]">{item.adminReply}</p>
                                </div>
                            )}

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
                        onClick={() => navigate("/cs/inquiry")}
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
