import api from "./api";

/**
 * 공지사항 목록 (페이징 + 검색)
 * @param {number} page - 페이지 번호
 * @param {string} keyword - 검색어
 */
export const fetchNotices = (page = 0, keyword = "") => {
  // 1. 기본 파라미터를 객체로 구성합니다.
  const params = {
    page: page,
    size: 10,
  };

  // 2. keyword가 존재하고 공백이 아닐 때만 params에 추가합니다.
  // 이 처리가 없으면 서버로 '?keyword='가 전달되어 C001 에러를 유발할 수 있습니다.
  if (keyword && keyword.trim() !== "") {
    params.keyword = keyword;
  }

  // 3. 정제된 params를 사용하여 요청을 보냅니다.
  return api.get("/notice", { params });
};

// 공지사항 상세
export const fetchNoticeDetail = (id) => {
  return api.get(`/notice/${id}`);
};