import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import "../../styles/common.css"; 

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const openMenu = () => setMenuOpen(true);
  const closeMenu = () => setMenuOpen(false);
  const [activeMenu, setActiveMenu] = useState(null);

  const location = useLocation();
  useEffect(() => {
  if (location.pathname.includes("zone")) {
    setActiveMenu("카픽존");
  }else if (location.pathname.includes("/cs/")) {
    setActiveMenu("고객센터");
  }
}, [location.pathname]);

const handleToggleMenu = (menuName) => {
  setActiveMenu(activeMenu === menuName ? null : menuName);
};

  return (
    <>
      <header id="head" className="intro">
        <div className="inner">
          <div className="logo">
            <a href="/home"><img src="/images/common/logo_w.svg" alt="CarPick Logo" /></a>
          </div>
          <nav className="menu">
            <button onClick={openMenu} className="btn btn-link">
              <img src="/images/common/menu_w.svg" alt="CarPick Menu" />
            </button>
          </nav>
        </div>
      </header>

      {/* 메뉴 오버레이 영역 */}
      {menuOpen && (
        <div
          id="menuDim"
          className={menuOpen ? "active" : ""}
          onClick={closeMenu}
        ></div>
      )}
      
      {/* 사이드 메뉴 */}
      <aside id="navMenu" className={menuOpen ? "active" : ""}>
        <div className="inner">
          <div className="menu_top">
            <a href="/">
              <img src="/images/common/logo_b.svg" alt="CarPick Logo" />
            </a>
            <button className="btn btn-close" onClick={closeMenu}>
              <img src="/images/common/close.svg" alt="Menu Close" />
            </button>
          </div>

          <div className="member_info">
            {/* <h3><a href="/login" className="userName">홍길동</a>님 환영합니다!</h3>
            <button className="btn btn-mypage">마이페이지</button> */}
            <h3><Link to="/login" className="gnb-link userName" onClick={closeMenu}>로그인을 해주세요.</Link></h3>
            <Link to="/signup/agree" className="btn btn-mypage" onClick={closeMenu}>회원가입</Link>
          </div>

         <nav className="gnb">
            <ul className="gnb-list">
              
              <li className={`gnb-item ${location.pathname.includes("aipick") ? "active" : ""}`} onClick={closeMenu}>
                <Link to="/aipick" className="gnb-link">AI PICK</Link>
              </li>

              <li className={`gnb-item ${location.pathname.includes("day") ? "active" : ""}`} onClick={closeMenu}>
                <Link to="/day" className="gnb-link">단기렌트</Link>
              </li>

              <li className={`gnb-item ${location.pathname.includes("month") ? "active" : ""}`} onClick={closeMenu}>
                <Link to="/month" className="gnb-link">장기렌트</Link>
              </li>

              {/* 카픽존 */}
              <li className={`gnb-item has-submenu ${
                location.pathname.includes("zone") || activeMenu === "카픽존"
                  ? "active"
                  : ""
              }`}>
                <div className="submenu">
                  <button
                    className="gnb-link submenu-trigger"
                    onClick={() => handleToggleMenu("카픽존")}
                  >
                    카픽존
                  </button>

                  <ul className="submenu-list">
                    <li className="submenu-item">
                      <Link
                        to="/zone/picture"        // ← 원하는 경로로 변경!
                        className={`submenu-link ${location.pathname === "/zone/picture" ? "active" : ""}`}
                        onClick={closeMenu}
                      >
                        픽쳐카존
                      </Link>
                    </li>

                    <li className="submenu-item">
                      <Link
                        to="/zone/map"            // 원하는 경로
                        className={`submenu-link ${location.pathname === "/zone/map" ? "active" : ""}`}
                        onClick={closeMenu}
                      >
                        지도기반 검색
                      </Link>
                    </li>

                    <li className="submenu-item">
                      <Link
                        to="/zone/pickup"         // 원하는 경로
                        className={`submenu-link ${location.pathname === "/zone/pickup" ? "active" : ""}`}
                        onClick={closeMenu}
                      >
                        픽업안내
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>

              <li className={`gnb-item ${location.pathname.includes("guest") ? "active" : ""}`} onClick={closeMenu}>
                <Link to="/guest/view" className="gnb-link">예약조회</Link>
              </li>

              <li className={`gnb-item ${location.pathname.includes("event") ? "active" : ""}`} onClick={closeMenu}>
                <Link to="/event/list" className="gnb-link">이벤트</Link>
              </li>

              {/* 고객센터 */}
              <li className={`gnb-item has-submenu ${
                location.pathname.includes("/cs/") || activeMenu === "고객센터"
                  ? "active"
                  : ""
              }`}>
                <div className="submenu">
                  <button
                    className={`gnb-link submenu-trigger ${
                      location.pathname.includes("/cs/") || setActiveMenu === "고객센터"
                        ? "active"
                        : ""
                    }`}
                    onClick={() => handleToggleMenu("고객센터")}
                  >
                    고객센터
                  </button>

                  <ul className="submenu-list">

                    <li className="submenu-item">
                      <Link
                        to="/cs/faq"
                        className={`submenu-link ${location.pathname === "/cs/faq" ? "active" : ""}`}
                        onClick={closeMenu}
                      >
                        자주묻는질문
                      </Link>
                    </li>

                    <li className="submenu-item">
                      <Link
                        to="/cs/qna"
                        className={`submenu-link ${location.pathname === "/cs/qna" ? "active" : ""}`}
                        onClick={closeMenu}
                      >
                        일대일문의
                      </Link>
                    </li>

                    <li className="submenu-item">
                      <Link
                        to="/cs/notice"
                        className={`submenu-link ${location.pathname === "/cs/notice" ? "active" : ""}`}
                        onClick={closeMenu}
                      >
                        공지사항
                      </Link>
                    </li>

                    <li className="submenu-item">
                      <Link
                        to="/cs/company"
                        className={`submenu-link ${location.pathname === "/cs/company" ? "active" : ""}`}
                        onClick={closeMenu}
                      >
                        회사소개
                      </Link>
                    </li>

                    <li className="submenu-item">
                      <Link
                        to="/cs/guide"
                        className={`submenu-link ${location.pathname === "/cs/guide" ? "active" : ""}`}
                        onClick={closeMenu}
                      >
                        이용가이드
                      </Link>
                    </li>

                    <li className="submenu-item">
                      <Link
                        to="/cs/emergency"
                        className={`submenu-link ${location.pathname === "/cs/emergency" ? "active" : ""}`}
                        onClick={closeMenu}
                      >
                        긴급지원서비스
                      </Link>
                    </li>

                  </ul>
                </div>
              </li>

            </ul>
          </nav>

          <div className="menu_bottom">
            <a href="" className="btn btn-logout">로그아웃</a>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Header;
