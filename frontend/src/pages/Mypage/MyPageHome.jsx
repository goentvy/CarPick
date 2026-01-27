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
];

function MyPageHome() {
    const navigate = useNavigate();
    const { user, logout } = useUserStore();
    const userName = user?.name ?? user?.email ?? "name";
    const [ongoingOrders, setOngoingOrders] = useState([]);
    const contentMinHeight = "calc(100vh - 80px - 72px)";

    useEffect(() => {
        const fetchOngoing = async () => {
            try {
                const res = await api.get("/mypage/reservations-list");
                const ongoingList = res.data
                    .filter(item => ["PENDING", "CONFIRMED", "ACTIVE"].includes(item.reservationStatus))
                    .sort((a, b) => new Date(b.createdAt || b.startDate) - new Date(a.createdAt || b.startDate));

                const orders = ongoingList.map(ongoing => ({
                    id: ongoing.reservationId,
                    carName: `${ongoing.brand} ${ongoing.displayNameShort}`,
                    pickupDate: `픽업 날짜 : ${formatDate(ongoing.startDate)}`,
                    status: STATUS_MAP[ongoing.reservationStatus]?.label || ongoing.reservationStatus,
                    pickupLocation: "김포공항점",
                    imgUrl: ongoing.imgUrl,      // ✅ 백엔드에서 받은 실제 이미지 URL
                    specId: ongoing.specId       // ✅ 백업용
                }));

                setOngoingOrders(orders);
            } catch (err) {
                console.error("진행 중 예약 조회 실패:", err);
            }
        };
        fetchOngoing();
    }, []);

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
            style={{ backgroundColor: "#E7EEFF", minHeight: contentMinHeight }}
        >
            <div
                className="font-pretendard pb-4 lg:pb-0"
                style={{ backgroundColor: "#E7EEFF", minHeight: contentMinHeight }}
            >
                {/* 인사 카드 */}
                <div className="w-full">
                    <div className="w-full rounded-b-3xl bg-[#1D6BF3] px-4 py-4 flex items-center justify-between shadow-md">
                        <p className="text-xs text-white ml-3">
                            <span className="font-semibold text-sm">{userName} 님</span>
                            <br />
                        </p>
                        <button
                            type="button"
                            onClick={() => navigate("/mypage/profile")}
                            className="text-[11px] px-3 py-2 rounded-full border border-white/70 text-white bg-white/10 hover:bg-white/20 transition"
                        >
                            개인정보 수정
                        </button>
                    </div>
                </div>

                {/* 진행중 주문 영역 */}
                <div className="px-4 pt-6">
                    <div className="flex flex-col items-center">
                        {ongoingOrders.length > 0 ? (
                            <button
                                type="button"
                                onClick={() => navigate(`/Mypage/Reservations/${ongoingOrders[0].id}`)}
                                className="
                  w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl
                  rounded-2xl bg-gradient-to-r from-[#0A56FF] to-white
                  text-white shadow-lg border-0 hover:shadow-xl transition-all
                "
                            >
                                <div className="flex items-center px-4 py-8">
                                    <div className="flex flex-col text-left mr-4">
                                        <span className="text-sm font-bold mt-1">
                                            {ongoingOrders[0].carName}
                                        </span>
                                        <div className="text-[11px] mt-1 opacity-90">
                                            <div>{ongoingOrders[0].pickupDate}</div>
                                            <div>{ongoingOrders[0].pickupLocation}</div>
                                            <div>{ongoingOrders[0].status}</div>
                                        </div>
                                    </div>
                                    <div className="ml-auto flex items-center">
                                        <div className="mr-10 w-30 h-15 rounded-xl overflow-hidden flex items-center justify-center">
                                            {/* ✅ 실제 차량 이미지 표시! */}
                                            <img
                                                src={ongoingOrders[0]?.imgUrl || "/images/common/car1.svg"}
                                                alt={ongoingOrders[0]?.carName || "car"}
                                                className="w-full h-full object-contain"
                                                onError={(e) => {
                                                    e.currentTarget.src = "http://carpicka.mycafe24.com/car_thumbnail/default_car_thumb.png";
                                                }}
                                            />
                                        </div>
                                        <span className="text-base font-bold text-[#2C7FFF]">›</span>
                                    </div>
                                </div>
                            </button>
                        ) : (
                            <div className="
                w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl
                px-6 py-8 rounded-2xl bg-white text-center
                shadow-sm border border-gray-100 hover:shadow-md transition-all
              ">
                                <p className="text-lg font-semibold text-gray-800 mb-2">진행 중인 예약이 없어요</p>
                                <p className="text-sm text-gray-500 mb-6">나에게 딱 맞는 차량을 찾아 볼까요?</p>
                                <button
                                    onClick={() => navigate("/")}
                                    className="
                    w-full px-4 py-3 rounded-xl bg-gradient-to-r
                    from-[#1D6BF3] to-[#0A56FF] text-white font-medium
                    text-sm shadow-lg hover:shadow-xl transition-all
                  "
                                >
                                    AI Pick 추천 받기
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* 메뉴 리스트 영역 */}
                <div className="px-4 pt-5 pb-4 lg:pb-2">
                    <div className="flex flex-col items-center space-y-3">
                        {menuItems.map((item) => (
                            <button
                                key={item.path}
                                type="button"
                                onClick={() => navigate(item.path)}
                                className="
                  w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl
                  flex items-center justify-between px-4 py-3
                  rounded-2xl bg-white text-[13px] font-medium text-[#1A1A1A]
                  shadow-sm hover:shadow-md hover:bg-[#F3F7FF] transition-all
                "
                            >
                                <span>{item.label}</span>
                                <span className="text-[#2C7FFF] text-lg font-bold leading-none">›</span>
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
                w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl
                flex items-center justify-center px-4 py-2 rounded-2xl
                bg-white text-[13px] font-semibold text-[#FF4D4F]
                border border-[#FF4D4F]/30 shadow-sm
                hover:shadow-md hover:bg-[#FFF5F5] transition-all
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
