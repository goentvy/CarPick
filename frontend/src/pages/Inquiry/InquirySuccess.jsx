import { useLocation, useNavigate } from "react-router-dom";

export default function InquirySuccess() {
  const navigate = useNavigate();
  const { state } = useLocation();

  return (
    <div className="page-wrapper">
      <div className="inquiry-container">
        <h2>문의가 등록되었습니다</h2>

        <p style={{ textAlign: "center", margin: "20px 0" }}>
          빠른 시일 내에 답변드리겠습니다.
        </p>

        <button
          className="btn-primary"
          onClick={() => navigate("/mypage/qna")}
        >
          내 문의내역 보기
        </button>
      </div>
    </div>
  );
}
