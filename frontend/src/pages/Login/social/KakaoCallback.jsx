import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import useUserStore from "../../../store/useUserStore";

const KakaoCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    if (code) {
      api.post("/auth/login/kakao", { code })
        .then((res) => {
          // JWT 및 사용자 정보 저장
          useUserStore.getState().login({
            user: {
              email: res.data.email,
              name: res.data.name,
              membershipGrade: res.data.membershipGrade,
            },
            accessToken: res.data.token,
          });
          navigate("/home"); // 로그인 후 메인으로 이동
        })
        .catch((err) => {
          console.error("카카오 로그인 실패:", err);
          alert("카카오 로그인 실패");
          navigate("/login");
        });
    }
  }, [navigate]);

  return <p>카카오 로그인 처리중...</p>;
};

export default KakaoCallback;
