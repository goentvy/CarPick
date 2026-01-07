import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchNotices } from "@/services/noticeApi";
import "@/styles/notice.css";

export default function Notice() {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [activeKeyword, setActiveKeyword] = useState("");

  // 1. 데이터 로딩 함수 (keyword 대신 activeKeyword 사용)
  const loadNotices = async () => {
    setLoading(true);
    try {
      const res = await fetchNotices(page - 1, activeKeyword); // ✅
      setNotices(res.data.content || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("공지사항 로딩 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotices();
  }, [page, activeKeyword]);

  const handleSearch = () => {
    setPage(1); // 페이지 리셋
    setActiveKeyword(keyword); // ✅ 여기서 검색어를 확정 지으면 useEffect가 실행됨
  };

  const handleClickNotice = (id) => {
    navigate(`/notice/${id}?page=${page}&keyword=${activeKeyword}`);
  };

  return (
    <div className="notice-container">
      <h2 className="notice-title">공지사항 📢</h2>

      {/* 검색 */}
      <div className="search-container">
        <div className="search-input-wrapper">
          <input
            className="search-input"
            placeholder="검색어를 입력하세요"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button className="search-icon" onClick={handleSearch}>🔍</button>
        </div>
      </div>


      {/* 공지사항 테이블 */}
      <table className={`notice-table ${loading ? "loading" : ""}`}>
        <colgroup>
          <col width="100" />
          <col />
          <col width="120" />
        </colgroup>
        <thead>
          <tr>
            <th>No.</th>
            <th>제목</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          {(notices || []).map((n) => (
            <tr key={n.id}>
              <td className="notice-id-column">
                <span className="notice-badge">공지</span>
              </td>

              <td>
                <span
                  className="notice-subject"
                  onClick={() => handleClickNotice(n.id)}
                >
                  {n.title}
                </span>
              </td>

              <td>{n.createdAt?.slice(0, 10)}</td>
            </tr>

          ))}
        </tbody>
      </table>

      {/* 버튼형 페이징 */}
      <div className="pagination">
        <button
          className="pagination-btn"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          이전
        </button>

        <div className="pagination-pages">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`pagination-page ${page === i + 1 ? "active" : ""}`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <button
          className="pagination-btn"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          다음
        </button>
      </div>
    </div>
  );
}
