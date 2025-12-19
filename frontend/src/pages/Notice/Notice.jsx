import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchNotices } from "@/services/noticeApi";
import "@/styles/notice.css";

export default function Notice() {
  const [notices, setNotices] = useState([]);
  const navigate = useNavigate();

  const loadNotices = async () => {
    setLoading(true);
    try {
      const res = await fetchNotices(page - 1, keyword);
      setNotices(res.data.content || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("공지사항 로딩 실패:", err);
      setNotices([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotices();
  }, [page, keyword]);

  const handleSearch = () => {
    setPage(1);
    loadNotices();
  };

  const handleClickNotice = (id) => {
    navigate(`/notice/${id}?page=${page}&keyword=${keyword}`);
  };

  return (
    <div className="notice-container">
      <h2 className="notice-title">공지사항</h2>

      {/* 검색 */}
      <div className="search-container">
        <input
          className="search-input"
          placeholder="검색어를 입력하세요"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button className="search-btn" onClick={handleSearch}>🔍</button>
      </div>

      {/* 공지사항 테이블 */}
      <table className={`notice-table ${loading ? "loading" : ""}`}>
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          {(notices || []).map((n) => (
            <tr key={n.id}>
              <td>{n.id}</td>
              <td
                className="notice-subject"
                onClick={() => handleClickNotice(n.id)}
              >
                {n.title}
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
