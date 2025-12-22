import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

import Home from './pages/Home'
import Profile from './pages/Profile'
import Intro from './pages/Intro/Intro.jsx'

import CarList from "./pages/Car/CarList";
import CarDetailPage from "./pages/Car/CarDetailPage.jsx";

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

import MyPageHome from "./pages/Mypage/MyPageHome.jsx";
import ChangeHistoryPage from './pages/Mypage/ChangeHistoryPage.jsx';
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

          {/* 차량 목록 */}
          <Route path="car/list" element={<CarList />} />
          <Route path="car/detail" element={<CarDetailPage />} />

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

          {/* 예약 */}
          <Route path="reservation" element={<ReservationPage />} />

          {/* 결제 */}
          <Route path="payment" element={<PaymentTestSection />} />
          <Route path="payment/callback/:provider" element={<PaymentCallback />} />
          <Route path="order/complete" element={<OrderComplete />} />
          <Route path="order/fail" element={<OrderFail />} />
          <Route path="mock/kakaopay/redirect" element={<MockKakaoPayPage />} />

          {/* 마이페이지 */}
          <Route path="mypage" element={<MyPageHome />} />
          <Route path="mypage/reviewhistory" element={<ReviewHistory />} />
          <Route path="mypage/qna" element={<QnAlist />} />
          <Route path="mypage/favorites" element={<Favorites />} />
          <Route path="mypage/license" element={<MyLicense />} />
          <Route path="mypage/change-history" element={<ChangeHistoryPage />} />

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

        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
