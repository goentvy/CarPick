import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { fetchNoticeDetail } from "@/services/noticeApi";
import "@/styles/notice.css";

export default function NoticeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [notice, setNotice] = useState(null);
  
  // ✅ 중복 실행 방지용 플래그
  const isFetched = useRef(false);

  const page = params.get("page") || 1;
  const keyword = params.get("keyword") || "";

  useEffect(() => {
    // 1. 이미 호출이 시작되었다면 즉시 차단 (StrictMode 대응)
    if (isFetched.current) return;
    
    // 2. 호출 시작 직전에 즉시 true로 변경 (비동기 완료를 기다리지 않음)
    isFetched.current = true;

    const loadData = async () => {
      try {
        const res = await fetchNoticeDetail(id);
        setNotice(res.data);
      } catch (err) {
        console.error("데이터 로드 실패:", err);
        // 에러 발생 시 재시도가 필요하다면 다시 false로 바꿀 수 있음
        isFetched.current = false;
      }
    };

    loadData();
  }, [id]);

  if (!notice) return <div className="loading">로딩중...</div>;

  return (
    <div className="notice-container-detail">
      <h2 className="notice-detail-title-header">공지사항</h2>
      <div className="notice-detail-card">
        <div className="notice-detail-title">{notice.title}</div>
        <div className="notice-detail-info">
          <span>작성일: {notice.createdAt?.slice(0, 10)}</span>
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