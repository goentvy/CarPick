import api from "./api";
// src/services/auth.js

// ❗ axios 직접 사용 금지
// → 인터셉터(Authorization 자동첨부)가 적용된 api 인스턴스만 사용



const API_BASE = "/auth";

/* =====================================================
   ✅ 로그인
   ===================================================== */

export async function login(email, password) {
  // 공개 API — 토큰 필요 없음
  const res = await api.post(`${API_BASE}/login`, {
    email,
    password,
  });

  return res.data;
}

/* =====================================================
   ✅ 회원가입
   ===================================================== */

export async function signup(formData) {
  const res = await api.post(`${API_BASE}/signup`, formData);
  return res.data;
}

/* =====================================================
   ✅ 최근 가입 사용자 조회 (테스트)
   ===================================================== */

export async function signupTest() {
  const res = await api.get(`${API_BASE}/signuptest`);
  return res.data;
}

/* =====================================================
   ✅ 로그인 테스트 (GET)
   ===================================================== */

export async function loginTest(email, password) {
  const res = await api.get(`${API_BASE}/logintest`, {
    params: {
      email,
      password,
    },
  });

  return res.data;
}

/* =====================================================
   ✅ 이메일 중복 확인
   ===================================================== */

export async function checkEmail(email) {
  const res = await api.get(`${API_BASE}/check-email`, {
    params: { email },
  });

  return res.data.isDuplicate;
}
