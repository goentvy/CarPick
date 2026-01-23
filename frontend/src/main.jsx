import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

import Home from './pages/Home'
import Profile from './pages/Profile'
import Intro from './pages/Intro/Intro.jsx'
import Aipick from './pages/Aipick/Aipick.jsx'

import CarDayList from "./pages/Car/CarDayList";
import CarMonthList from "./pages/Car/CarMonthList";
import CarDetailPage from "./pages/Car/CarDetailPage.jsx";

import CarpickZonePage from "./pages/Zone/CarpickZonePage.jsx";
import BranchDetailPage from "./pages/Zone/BranchDetailPage.jsx";

import Agree1 from "./pages/Agree/Agree1";
import Agree2 from "./pages/Agree/Agree2";

import Login from './pages/Login'
import KakaoCallback from './pages/Login/social/KakaoCallback.jsx'
import NaverCallback from './pages/Login/social/NaverCallback.jsx'
import FindIdPage from './pages/User/FindIdPage.jsx'
import ResetPasswordPage from './pages/User/ResetPasswordPage.jsx'
import SignupAgree from './pages/Signup/SignupAgree.jsx'
import SignupJoinus from './pages/Signup/SignupJoinus.jsx'
import SignupComplete from './pages/Signup/SignupComplete.jsx'

import GuestView from './pages/Reservation/Guest/GuestView.jsx'
import GuestCancel from './pages/Reservation/Guest/GuestCancel.jsx'
import GuestCancelComplete from './pages/Reservation/Guest/GuestCancelComplete.jsx'
import ReservationPage from './pages/Reservation/ReservationPage.jsx'
import GuestReservationDetail from './pages/Reservation/Guest/GuestReservationDetail.jsx'

import ProtectedRoute from "./components/ProtectedRoute";
import MyPageHome from "./pages/Mypage/MyPageHome.jsx";
import ProfilePage from './pages/Mypage/ProfilePage.jsx';
import ChangeHistoryPage from './pages/Mypage/ChangeHistoryPage.jsx';
import ReservationChangeDetail from "./pages/Mypage/ReservationChangeDetail";
import ReviewHistory from "./pages/Mypage/ReviewHistory.jsx";
import QnAlist from "./pages/Mypage/QnAlist.jsx";
import Favorites from "./pages/Mypage/Favorites.jsx";
import MyLicense from "./pages/Mypage/MyLicense.jsx";

import EventList from './pages/Event/EventList.jsx'
import EventView from './pages/Event/EventView.jsx'

import PaymentTestSection from './pages/Payment/PaymentTestSection.jsx'
import PaymentCallback from './pages/Payment/PaymentCallback.jsx'
import OrderFail from './pages/Payment/OrderFail.js'
import OrderComplete from './pages/Payment/OrderComplete.jsx'
import MockKakaoPayPage from './pages/Payment/MockKakaoPayPage.jsx'

import InquiryPage from './pages/Inquiry/Inquiry.jsx'
import InquirySuccess from './pages/Inquiry/InquirySuccess.jsx'
import InquiryPrivacy from './pages/Inquiry/InquiryPrivacy.jsx'
import Faq from './pages/Faq/Faq.jsx'

import Notice from './pages/Notice/Notice.jsx'
import NoticeDetail from './pages/Notice/NoticeDetail.jsx'

import Guide from './pages/Guide/Guide.jsx'
import GuideStep from './pages/Guide/GuideStep.jsx'

import EmergencyService from './pages/emergency/EmergencyService.jsx'

import About from './pages/About/About.jsx'

import ReservationsList from "./pages/Mypage/ReservationsList.jsx";
import ReservationDetail from "./pages/Mypage/ReservationDetail.jsx";

import YearPage from './pages/Car/YearPage.jsx'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* 기본 레이아웃 */}
        <Route path="/" element={<App />}>

          {/* 인트로 */}
          <Route index element={<Intro />} />

          {/* 메인 */}
          <Route path="home" element={<Home />} />
          <Route path="profile" element={<Profile />} />

          {/* AI PICK */}
          <Route path="aipick" element={<Aipick />} />

          {/* 차량 목록 */}
          <Route path="day" element={<CarDayList />} />
          <Route path="month" element={<CarMonthList />} />
          <Route path="year" element={<YearPage />} />
          <Route path="cars/detail/:specId" element={<CarDetailPage />} />

          {/* 카픽존 & 드롭존 */}
          <Route path="zone" element={<CarpickZonePage />} />
          <Route path="/zone/branch/:branchId" element={<BranchDetailPage />} />

          {/* 로그인 & 회원가입 */}
          <Route path="login" element={<Login />} />
          <Route path="/oauth/kakao/callback" element={<KakaoCallback />} />
          <Route path="/oauth/naver/callback" element={<NaverCallback />} />
          <Route path="findid" element={<FindIdPage />} />
          <Route path="resetpassword" element={<ResetPasswordPage />} />
          <Route path="signup/agree" element={<SignupAgree />} />
          <Route path="signup/joinus" element={<SignupJoinus />} />
          <Route path="signup/complete" element={<SignupComplete />} />

          <Route path="guest" element={<Outlet />}>
            <Route path="view" element={<GuestView />} />
            <Route path="cancel" element={<GuestCancel />} />
            <Route path="cancel/complete" element={<GuestCancelComplete />} />
            <Route path="reservation-detail" element={<GuestReservationDetail />} />
          </Route>
          {/* 예약 */}
          <Route path="reservation/:id" element={<ReservationPage />} />

          {/* 결제 */}
          <Route path="payment" element={<PaymentTestSection />} />
          <Route path="payment/callback/:provider" element={<PaymentCallback />} />
          <Route path="order/complete" element={<OrderComplete />} />
          <Route path="order/fail" element={<OrderFail />} />
          <Route path="mock/kakaopay/redirect" element={<MockKakaoPayPage />} />

          {/* 마이페이지 */}
          <Route path="mypage" element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
            <Route index element={<MyPageHome />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="reviewhistory" element={<ReviewHistory />} />
            <Route path="qna" element={<QnAlist />} />        {/* QnAlist → qna */}
            <Route path="favorites" element={<Favorites />} />
            <Route path="license" element={<MyLicense />} />
            <Route path="changeHistory" element={<ChangeHistoryPage />} />
            {/*  예약 내역 */}
            <Route path="reservations" element={<ReservationsList />} />
            <Route path="reservations/:reservationId/change" element={<ReservationChangeDetail />} />
            <Route path="reservations/:reservationId" element={<ReservationDetail />} />
          </Route>
          {/* 약관 */}
          <Route path="terms" element={<Agree1 />} />
          <Route path="privacy" element={<Agree2 />} />

          {/* 이벤트 */}
          <Route path="event/list" element={<EventList />} />
          <Route path="event/view/:id" element={<EventView />} />

          {/* 고객센터 */}
          <Route path="cs/inquiry" element={<InquiryPage />} />
          <Route path="cs/inquiry/success" element={<InquirySuccess />} />
          <Route path="cs/inquiry/privacy" element={<InquiryPrivacy />} />
          <Route path="cs/faq" element={<Faq />} />

          {/* 공지사항 */}
          <Route path="notice" element={<Notice />} />
          <Route path="notice/:id" element={<NoticeDetail />} />

          {/* 이용가이드 */}
          <Route path="guide" element={<Guide />} />
          <Route path="guide" element={<GuideStep />} />

          {/* 긴급지원서비스 */}
          <Route path="emergency" element={<EmergencyService />} />

          {/* 회사소개 */}
          <Route path="about" element={<About />} />

        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
