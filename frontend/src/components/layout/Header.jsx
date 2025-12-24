import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useUserStore from "../../store/useUserStore";

import "../../styles/common.css"; 

function Header() {
  const navigate = useNavigate();

  // zustand 전역상태 로그인 정보 및 로그아웃
  const { user, isLoggedIn } = useUserStore();
  const logout = useUserStore((state) => state.logout);

  const openMenu = () => setMenuOpen(true);
  const closeMenu = () => setMenuOpen(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  // const location = useLocation();
  // const hideOnDetail =
  //   location.pathname.startsWith("/car/") || 
  //   location.pathname.startsWith("/cars/") || 
  //   location.pathname.includes("/detail");     

  // if (hideOnDetail) return null;
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

// 로그아웃 핸들링
const handleLogout = () => {
  // zustand store 초기화
  logout();
  // localStorage 토큰 삭제
  localStorage.removeItem("user-storage");
  // 로그인 페이지로 이동
  navigate("/login");
  // 사이드메뉴 닫기
  closeMenu();
}

  return (
    <>
      <header id="head" className="intro">
        <div className="inner">
          <div className="logo">
            <Link to="/home"><img src="/images/common/logo_w.svg" alt="CarPick Logo" /></Link>
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
            <Link to="/">
              <img src="/images/common/logo_b.svg" alt="CarPick Logo" />
            </Link>
            <button className="btn btn-close" onClick={closeMenu}>
              <img src="/images/common/close.svg" alt="Menu Close" />
            </button>
          </div>

          {/* 로그인 상태 및 마이페이지, 회원가입 버튼 */}
          <div className="member_info">
            <h3>
              {isLoggedIn ? 
                <span>{user?.name ?? ""}님 환영합니다.</span>
              : 
                <Link to="/login" className="gnb-link userName" onClick={closeMenu}>로그인을 해주세요.</Link>
              }
            </h3>
              {isLoggedIn ? 
                <Link to="/mypage" className="btn btn-mypage" onClick={closeMenu}>마이페이지</Link>
              : 
                <Link to="/signup/agree" className="btn btn-mypage" onClick={closeMenu}>회원가입</Link>
              }
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
                        to="/cs/inquiry"
                        className={`submenu-link ${location.pathname === "/cs/inquiry" ? "active" : ""}`}
                        onClick={closeMenu}
                      >
                        일대일문의
                      </Link>
                    </li>

                    <li className="submenu-item">
                      <Link
                        to="/notice"
                        className={`submenu-link ${location.pathname === "/notice" ? "active" : ""}`}
                        onClick={closeMenu}
                      >
                        공지사항
                      </Link>
                    </li>

                    <li className="submenu-item">
                      <Link
                        to="/about"
                        className={`submenu-link ${location.pathname === "/about" ? "active" : ""}`}
                        onClick={closeMenu}
                      >
                        회사소개
                      </Link>
                    </li>

                    <li className="submenu-item">
                      <Link
                        to="/guide"
                        className={`submenu-link ${location.pathname === "/guide" ? "active" : ""}`}
                        onClick={closeMenu}
                      >
                        이용가이드
                      </Link>
                    </li>

                    <li className="submenu-item">
                      <Link
                        to="/emergency"
                        className={`submenu-link ${location.pathname === "/emergency" ? "active" : ""}`}
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
            {isLoggedIn && (
              <span className="btn btn-logout cursor-pointer" onClick={handleLogout}>
                로그아웃 
              </span>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

export default Header;
