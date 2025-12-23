import api from "./api";

// 공지사항 목록 (페이징 + 검색)
export const fetchNotices = (page = 0, keyword = "") => {
  return api.get("/api/notice/page", {
    params: { page, size: 9, keyword },
  });
};

// 공지사항 상세 (조회수는 백엔드에서 자동 증가)
export const fetchNoticeDetail = (id) => {
  return api.get(`/api/notice/${id}`);
};
