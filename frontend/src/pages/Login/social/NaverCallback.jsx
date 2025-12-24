import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import useUserStore from "../../../store/useUserStore";

const NaverCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    if (code && state) {
      api.post("/auth/login/naver", { code, state })
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
          navigate("/home");
        })
        .catch((err) => {
          console.error("네이버 로그인 실패:", err);
          alert("네이버 로그인 실패");
          navigate("/login");
        });
    }
  }, [navigate]);

  return <p>네이버 로그인 처리중...</p>;
};

export default NaverCallback;
