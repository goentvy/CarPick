// src/components/layout/Footer.jsx
import { useNavigate, useLocation } from "react-router-dom";
import useUserStore from "../../store/useUserStore";

const Footer = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { accessToken } = useUserStore();   // 🔹 store에서 바로 읽기

    const handleMyPageClick = () => {
        if (accessToken) {
            navigate("/mypage");
        } else {
            navigate("/login");
        }
    };

    return (
        <div id="footer">
            <div className="inner">
                <div className="btns">
                    <button
                        type="button"
                        className={`btn btn_ai ${
                            location.pathname.includes("aipick") ? "active" : ""
                        }`}
                    >
                        <span>AI PICK</span>
                    </button>
                    <button
                        type="button"
                        className={`btn btn_car ${
                            location.pathname.includes("day") ? "active" : ""
                        }`}
                    >
                        <span>단기렌트</span>
                    </button>
                    <button
                        type="button"
                        className={`btn btn_cal ${
                            location.pathname.includes("month") ? "active" : ""
                        }`}
                    >
                        <span>장기렌트</span>
                    </button>
                    <button
                        type="button"
                        className={`btn btn_my ${
                            location.pathname.includes("my") ? "active" : ""
                        }`}
                        onClick={handleMyPageClick}
                    >
                        <span>마이페이지</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Footer;
