import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import useUserStore from "../../../store/useUserStore";

const KakaoCallback = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    console.log("카카오 code: ", code);

    if (code && sessionStorage.getItem("usedCode") !== code) {
      sessionStorage.setItem("usedCode", code);

      (async () => {
        try {
          setLoading(true);
          const res = await api.post("/auth/login/kakao", { code });

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
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [navigate]);

  return (
    <div>
      {loading && <p>카카오 로그인 처리중...</p>}
    </div>
  );
};

export default KakaoCallback;
