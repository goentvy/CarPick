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

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetchNoticeDetail(id);
        setNotice(res.data);
        window.scrollTo(0, 0); // 페이지 이동 시 최상단으로 스크롤
      } catch (err) {
        console.error("데이터 로드 실패:", err);
      }
    };
    loadData();
  }, [id]);

  if (!notice) return <div className="loading">로딩 중...</div>;

  return (
    <div className="notice-container-detail">
      <div className="notice-detail-header">
        <h2 className="notice-detail-title-header">공지사항📢</h2>
      </div>

      <div className="notice-detail-card">
        {/* 제목 섹션 */}
        <div className="notice-detail-title">{notice.title}</div>
        
        {/* 메타 정보 섹션 */}
        <div className="notice-detail-info">
          <span>작성일: {notice.createdAt?.slice(0, 10)}</span>
          <span>조회수: {notice.views}</span>
        </div>

        {/* 본문 섹션 */}
        <div className="notice-detail-content">{notice.content}</div>

        {/* ✅ 가독성을 높인 하단 네비게이션 (카드 내부로 이동) */}
        <div className="notice-bottom-nav">
          <div 
            className={`nav-row ${!notice.next ? 'disabled' : ''}`}
            onClick={() => notice.next && navigate(`/notice/${notice.next.id}?page=${page}&keyword=${keyword}`)}
          >
            <span className="nav-dir">다음글</span>
            <span className="nav-subject">{notice.next ? notice.next.title : "다음 글이 없습니다."}</span>
          </div>

          <div 
            className={`nav-row ${!notice.prev ? 'disabled' : ''}`} 
            onClick={() => notice.prev && navigate(`/notice/${notice.prev.id}?page=${page}&keyword=${keyword}`)}
          >
            <span className="nav-dir">이전글</span>
            <span className="nav-subject">{notice.prev ? notice.prev.title : "이전 글이 없습니다."}</span>
          </div>
          
        </div>

        {/* 목록 버튼 */}
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