import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchNotices } from "@/services/noticeApi";
import "@/styles/notice.css";

export default function Notice() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const initialKeyword = searchParams.get("keyword") || "";

  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [keyword, setKeyword] = useState(initialKeyword);
  const [activeKeyword, setActiveKeyword] = useState(initialKeyword);

  // 1. 데이터 로딩 함수 (keyword 대신 activeKeyword 사용)
  const loadNotices = async () => {
    setLoading(true);
    try {
      const res = await fetchNotices(page - 1, activeKeyword);
      setNotices(res.data.content || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("공지사항 로딩 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSearchParams({ page, keyword: activeKeyword });
    loadNotices();
  }, [page, activeKeyword]);

  const handleSearch = () => {
    setPage(1);
    setActiveKeyword(keyword);
  };

  const handleClickNotice = (id) => {
    // 상세 페이지로 이동 시 현재 정보를 쿼리 스트링으로 전달
    navigate(`/notice/${id}?page=${page}&keyword=${activeKeyword}`);
  };  

  return (
    <div className="notice-container">
      <h2 className="notice-title">공지사항 📢</h2>

      {/* 검색 */}
      <div className="search-container">
        <div className="search-input-wrapper">
          <button className="search-icon" onClick={handleSearch}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
          <input
            className="search-input"
            placeholder="검색어를 입력하세요"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button className="search-icon" onClick={handleSearch}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
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
          {(notices || []).map((n, index) => {
            // 1페이지이면서 상위 3개 항목인지 확인
            const isNew = page === 1 && index < 3;

            return (
              <tr key={n.id} className={isNew ? "recent-notice-row" : ""}>
                <td className="notice-id-column">
                  <span className="notice-badge">공지</span>
                </td>

                <td>
                  <span
                    className={`notice-subject ${isNew ? "bold-text" : ""}`}
                    onClick={() => handleClickNotice(n.id)}
                  >
                    {n.title}
                    {/* 아이콘이 항상 제목 끝에 붙어 있도록 함 */}
                    {isNew && (
                      <span style={{ whiteSpace: 'nowrap' }}>
                        &nbsp;{/* 공백 한 칸 추가 */}
                        <span className="new-icon-badge">N</span>
                      </span>
                    )}
                  </span>
                </td>

                <td className={isNew ? "bold-text" : ""}>
                  {n.createdAt?.slice(0, 10)}
                </td>
              </tr>
            );
          })}
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
