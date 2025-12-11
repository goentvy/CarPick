// src/pages/mypage/ReviewHistory.jsx
function ReviewHistory() {
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
                        <h2>리뷰 내역</h2>
                        <p>리뷰 내역이 비어있습니다.</p>
                        <p>첫 리뷰를 작성해보세요!</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReviewHistory;
