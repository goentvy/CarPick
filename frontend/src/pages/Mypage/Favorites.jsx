// src/pages/mypage/Favorites.jsx
function Favorites() {
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
                        <h2>선호 차량</h2>
                        <p>선호차량 목록이 비어있습니다.</p>
                        <p>관심있거나 선호하는 차량을 추가해보세요!</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Favorites;
