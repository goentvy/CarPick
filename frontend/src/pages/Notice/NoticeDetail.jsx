import { useEffect, useState, useRef } from "react";
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
  const lastIdRef = useRef(null);

  useEffect(() => {
    if (lastIdRef.current !== id) {
      setNotice(null);
    }

    const loadData = async () => {
      if (lastIdRef.current === id) return;
      lastIdRef.current = id;

      try {
        const res = await fetchNoticeDetail(id);
        setNotice(res.data);
        window.scrollTo(0, 0);
      } catch (err) {
        console.error("데이터 로드 실패:", err);
        lastIdRef.current = null;
      }
    };

    loadData();
  }, [id]);

  if (!notice) return <div className="loading"></div>;

  return (
    <div className="notice-container-detail">
      <div className="notice-detail-header">
        <h2 className="notice-detail-title-header">공지사항 📢</h2>
      </div>
      <div className="notice-detail-card">
        {/* 본문 제목 부분에도 N 아이콘이 필요하다면 추가 가능 */}
        <div className="notice-detail-title">
          {notice.title}
          {(notice.isNew || notice.new) && <span className="new-icon-badge">N</span>}
        </div>

        <div className="notice-detail-info">
          <span>작성일: {notice.createdAt?.slice(0, 10)}</span>
          <span>조회수: {notice.views}</span>
        </div>
        <div className="notice-detail-content">{notice.content}</div>

        {/* 하단 네비게이션 영역 */}
        <div className="notice-bottom-nav">
          {/* 다음글 */}
          <div
            className={`nav-row ${!notice.next ? 'disabled' : ''}`}
            onClick={() => notice.next && navigate(`/notice/${notice.next.id}?page=${page}&keyword=${keyword}`)}
          >
            <span className="nav-dir">다음글</span>
            {/* 💡 n.next.id가 특정 값 이상이거나, API에 필드가 생기면 n.next.isNew로 조건 부여 */}
            {/* 다음글 텍스트 두께 조건 수정 */}
            <span className={`nav-subject ${(notice.next?.isNew || notice.next?.new) ? "bold-text" : ""}`}>
              {notice.next ? notice.next.title : "다음 글이 없습니다."}
              {(notice.next?.isNew || notice.next?.new) && <span className="new-icon-badge">N</span>}
            </span>
          </div>

          {/* 이전글 */}
          <div
            className={`nav-row ${!notice.prev ? 'disabled' : ''}`}
            onClick={() => notice.prev && navigate(`/notice/${notice.prev.id}?page=${page}&keyword=${keyword}`)}
          >
            <span className="nav-dir">이전글</span>
            <span className={`nav-subject ${notice.prev?.isNew ? "bold-text" : ""}`}>
              {notice.prev ? notice.prev.title : "이전 글이 없습니다."}
              {(notice.prev?.isNew || notice.prev?.new) && <span className="new-icon-badge">N</span>}
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            // 현재 들고 있는 page와 keyword를 그대로 쿼리 스트링에 담아 이동
            const queryString = `?page=${page}&keyword=${encodeURIComponent(keyword)}`;
            navigate(`/notice${queryString}`);
          }}
          className="btn-list"
        >
          목록으로
        </button>
      </div>
    </div>
  );
}