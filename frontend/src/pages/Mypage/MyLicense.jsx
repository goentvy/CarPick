// src/pages/mypage/MyLicense.jsx
function MyLicense() {
    return (
        <div id="content">
            <div
                style={{
                    minHeight: "60vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "20px",
                }}
            >
                <div className="secAi">
                    <div className="ai_box">
                        <h2>면허 정보</h2>
                        <p>등록된 면허 정보가 없습니다.</p>
                        <button
                            style={{
                                marginTop: "20px",
                                padding: "12px 24px",
                                background: "#007bff",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                cursor: "pointer",
                            }}
                        >
                            면허 추가하기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyLicense;
