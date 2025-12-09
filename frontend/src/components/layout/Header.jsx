import React, { useState } from "react";
import "../../styles/common.css"; 

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const openMenu = () => setMenuOpen(true);
  const closeMenu = () => setMenuOpen(false);

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

          <nav className="menu_list">
            <ul>
              <li><a href="">AI PICK</a></li>
              <li><a href="">단기렌트</a></li>
              <li><a href="">장기렌트</a></li>
              <li><a href="">카픽존</a></li>
              <li><a href="">예약조회</a></li>
              <li><a href="">이벤트</a></li>
              <li><a href="">고객센터</a></li>
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
