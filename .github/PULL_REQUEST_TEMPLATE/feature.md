## 📌 PR 제목
[dev-이주환] → dev : DB설계

---

## 📝 작업 개요
- 어떤 목적의 작업인지 한 줄 요약  
  예: 프론트엔드 UI 수정 및 DB 설계 반영

---

## 🔧 주요 변경 사항
| 유형       | 설명 |
|------------|------|
| 기능 추가   | 로그인 UIUX 구현 |
| 신규 컴포넌트/모듈 추가  | `frontend/src/components/index.jsx` 컴포넌트 추가 |
| UI 수정     | `App.jsx`에 AI Pick 관련 텍스트 추가 |
| DB 설계     | `mariadb`에 `users_table` 생성 예정 |
| API 연동    | `/login` API 연동 확인 |
| 기타        | 코드 정리 및 주석 추가 등 |

---

## 🧪 테스트 체크리스트
- [x] 로컬 빌드 및 실행 확인
- [x] 주요 기능 정상 동작 확인
- [x] 단위 테스트 통과
- [x] 통합 테스트 통과
- [ ] mariadb 연결 및 데이터 조회 확인

---

## 🔍 리뷰어 참고 사항
- [ ] `App.jsx`의 텍스트 위치 및 구조가 적절한지 확인
- [ ] `index.html`의 `<title>` 변경이 SEO나 UX에 영향 없는지 검토
- [x] 향후 DB 설계 방향에 대해 의견 필요

---

## 📎 관련 정보
- 🔗 관련 이슈: #123
- 📁 변경 파일: `frontend/src/components/index.jsx`, `frontend/src/App.jsx`
- 🗂️ 브랜치: `dev-이주환`
- 🧠 참고: frontend CORS 문제 해결 예정

---

## 🚀 다음 작업 예정
- [ ] mariadb에 users 테이블 생성 및 정책 설정
- [ ] 로그인 CRUD API 연동
- [ ] 프론트엔드 로그인 컴포넌트 구현
