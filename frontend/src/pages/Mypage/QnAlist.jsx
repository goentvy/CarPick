// src/pages/mypage/QnAlist.jsx
import { useNavigate } from "react-router-dom";

function QnAlist() {
    const navigate = useNavigate();

    return (
        <div
            id="content"
            className="font-pretendard"
            style={{
                minHeight: "calc(100vh - 80px - 72px)",
                backgroundColor: "#E7EEFF",
            }}
        >
            {/* 상단 바 */}
            <div className="px-4 py-4" style={{ backgroundColor: "#2C7FFF" }}>
                <p className="text-sm text-white font-semibold">1:1 문의 내역</p>
            </div>

            {/* 빈 상태 카드 */}
            <div className="px-4 py-6">
                <div className="bg-white rounded-2xl shadow-sm px-5 py-10 flex flex-col items-center justify-center text-center">
                    <h2 className="text-base font-semibold text-[#1A1A1A] mb-2">
                        아직 등록된 문의가 없어요
                    </h2>
                    <p className="text-sm text-[#666666] mb-6">
                        궁금한 점이 있다면
                        <br />
                        1:1 문의를 통해 빠르게 답변을 받아보세요.
                    </p>
                    <button
                        type="button"
                        onClick={() => navigate("/qna/new")}
                        className="h-11 px-6 rounded-xl bg-[#2C7FFF] text-white text-sm font-medium shadow-sm"
                    >
                        1:1 문의하기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default QnAlist;
