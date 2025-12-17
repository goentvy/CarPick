// src/pages/mypage/MyPageHome.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../store/useUserStore";

const menuItems = [
    { label: "예약 내역", path: "/mypage/reservations" },
    { label: "취소 · 변경 내역", path: "/mypage/change-history" },
    { label: "리뷰 관리", path: "/mypage/reviewhistory" },
    { label: "문의 내역", path: "/mypage/qna" },
    { label: "면허 관리", path: "/mypage/license" },
    { label: "결제 수단", path: "/mypage/payment" },
    { label: "선호 차량", path: "/mypage/favorites" },
];

function MyPageHome() {
    const navigate = useNavigate();
    const { user } = useUserStore();                 // 로그인한 유저
    const userName = user?.name ?? "UserName";       // 이름 없으면 기본값

    const [ongoingOrder, setOngoingOrder] = useState(null);
    const contentMinHeight = "calc(100vh - 80px - 72px)";

    // 진행중 주문 mock
    useEffect(() => {
        const timeout = setTimeout(() => {
            setOngoingOrder({
                id: 123,
                carName: "Test Name",
                pickupDate: "픽업 날짜 : 2025-12-20 (토)",
                status: "예약완료",
                pickupLocation: "서울역 카픽존",
            });
        }, 1500);

        return () => clearTimeout(timeout);
    }, []);

    // 배경색 유지
    useEffect(() => {
        const prevBodyBg = document.body.style.backgroundColor;
        document.body.style.backgroundColor = "#E7EEFF";
        return () => {
            document.body.style.backgroundColor = prevBodyBg || "";
        };
    }, []);

    return (
        <div
            id="content"
            className="font-pretendard pb-4 lg:pb-0"
            style={{
                backgroundColor: "#E7EEFF",
                minHeight: contentMinHeight,
            }}
        >
            {/* 상단 바 */}
            <div className="px-4 py-4" style={{ backgroundColor: "#2C7FFF" }}>
                <div className="flex items-center justify-between">
                    <p className="text-sm text-white">
                        <span className="font-semibold">{userName}</span> 님
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/mypage/profile")}
                        className="text-[11px] px-2 py-2 rounded-full border border-white/70 text-white/90 bg-white/10"
                    >
                        개인정보 수정
                    </button>
                </div>
            </div>

            {/* 진행중 주문 카드 */}
            {ongoingOrder && (
                <div className="px-4 pt-6">
                    <div className="flex flex-col items-center">
                        <button
                            type="button"
                            onClick={() => navigate("/mypage/reservations")}
                            className="
                w-full
                max-w-md
                sm:max-w-lg
                md:max-w-xl
                lg:max-w-2xl
                rounded-2xl
                bg-gradient-to-r from-[#0A56FF] to-white
                text-white shadow-lg border-0 hover:shadow-xl transition-all
              "
                        >
                            <div className="flex items-center px-4 py-8">
                                {/* 왼쪽 텍스트 */}
                                <div className="flex flex-col text-left mr-4">
                  <span className="text-[11px] font-semibold">
                    진행중인 주문
                  </span>
                                    <span className="text-sm font-bold mt-1">
                    {ongoingOrder.carName}
                  </span>
                                    <div className="text-[11px] mt-1 opacity-90">
                                        <div>{ongoingOrder.pickupDate}</div>
                                        <div>{ongoingOrder.pickupLocation}</div>
                                        <div>{ongoingOrder.status}</div>
                                    </div>
                                </div>

                                {/* 오른쪽 이미지 + 화살표 */}
                                <div className="ml-auto flex items-center">
                                    <div className="mr-10 w-30 h-15 rounded-xl overflow-hidden flex items-center justify-center">
                                        <img
                                            src="/images/common/car1.svg"
                                            alt="car"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <span className="text-base font-bold text-[#2C7FFF]">›</span>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            )}

            {/* 리스트 영역 */}
            <div className="px-4 pt-4 pb-4 lg:pb-2">
                <div className="flex flex-col items-center space-y-3">
                    {menuItems.map((item) => (
                        <button
                            key={item.path}
                            type="button"
                            onClick={() => navigate(item.path)}
                            className="
                w-full
                max-w-md
                sm:max-w-lg
                md:max-w-xl
                lg:max-w-2xl
                flex items-center justify-between
                px-4 py-3 rounded-2xl bg-white
                text-sm font-medium text-[#1A1A1A] shadow-sm
                hover:shadow-md transition-all
              "
                        >
                            <span>{item.label}</span>
                            <span className="text-[#2C7FFF] text-lg font-bold leading-none">
                ›
              </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MyPageHome;
