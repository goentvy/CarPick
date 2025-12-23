import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { fetchNoticeDetail } from "@/services/noticeApi";
import "@/styles/notice.css";

export default function NoticeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [notice, setNotice] = useState(null);

  const page = params.get("page") || 1;
  const keyword = params.get("keyword") || "";

  useEffect(() => {
    fetchNoticeDetail(id)
      .then((res) => setNotice(res.data))
      .catch(console.error);
  }, [id]);

  if (!notice) return <div>로딩중...</div>;

  return (
    <div className="notice-container-detail">
      <h2 className="notice-detail-title-header">공지사항</h2>

      <div className="notice-detail-card">
        <div className="notice-detail-title">{notice.title}</div>

        <div className="notice-detail-info">
          <span>작성일: {notice.createdAt?.slice(0, 9)}</span>
          <span>조회수: {notice.views}</span>
        </div>

        <div className="notice-detail-content">{notice.content}</div>

        <button
          onClick={() => navigate(`/notice?page=${page}&keyword=${keyword}`)}
          className="btn-list"
        >
          목록으로
        </button>
      </div>
    </div>
  );
}
