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

  // ✅ 핵심 1: StrictMode의 언마운트 시점에도 값을 잃지 않도록 
  // 컴포넌트 라이프사이클 밖의 ID를 추적합니다. (useRef보다 더 강력한 방어)
  const lastIdRef = useRef(null);

  useEffect(() => {
    // 💡 새로운 ID로 진입 시 화면 초기화 (화이트아웃 방지)
    if (lastIdRef.current !== id) {
        setNotice(null);
    }

    const loadData = async () => {
      // ✅ 핵심 2: StrictMode가 컴포넌트를 다시 죽였다 살려도 
      // 이미 이 ID로 호출 중이거나 완료했다면 즉시 차단합니다.
      if (lastIdRef.current === id) return;
      
      // 호출 시작과 동시에 현재 ID를 기록하여 두 번째 마운트의 진입을 막습니다.
      lastIdRef.current = id;

      try {
        console.log("실제 API 요청 보냄 (DB 조회수 +1):", id);
        const res = await fetchNoticeDetail(id);
        setNotice(res.data);
        window.scrollTo(0, 0);
      } catch (err) {
        console.error("데이터 로드 실패:", err);
        // 실패했을 때만 다시 시도할 수 있도록 ID 기록을 삭제합니다.
        lastIdRef.current = null;
      }
    };

    loadData();

    // ❌ 중요: return 클린업 함수에서 lastIdRef.current = null; 을 절대 하지 마세요!
    // 클린업에서 초기화하면 StrictMode가 재마운트할 때 방어막이 뚫립니다.
  }, [id]);

  if (!notice) return <div className="loading">로딩 중...</div>;

  return (
    <div className="notice-container-detail">
      <div className="notice-detail-header">
        <h2 className="notice-detail-title-header">공지사항📢</h2>
      </div>
      <div className="notice-detail-card">
        <div className="notice-detail-title">{notice.title}</div>
        <div className="notice-detail-info">
          <span>작성일: {notice.createdAt?.slice(0, 10)}</span>
          <span>조회수: {notice.views}</span>
        </div>
        <div className="notice-detail-content">{notice.content}</div>

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