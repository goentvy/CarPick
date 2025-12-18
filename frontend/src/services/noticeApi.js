import api from "./api";

// 공지사항 목록
export const fetchNotices = () => {
  return api.get("/api/notice");
};

// 공지사항 상세
export const fetchNoticeDetail = (id) => {
  return api.get(`/api/notice/${id}`);
};

// 조회수 증가
export const increaseNoticeView = (id) => {
  return api.post(`/api/notice/${id}/view`);
};
