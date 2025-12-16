// src/pages/mypage/MyPageHome.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const menuItems = [
    { label: "예약 내역", path: "/mypage/reservations" },
    { label: "취소 · 변경 내역", path: "/mypage/change-history" },
    { label: "리뷰 관리", path: "/mypage/reviewhistory" },
    { label: "문의 내역", path: "/mypage/qna" },
    { label: "면허 관리", path: "/mypage/license" },
    { label: "선호 차량", path: "/mypage/favorites" },
];

function MyPageHome({ userName = "UserName" }) {
    const navigate = useNavigate();
    const contentMinHeight = "calc(100vh - 80px - 72px)";

    // 이 화면에서만 전체 배경 E7EEFF
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
            {/* 상단 인사 바 */}
            <div className="px-4 py-4" style={{ backgroundColor: "#2C7FFF" }}>
                <div className="flex items-center justify-between">
                    <p className="text-sm text-white">
                        <span className="font-semibold">{userName}</span> 님
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/mypage/profile")}
                        className="text-[11px] px-2 py-1 rounded-full border border-white/70 text-white/90 bg-white/10"
                    >
                        개인정보 수정
                    </button>
                </div>
            </div>

            {/* 리스트 영역 (이 컴포넌트에서만 반응형 폭) */}
            <div className="px-4 pt-5 pb-4 lg:pb-2">
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
              "
                        >
                            <span>{item.label}</span>
                            <span className="text-[#C8FF48] text-lg font-bold leading-none">
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
