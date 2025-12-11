import { useLocation, useNavigate } from "react-router-dom";
const Home = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const segment = location.state?.segment || "정보 없음";
    const reason = location.state?.reason || "추천 이유를 불러올 수 없습니다.";

    return (
        <div id="content">
            <div className="secAi">
                <div className="ai_box">
                    {/* Intro에서 가져온 추천 이유 표시 */}
                    <p id="reason">{reason}</p>
                    <button
                        type="button"
                        id="btn_reastart"
                        className="btn"
                        onClick={() => navigate("/")}
                    >
                        다시고르기
                    </button>
                </div>
            </div>
            <div className="carAi">
                {/* 추천 세그먼트 표시 */}
                result.segment는 {segment} 입니다.
            </div>
        </div>
    );
};

export default Home;