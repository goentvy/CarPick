// src/pages/Notice/Notice.jsx (공지사항 목록)
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import "@/styles/notice.css";

export default function Notice() {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    fetchNotices();
  }, [page]);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/notice", {
        params: { page: page - 1, keyword },
      });
      setNotices(res.data);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="notice-container">
      <div className="notice-list-header">
        <h2 className="notice-title">공지사항</h2>
      </div>

      <div className="search-container">
        <div className="search-input-wrapper">
          <input
            className="search-input"
            placeholder="검색어를 입력하세요"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <span className="search-icon" onClick={fetchNotices}>🔍</span>
        </div>
      </div>

      <table className={`notice-table ${loading ? "loading" : ""}`}>
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          {notices.map((n) => (
            <tr key={n.id}>
              <td>{n.id}</td>
              <td
                className="notice-subject"
                onClick={() => navigate(`/notice/${n.id}`)}
              >
                {n.title}
              </td>
              <td>{n.createdAt?.slice(0, 10)}</td>
            </tr>
          ))}
        </tbody>
      </table>

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
