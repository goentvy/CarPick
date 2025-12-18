import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/notice-common.css";
import "../../styles/notice-detail.css";

export default function NoticeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    fetch(`/api/notices/${id}`)
      .then(res => res.json())
      .then(data => setNotice(data))
      .catch(err => console.error("공지사항 상세 불러오기 실패:", err));
  }, [id]);

  if (!notice) return <div className="notice-wrapper">로딩중...</div>;

  return (
    <div className="notice-detail-wrapper">
      <h2 className="notice-detail-title">{notice.title}</h2>

      <div className="notice-detail-meta">
        <span>{new Date(notice.createdAt).toLocaleString("ko-KR")}</span>
        <span>조회수 {notice.viewCount}</span>
      </div>

      <div className="notice-detail-content">
        {notice.content}
      </div>

      <button className="notice-back" onClick={() => navigate("/notice")}>
        목록으로
      </button>
    </div>
  );
}
