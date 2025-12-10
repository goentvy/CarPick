# 프로젝트 소개

CarPick은 AI 기능을 탑재한 렌트카 서비스를 제공하는 웹 애플리케이션입니다.

프론트엔드와 백엔드가 분리된 구조로 개발하며, 협업을 위해 명확한 브랜치 전략을 사용합니다.

# 팀프로젝트 기술스택

## Frontend

- **Framework**: React + Vite
- **Language**: JavaScript (ES6+)
- **UI Library**: TailwindCSS
- **State Management**: React Query / Zustand
- **Build Tool**: Vite

```text
frontend/
├── public/                # 정적 파일 (favicon, robots.txt 등)
├── src/
│   ├── assets/            # 이미지, 아이콘, 폰트 등 정적 리소스
│   ├── components/        # 재사용 가능한 UI 컴포넌트
│   │   ├── common/        # 버튼, 모달, 입력창 등 범용 컴포넌트
│   │   └── layout/        # Header, Footer, Sidebar 등 레이아웃 컴포넌트
│   ├── pages/             # 라우트 단위 페이지 컴포넌트
│   │   ├── Home/
│   │   ├── CarList/
│   │   ├── CarDetail/
│   │   ├── Reservation/
│   │   └── User/
│   ├── hooks/             # 커스텀 훅 (React Query, Zustand 활용)
│   ├── store/             # Zustand 상태 관리 (전역 상태)
│   ├── services/          # API 호출 로직 (axios, fetch 등)
│   │   ├── carService.js
│   │   ├── userService.js
│   │   └── reservationService.js
│   ├── utils/             # 유틸 함수 (날짜 포맷, 가격 계산 등)
│   ├── styles/            # Tailwind 설정 및 글로벌 스타일
│   ├── router/            # React Router 설정
│   ├── config/            # 환경변수, 설정 파일
│   ├── App.jsx            # 루트 컴포넌트
│   └── main.jsx           # 진입점 (Vite)
├── .env                   # 환경변수 (API URL 등)
├── vite.config.js         # Vite 설정
├── package.json
└── tailwind.config.js     # Tailwind 설정
```

**구조 설계 포인트**

- `components` **vs** `pages`
→ `components`는 재사용 가능한 UI 단위, `pages`는 라우트 단위 화면으로 구분.
예: `CarCard`는 `components/common/`에, `CarListPage`는 `pages/CarList/`에 위치.
- `services`
→ API 호출 로직을 모듈화해 백엔드와의 통신을 관리. React Query와 결합해 데이터 fetching 최적화.
- `store`
→ Zustand로 전역 상태 관리. 로그인 상태, 예약 상태 등 공유 데이터 저장.
- `hooks`
→ React Query 커스텀 훅(`useCars`, `useReservation`) 등 데이터 fetching 로직을 분리.
- `router`
→ 라우팅을 중앙에서 관리. 페이지 이동과 권한 체크를 일관성 있게 처리.
- `utils`
→ 날짜 포맷, 가격 계산, validation 등 공통 로직을 모듈화.