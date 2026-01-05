// src/pages/Mypage/MyPageHome.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import useUserStore from "../../store/useUserStore";

const STATUS_MAP = {
    PENDING: { label: "결제 대기", color: "text-yellow-600" },
    CONFIRMED: { label: "예약 확정", color: "text-blue-600" },
    ACTIVE: { label: "이용 중", color: "text-green-600" },
    COMPLETED: { label: "이용 완료", color: "text-gray-500" },
    CANCELED: { label: "예약 취소", color: "text-red-500" },
    CHANGED: { label: "예약 변경", color: "text-purple-600" },
};

const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    const weekday = weekdays[date.getDay()];
    return `${year}. ${month}. ${day} (${weekday})`;
};

const menuItems = [
    { label: "예약 내역", path: "/mypage/reservations" },
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

    // 실제 DB에서 userid에 맞는 최신 진행중 예약 조회
    useEffect(() => {
        const fetchOngoing = async () => {
            try {
                const res = await api.get("/mypage/reservations-list");
                // 완료되지 않은 상태(PENDING, CONFIRMED, ACTIVE) 중 최신 예약 선택
                const ongoing = res.data
                    .filter(item => ["PENDING", "CONFIRMED", "ACTIVE"].includes(item.reservationStatus))
                    .sort((a, b) => new Date(b.createdAt || b.startDate) - new Date(a.createdAt || a.startDate))[0];

                if (ongoing) {
                    setOngoingOrder({
                        id: ongoing.reservationId,
                        carName: `${ongoing.brand} ${ongoing.displayNameShort}`,
                        pickupDate: `픽업 날짜 : ${formatDate(ongoing.startDate)}`,
                        status: STATUS_MAP[ongoing.reservationStatus]?.label || ongoing.reservationStatus,
                        pickupLocation: ongoing.pickupLocation || "픽업 장소",
                    });
                }
            } catch (err) {
                console.error("진행 중 예약 조회 실패:", err);
            }
        };
        fetchOngoing();
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

                {/* 메뉴 리스트 영역 */}
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

                {/* 로그아웃 버튼 */}
                <div className="px-4 pb-8 lg:pb-6 mt-5">
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
