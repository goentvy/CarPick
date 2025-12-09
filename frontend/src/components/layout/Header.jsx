import React, { useState } from "react";
import "../../styles/common.css"; 

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const openMenu = () => setMenuOpen(true);
  const closeMenu = () => setMenuOpen(false);
  const [activeMenu, setActiveMenu] = useState(null);

  const handleToggle = (menuName) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  return (
    <>
      <header id="head" className="intro">
        <div className="inner">
          <div className="logo">
            <a href="/"><img src="/images/common/logo_w.svg" alt="CarPick Logo" /></a>
          </div>
          <nav className="menu">
            <button onClick={openMenu} className="btn btn-link">
              <img src="/images/common/menu_w.svg" alt="CarPick Menu" />
            </button>
          </nav>
        </div>
      </header>

      {/* dim 영역 */}
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
            <h3><span className="userName">홍길동</span>님 환영합니다!</h3>
            <button className="btn btn-mypage">마이페이지</button>
          </div>

         <nav className="gnb">
          <ul className="gnb-list">
            
            <li className="gnb-item">
              <a href="" className="gnb-link">AI PICK</a>
            </li>

            <li className="gnb-item">
              <a href="" className="gnb-link">단기렌트</a>
            </li>

            <li className="gnb-item">
              <a href="" className="gnb-link">장기렌트</a>
            </li>

            {/* 카픽존 */}
            <li className={`gnb-item has-submenu ${activeMenu === "카픽존" ? "active" : ""}`}>
              <div className="submenu">
                <button
                  className="gnb-link submenu-trigger"
                  onClick={() => handleToggle("카픽존")}
                >
                  카픽존
                </button>

                <ul className="submenu-list">
                  <li className="submenu-item">
                    <a href="" className="submenu-link">픽쳐카존</a>
                  </li>
                  <li className="submenu-item">
                    <a href="" className="submenu-link">지도기반 검색</a>
                  </li>
                  <li className="submenu-item">
                    <a href="" className="submenu-link">픽업안내</a>
                  </li>
                </ul>
              </div>
            </li>

            <li className="gnb-item">
              <a href="" className="gnb-link">예약조회</a>
            </li>

            <li className="gnb-item">
              <a href="" className="gnb-link">이벤트</a>
            </li>

            {/* 고객센터 */}
            <li className={`gnb-item has-submenu ${activeMenu === "고객센터" ? "active" : ""}`}>
              <div className="submenu">
                <button
                  className="gnb-link submenu-trigger"
                  onClick={() => handleToggle("고객센터")}
                >
                  고객센터
                </button>

                <ul className="submenu-list">
                  <li className="submenu-item"><a href="" className="submenu-link">자주묻는질문</a></li>
                  <li className="submenu-item"><a href="" className="submenu-link">일대일문의</a></li>
                  <li className="submenu-item"><a href="" className="submenu-link">공지사항</a></li>
                  <li className="submenu-item"><a href="" className="submenu-link">회사소개</a></li>
                  <li className="submenu-item"><a href="" className="submenu-link">이용가이드</a></li>
                  <li className="submenu-item"><a href="" className="submenu-link">긴급지원서비스</a></li>
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
