import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Home from './pages/Home'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Intro from './pages/Intro'
import CarDetailPage from "./pages/CarDetailPage";
import Agree1 from "./pages/Agree/Agree1";
import Agree2 from "./pages/Agree/Agree2";


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
          <Route path="login" element={<Login />} />
          <Route path="profile" element={<Profile />} />
          <Route path="detail" element={<CarDetailPage />} />

          {/* 이용약관 & 개인정보취급약관 */}
          <Route path="agree1" element={<Agree1 />} />
          <Route path="agree2" element={<Agree2 />} />

        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
