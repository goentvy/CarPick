import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import useUserStore from "../../../store/useUserStore";

const NaverCallback = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    const receivedState = url.searchParams.get("state");
    const originalState = sessionStorage.getItem("naver_state");

    if (code && receivedState === originalState && sessionStorage.getItem("usedCode") !== code) {
      sessionStorage.setItem("usedCode", code);

      (async () => {
        try {
          const minTime = new Promise((resolve) => setTimeout(resolve, 1000));
          const loginRequest = api.post("/auth/login/naver", { code, state: receivedState });

          const [, res] = await Promise.all([minTime, loginRequest]);

          if (res.data.success) {
            useUserStore.getState().login({
              user: {
                email: res.data.email,
                name: res.data.name,
                membershipGrade: res.data.membershipGrade,
              },
              accessToken: res.data.token,
            });
            navigate("/home");
          } else {
            alert(res.data.message || "네이버 로그인 실패");
            navigate("/login");
            setLoading(false);
          }
        } catch (err) {
          console.error("네이버 로그인 실패:", err);
          alert("네이버 로그인 중 오류가 발생했습니다.");
          navigate("/login");
          setLoading(false);
        }
      })();
    } else if (!code) {
      navigate("/login");
    }
  }, [navigate]);

  if (loading) {
    return (
      // ✅ [검증 완료] 640px 정중앙 오버레이
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[640px] h-full z-[9999] flex flex-col items-center justify-center bg-blue-500">
        <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
        <p className="text-white text-lg font-bold">회원정보를 불러오는 중</p>
      </div>
    );
  }

  return null;
};

export default NaverCallback;