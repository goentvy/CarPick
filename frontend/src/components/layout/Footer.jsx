// src/components/layout/Footer.jsx
import { Link, useNavigate, useLocation } from "react-router-dom";
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
                    <Link to="/day"
                        className={`btn btn_car ${location.pathname.includes("day") ? "active" : ""
                            }`}
                    >
                        <span>단기·월 렌트</span>
                    </Link>
                    <Link to="/month"
                        className={`btn btn_cal ${location.pathname.includes("month") ? "active" : ""
                            }`}
                        onClick={handleMyPageClick}
                    >
                        <span>장기렌트</span>
                    </Link>
                    <Link to="/zone"
                        className={`btn btn_ai ${location.pathname.includes("zone") ? "active" : ""
                            }`}
                    >
                        <span>카픽존</span>
                    </Link>
                    <button
                        className={`btn btn_my ${location.pathname.includes("my") ? "active" : ""
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
