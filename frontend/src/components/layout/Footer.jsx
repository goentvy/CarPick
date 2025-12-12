import { useNavigate } from "react-router-dom";

const Footer = () => {
    const navigate = useNavigate();
    // 활성화 시 클래스명 'active' 추가

    //임시용 마이페이지 로그인 검증
    const handleMyPageClick = () => {
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

        if (isLoggedIn) {
            navigate("/mypage");
        } else {
            navigate("/login");
        }
    };

    return (
        <button id="footer">
            <button className="inner">
                <div className="btns">
                    <button type="button" className={`btn btn_ai ${location.pathname.includes("aipick") ? "active" : ""}`}><span>AI PICK</span></button>
                    <button type="button" className={`btn btn_car ${location.pathname.includes("day") ? "active" : ""}`}><span>단기렌트</span></button>
                    <button type="button" className={`btn btn_cal ${location.pathname.includes("month") ? "active" : ""}`}><span>장기렌트</span></button>
                    <button type="button" className={`btn btn_my ${location.pathname.includes("my") ? "active" : ""}`}  onClick={handleMyPageClick}><span>마이페이지</span></button>
                </div>
            </button>
        </button>
    );
};

export default Footer;