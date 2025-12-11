// src/pages/mypage/ChangeHistoryPage.jsx

function ChangeHistoryPage() {
    const items = [];      // 나중에 실제 데이터로 교체

    // const loading = false; // 나중에 로딩 상태로 교체

    /*  if (loading) {
        return (
            <div id="content">
                <div
                    style={{
                        minHeight: "60vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    취소/변경 내역을 불러오는 중입니다...
                </div>
            </div>
        );
    }
    */
    if (items.length === 0) {
        return (
            <div id="content">
                <div
                    style={{
                        minHeight: "60vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    취소/변경 내역이 없습니다.
                </div>
            </div>
        );
    }

    return (
        <div id="content">
            <div className="secAi">
                <div className="ai_box">
                    <p id="reason">최근 취소 / 변경 내역입니다.</p>
                </div>
            </div>

            <div className="carAi">
                <h2>취소 / 변경 내역</h2>
                <ul>
                    {items.map((item) => (
                        <li key={item.id}>
                            예약번호 {item.reservationCode}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default ChangeHistoryPage;
