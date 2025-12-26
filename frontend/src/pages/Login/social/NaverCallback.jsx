import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import useUserStore from "../../../store/useUserStore";

const NaverCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    const receivedState = url.searchParams.get("state");
    const originalState = sessionStorage.getItem("naver_state");

    // ✅ 중복 호출 방지 + state 검증
    if (code && receivedState === originalState && sessionStorage.getItem("usedCode") !== code) {
      sessionStorage.setItem("usedCode", code);

      (async () => {
        try {
          const res = await api.post("/auth/login/naver", { code, state: receivedState });

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
          }
        } catch (err) {
          console.error("네이버 로그인 실패:", err);
          alert("네이버 로그인 중 오류가 발생했습니다.");
          navigate("/login");
        }
      })();
    }
  }, [navigate]);

  return <p>네이버 로그인 처리중...</p>;
};

export default NaverCallback;
