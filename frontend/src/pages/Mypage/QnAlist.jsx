// src/pages/mypage/QnAlist.jsx
function QnAlist() {
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
                        <h2>1:1 문의 내역</h2>
                        <p>문의 내역이 비어있습니다.</p>
                        <p>문의하기 버튼을 통해 문의해주세요!</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default QnAlist;
