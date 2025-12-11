// src/pages/mypage/MyPageHome.jsx
import { useNavigate } from "react-router-dom";

function MyPageHome() {
    const navigate = useNavigate();

    // 공통 버튼 스타일-- 임시 스타일 버튼 구분용
    const btnStyle = {
        width: "100%",
        padding: "12px 16px",
        marginBottom: "8px",
        borderRadius: "8px",
        border: "1px solid var(--gray-200)",
        backgroundColor: "#fff",
        textAlign: "left",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: 500,
    };


    return (
        <div id="content">
            <div
                className="secAi"
                style={{
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "10px",
                }}
            >
                <div className="ai_box">
                    <p id="reason">마이페이지</p>
                </div>
            </div>

            <div className="carAi">
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    <li>
                        <button
                            type="button"
                            style={btnStyle}
                            onClick={() => navigate("/mypage/")}
                        >
                            개인정보 수정
                        </button>
                    </li>
                    <li>
                        <button
                            type="button"
                            style={btnStyle}
                            onClick={() => navigate("/mypage/")}
                        >
                            예약 내역
                        </button>
                    </li>
                    <li>
                        <button
                            type="button"
                            style={btnStyle}
                            onClick={() => navigate("/mypage/change-history")}
                        >
                            취소 · 변경 내역
                        </button>
                    </li>
                    <li>
                        <button
                            type="button"
                            style={btnStyle}
                            onClick={() => navigate("/mypage/reviewhistory")}
                        >
                            리뷰 내역
                        </button>
                    </li>
                    <li>
                        <button
                            type="button"
                            style={btnStyle}
                            onClick={() => navigate("/mypage/qna")}
                        >
                            문의 내역
                        </button>
                    </li>
                    <li>
                        <button
                            type="button"
                            style={btnStyle}
                            onClick={() => navigate("/mypage/license")}
                        >
                            면허 정보 관리
                        </button>
                    </li>
                    <li>
                        <button
                            type="button"
                            style={btnStyle}
                            onClick={() => navigate("/mypage/favorites")}
                        >
                            선호 차량
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
}
export default MyPageHome;
