import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useUserStore from "../../store/useUserStore";

import "../../styles/common.css";
import { div } from "framer-motion/client";

function Header() {
  const navigate = useNavigate();

  // zustand 전역상태 로그인 정보 및 로그아웃
  const { user, isLoggedIn } = useUserStore();
  const logout = useUserStore((state) => state.logout);

  const openMenu = () => setMenuOpen(true);
  const closeMenu = () => setMenuOpen(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);


  useEffect(() => {
    if (location.pathname.includes("zone")) {
      setActiveMenu("카픽존");
    } else if (location.pathname.includes("/cs/")) {
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

  // ============================
  // ✅ 관리자 페이지 이동 (🔥 수정 완료)
  // ============================
  const moveToAdminPage = () => {

    // ❗ 토큰을 URL로 보내지 않는다 (보안 + 인증 깨짐 원인)
    // ❗ Authorization 헤더는 axios interceptor가 자동 처리

    const adminUrl =
      window.location.hostname === "localhost"
        ? "http://localhost:8080"
        : "https://admin.carpick.p-e.kr";

    // ✅ 그냥 관리자 페이지로 이동만 한다
    window.location.href = `${adminUrl}/`;
  };

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
            <Link to="/home" onClick={closeMenu}>
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
                <Link to="/mypage/profile" className="gnb-link userName" onClick={closeMenu}>{user?.name ?? ""}님 환영합니다.</Link>
                :
                <Link to="/login" className="gnb-link userName" onClick={closeMenu}>로그인을 해주세요.</Link>
              }
            </h3>
            {isLoggedIn ? (

              user?.role === "ADMIN" ? (
                // ✅ 관리자 로그인 시
                <button
                  className="btn btn-admin"
                  onClick={() => {
                    moveToAdminPage();
                    closeMenu();
                  }}
                >
                  관리자페이지
                </button>

              ) : (
                // ✅ 일반 사용자 로그인 시
                <Link to="/mypage" className="btn btn-mypage" onClick={closeMenu}>마이페이지</Link>
              )
            ) : (
              // 비로그인 상태
              <Link to="/signup/agree" className="btn btn-mypage" onClick={closeMenu}>회원가입</Link>
            )}
          </div>

          <nav className="gnb">
            <ul className="gnb-list">

              <li className={`gnb-item ${location.pathname.includes("about") ? "active" : ""}`} onClick={closeMenu}>
                {/* <Link to="/aipick" className="gnb-link">AI PICK</Link> */}
                <Link to="/about" className="gnb-link">회사소개</Link>
              </li>

              <li className={`gnb-item ${location.pathname.includes("day") ? "active" : ""}`} onClick={closeMenu}>
                <Link to="/day" className="gnb-link">단기·월 렌트</Link>
              </li>

              <li className={`gnb-item ${location.pathname.includes("year") ? "active" : ""}`} onClick={closeMenu}>
                <Link to="/year" className="gnb-link">장기렌트</Link>
              </li>

              {/* 카픽존 */}
              <li className={`gnb-item  ${location.pathname.includes("zone") ? "active" : ""}`} onClick={closeMenu}>
                <div className="submenu">
                  <Link to="/zone" className="gnb-link submenu-trigger" >카픽존</Link>
                </div>
              </li>

              <li className={`gnb-item ${location.pathname.includes("guest") ? "active" : ""}`} onClick={closeMenu}>
                {isLoggedIn ?
                  <Link to="/mypage/reservations" className="gnb-link">예약조회</Link>
                  :
                  <Link to="/guest/view" className="gnb-link">예약조회</Link>
                }
              </li>

              <li className={`gnb-item ${location.pathname.includes("event") ? "active" : ""}`} onClick={closeMenu}>
                <Link to="/event/list" className="gnb-link">이벤트</Link>
              </li>

              {/* 고객센터 */}
              <li className={`gnb-item has-submenu ${location.pathname.includes("/cs/") || activeMenu === "고객센터"
                ? "active"
                : ""
                }`}>
                <div className="submenu">
                  <button
                    className={`gnb-link submenu-trigger ${location.pathname.includes("/cs/") || setActiveMenu === "고객센터"
                      ? "active"
                      : ""
                      }`}
                    onClick={() => handleToggleMenu("고객센터")}
                  >

                    {!(location.pathname.includes("/cs/") || activeMenu === "고객센터") ?
                      <img src="/images/common/arrow_up.svg" alt="" /> :  // 클릭 전: 위 화살표
                      <img src="/images/common/arrow_down.svg" alt="" />   // 클릭 후: 아래 화살표
                    }
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

          <div className=" menu_bottom ">
            {isLoggedIn && (
              <div className="h-[50px] bg-[#1D6BF3] flex items-center justify-center">
                <span className="btn btn-logout cursor-pointer text-white" onClick={handleLogout}>
                  로그아웃
                </span>
              </div>
            )}
          </div>
        </div>

      </aside>

      <div className="fixedAI">
        <Link to="/aipick"
          className="btn btn_aipick"
        >
          <span>✦AI</span><br />상담
        </Link>
      </div>
    </>
  );
}

export default Header;
