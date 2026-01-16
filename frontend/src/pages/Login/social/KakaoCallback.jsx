import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import useUserStore from "../../../store/useUserStore";

const KakaoCallback = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    console.log("카카오 code: ", code);

    if (code && sessionStorage.getItem("usedCode") !== code) {
      sessionStorage.setItem("usedCode", code);

      (async () => {
        try {
          const minTime = new Promise((resolve) => setTimeout(resolve, 1000));
          const loginRequest = api.post("/auth/login/kakao", { code });

          const [, res] = await Promise.all([minTime, loginRequest]);

          useUserStore.getState().login({
            user: {
              email: res.data.email,
              name: res.data.name,
              membershipGrade: res.data.membershipGrade,
            },
            accessToken: res.data.token,
          });
          navigate("/home");
        } catch (err) {
          console.error("카카오 로그인 실패:", err);
          alert(err.response?.data?.message || "카카오 로그인 실패");
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

export default KakaoCallback;