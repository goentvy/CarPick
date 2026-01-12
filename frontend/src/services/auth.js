import axios from "axios";

const API_BASE = "/api/auth";

/**
 * 로그인 요청
 * @param {string} email
 * @param {string} password
 * @returns {Promise<LoginResponse>}
 */
export async function login(email, password) {
  const res = await axios.post(`${API_BASE}/login`, { email, password });
  return res.data;
}

/**
 * 회원가입 요청
 * @param {object} formData - SignupRequest DTO와 동일한 구조
 * @returns {Promise<SignupResponse>}
 */
export async function signup(formData) {
  const res = await axios.post(`${API_BASE}/signup`, formData);
  return res.data;
}

/**
 * 최근 가입한 사용자 조회 (테스트용)
 * @returns {Promise<User>}
 */
export async function signupTest() {
  const res = await axios.get(`${API_BASE}/signuptest`);
  return res.data;
}

/**
 * 로그인 테스트 (GET 방식)
 * @param {string} email
 * @param {string} password
 * @returns {Promise<LoginResponse>}
 */
export async function loginTest(email, password) {
  const res = await axios.get(`${API_BASE}/logintest`, {
    params: { email, password },
  });
  return res.data;
}

/**
 * 이메일 중복 확인 (GET 방식)
 * @param {string} email
 * @returns {Promise<boolean>} 중복이면 true, 아니면 false
 */
export async function checkEmail(email) {
  // 백엔드 컨트롤러: @GetMapping("/check-email") -> { isDuplicate: true/false } 반환
  const res = await axios.get(`${API_BASE}/check-email`, {
    params: { email },
  });
  return res.data.isDuplicate;
}