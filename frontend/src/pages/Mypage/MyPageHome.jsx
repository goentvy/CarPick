// src/pages/Mypage/MyPageHome.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../store/useUserStore";

const menuItems = [
    { label: "예약 내역", path: "/Mypage/ReservationsList" },
    { label: "취소 · 변경 내역", path: "/Mypage/ChangeHistory" },
    { label: "리뷰 관리", path: "/Mypage/ReviewHistory" },
    { label: "문의 내역", path: "/mypage/QnA" },
    { label: "면허 관리", path: "/Mypage/license" },
    { label: "결제 수단", path: "/Mypage/Payment" },
    { label: "선호 차량", path: "/Mypage/Favorites" },
];

function MyPageHome() {
    const navigate = useNavigate();
    const { user, logout } = useUserStore();
    const userName = user?.name ?? user?.email ?? "name";

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
        });
        return () => clearTimeout(timeout);
    }, []);

    // 배경색 유지 (홈이랑 같은 연파랑)
    useEffect(() => {
        const prevBodyBg = document.body.style.backgroundColor;
        document.body.style.backgroundColor = "#E7EEFF";
        return () => {
            document.body.style.backgroundColor = prevBodyBg || "";
        };
    }, []);

    const handleLogout = () => {
        if (logout) logout();
        localStorage.removeItem("accessToken");
        navigate("/login");
    };

    return (
        <div
            id="content"
            className="font-pretendard pb-4 lg:pb-0"
            style={{
                backgroundColor: "#E7EEFF",
                minHeight: contentMinHeight,
            }}
        >

            <div
                className="font-pretendard pb-4 lg:pb-0"
                style={{
                    backgroundColor: "#E7EEFF",
                    minHeight: contentMinHeight,
                }}
            >
                {/* 인사 카드 */}
                <div className="w-full">
                    <div
                        className="
        w-full
        rounded-b-3xl
        bg-[#1D6BF3]
        px-4 py-4
        flex items-center justify-between
        shadow-md
      "
                    >
                        <p className="text-xs text-white ml-3">
                            <span className="font-semibold text-sm">{userName} 님</span>
                            <br />
                        </p>

                        <button
                            type="button"
                            onClick={() => navigate("/mypage/profile")}
                            className="
          text-[11px] px-3 py-2 rounded-full
          border border-white/70 text-white
          bg-white/10
          hover:bg-white/20 transition
        "
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
                            onClick={() => navigate("/mypage/reservationslist")}
                            className="
          w-full
          max-w-md
          sm:max-w-lg
          md:max-w-xl
          lg:max-w-2xl
          rounded-2xl
          bg-linear-to-r from-[#0A56FF] to-white
          text-white shadow-lg border-0 hover:shadow-xl transition-all
        "
                        >
                            <div className="flex items-center px-4 py-8">
                                {/* 왼쪽 텍스트 */}
                                <div className="flex flex-col text-left mr-4">
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


            {/* 메뉴 리스트 영역 – 홈 하단 카드 톤과 맞춤 */}
            <div className="px-4 pt-5 pb-4 lg:pb-2">
                <div className="flex flex-col items-center space-y-3">
                    {menuItems.map((item) => (
                        <button
                            key={item.path}
                            type="button"
                            onClick={() => navigate(item.path)}
                            className="
                w-full
                max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl
                flex items-center justify-between
                px-4 py-3
                rounded-2xl bg-white
                text-[13px] font-medium text-[#1A1A1A]
                shadow-sm
                hover:shadow-md hover:bg-[#F3F7FF]
                transition-all
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

            {/* 로그아웃 버튼 – 테스트용 최종으로 넣을지 미결정 */}
            <div className="px-35 pb-8 lg:pb-6 mt-5">
                <div className="flex flex-col items-center">
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="
              w-full
              max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl
              flex items-center justify-center
              px-4 py-2 rounded-2xl
              bg-white
              text-[13px] font-semibold text-[#FF4D4F]
              border border-[#FF4D4F]/30
              shadow-sm hover:shadow-md hover:bg-[#FFF5F5]
              transition-all
            "
                    >
                        로그아웃
                    </button>
                </div>
            </div>
        </div>
        </div>
    );
}

export default MyPageHome;
