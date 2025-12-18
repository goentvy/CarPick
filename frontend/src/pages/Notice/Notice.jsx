import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/notice-common.css";
import "../../styles/notice.css";

export default function Notice() {
  const [notices, setNotices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/notices")
      .then((res) => res.json())
      .then((data) => setNotices(data))
      .catch((err) => console.error("공지사항 목록 불러오기 실패:", err));
  }, []);

  return (
    <div className="notice-wrapper">
      <h2 className="notice-title">공지사항</h2>

      <div className="notice-list">
        {notices.map((item) => (
          <div
            key={item.id}
            className="notice-item"
            onClick={() => navigate(`/notice/${item.id}`)}
          >
            <div className="notice-item-title">{item.title}</div>

            <div className="notice-item-meta">
              <span>{new Date(item.createdAt).toLocaleDateString("ko-KR")}</span>
              <span>조회수 {item.viewCount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
