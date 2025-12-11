
const Footer = () => {
    // 활성화 시 클래스명 'active' 추가
    return (
        <div id="footer">
            <div className="inner">
                <div className="btns">
                    <button type="button" className={`btn btn_ai ${location.pathname.includes("aipick") ? "active" : ""}`}><span>AI PICK</span></button>
                    <button type="button" className={`btn btn_car ${location.pathname.includes("day") ? "active" : ""}`}><span>단기렌트</span></button>
                    <button type="button" className={`btn btn_cal ${location.pathname.includes("month") ? "active" : ""}`}><span>장기렌트</span></button>
                    <button type="button" className={`btn btn_my ${location.pathname.includes("my") ? "active" : ""}`}><span>마이페이지</span></button>
                </div>
            </div>
        </div>
    );
};

export default Footer;