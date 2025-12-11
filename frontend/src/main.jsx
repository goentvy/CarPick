import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Intro from './pages/Intro'
import CarDetailPage from "./pages/CarDetailPage";
import Agree1 from "./pages/Agree/Agree1";
import Agree2 from "./pages/Agree/Agree2";

import Login from './pages/Login'
import FindIdPage from './pages/User/FindIdPage.jsx'
import ResetPasswordPage from './pages/User/ResetPasswordPage.jsx'
import SignupAgree from './pages/Signup/SignupAgree.jsx'
import SignupJoinus from './pages/Signup/SignupJoinus.jsx'
import SignupComplete from './pages/Signup/SignupComplete.jsx'

import GuestView from './pages/Reservation/Guest/GuestView.jsx'
import GuestCancel from './pages/Reservation/Guest/GuestCancel.jsx'
import GuestCancelComplete from './pages/Reservation/Guest/GuestCancelComplete.jsx'
import ReservationPage from './pages/Reservation/ReservationPage.jsx'

import MyPageHome from "./pages/mypage/MyPageHome.jsx";
import ChangeHistoryPage from './pages/mypage/ChangeHistoryPage.jsx';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* 기본 레이아웃 */}
        <Route path="/" element={<App />}>
          {/* 인트로 */}
          <Route index element={<Intro />} />

          {/* 메인 */}
          <Route path="home" element={<Home />}/>
          <Route path="profile" element={<Profile />} />
          <Route path="detail" element={<CarDetailPage />} />

          {/* 로그인 & 회원가입 */}
          <Route path="login" element={<Login />} />
          <Route path="findid" element={<FindIdPage />} />
          <Route path="resetpassword" element={<ResetPasswordPage />} />
          <Route path="signup/agree" element={<SignupAgree />} />
          <Route path="signup/joinus" element={<SignupJoinus />} />
          <Route path="signup/complete" element={<SignupComplete />} />

          {/* 비회원 예약 조회/취소 */}
          <Route path="guest/view" element={<GuestView />} />
          <Route path="guest/cancel" element={<GuestCancel />} />
          <Route path="guest/cancel/complete" element={<GuestCancelComplete />} />

          {/* 예약하기 */}
          <Route path="reservation" element={<ReservationPage />} />

          {/* 마이페이지 */}
          <Route path="mypage" element={<MyPageHome />} />
          {/* 마이페이지 - 취소/변경 내역 */}
          <Route path="mypage/change-history" element={<ChangeHistoryPage />} />

          {/* 이용약관 & 개인정보취급약관 */}
          <Route path="agree1" element={<Agree1 />} />
          <Route path="agree2" element={<Agree2 />} />

        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
