import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Intro from './pages/Intro/Intro.jsx'
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

import InquiryPage from './pages/Inquiry/Inquiry.jsx'
import InquirySuccess from './pages/Inquiry/InquiryPrivacy.jsx'
import InquiryPrivacy from './pages/Inquiry/InquiryPrivacy.jsx'
import MockKakaoPayPage from './pages/Payment/MockKakaoPayPage.jsx'

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

          {/* 결제서비스 */}
          <Route path="payment" element={<PaymentTestSection />} />
          <Route path="payment/callback/:provider" element={<PaymentCallback />} />
          <Route path="order/complete" element={<OrderComplete />} />
          <Route path="order/fail" element={<OrderFail />} />
          <Route path="/mock/kakaopay/redirect" element={<MockKakaoPayPage />} />
          
          {/* 마이페이지 */}
          <Route path="mypage" element={<MyPageHome />} />
          <Route path="mypage/reviewhistory" element={<ReviewHistory />} />
          <Route path="mypage/qna" element={<QnAlist />} />
          <Route path="mypage/favorites" element={<Favorites />} />
          <Route path="mypage/license" element={<MyLicense />} />
          <Route path="mypage/change-history" element={<ChangeHistoryPage />} />

          {/* 이용약관 & 개인정보취급약관 */}
          <Route path="agree1" element={<Agree1 />} />
          <Route path="agree2" element={<Agree2 />} />

          {/* 이벤트 */}
          <Route path="event/list" element={<EventList />} />
          <Route path="event/view/:id" element={<EventView />} />

          {/* 일대일문의 */}
          <Route path="cs/inquiry" element={<InquiryPage />} />
          <Route path="cs/inquiry/success" element={<InquirySuccess />} />
          <Route path="cs/inquiry/privacy" element={<InquiryPrivacy />} />

        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
