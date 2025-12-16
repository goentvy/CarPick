// src/CarDetailPage.jsx
import { useState, useRef } from "react";
import "../components/CarDetailPage.css";

/**
 * 360도 차량 뷰어
 * - public/assets/car/car_01.png ~ car_36.png 기준
 */
function Car360Viewer() {
  const totalFrames = 36;
  const [frame, setFrame] = useState(1);
  const startX = useRef(null);

  const getClientX = (e) => {
    if ("touches" in e) return e.touches[0].clientX;
    return e.clientX;
  };

  const handleStart = (e) => {
    startX.current = getClientX(e);
  };

  const handleMove = (e) => {
    if (startX.current === null) return;

    const x = getClientX(e);
    const diff = x - startX.current;
    const step = Math.floor(diff / 8); // 8px 이동당 1프레임

    if (step !== 0) {
      startX.current = x;
      setFrame((prev) => {
        let next = prev + step;
        if (next < 1) next = totalFrames;
        if (next > totalFrames) next = 1;
        return next;
      });
    }
  };

  const handleEnd = () => {
    startX.current = null;
  };

  const src = `/assets/car/car_${String(frame).padStart(2, "0")}.png`;

  return (
    <div
      className="kp-viewer"
      onMouseDown={handleStart}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
    >
      <img src={src} alt="KaPick 차량 360 뷰" className="kp-viewer-img" />
      <div className="kp-viewer-hint">드래그해서 차량을 회전해보세요</div>
    </div>
  );
}

/**
 * 카픽 차량 상세 페이지
 */
export default function CarDetailPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="kp-page">
      {/* 상단 헤더 */}
      <header className="kp-header">
        <div className="kp-header-inner">
          <div className="kp-logo">KaPick</div>
          <nav className="kp-breadcrumb">
            <span>홈</span>
            <span className="kp-breadcrumb-sep">›</span>
            <span>서울역 카픽존</span>
            <span className="kp-breadcrumb-sep">›</span>
            <span className="kp-breadcrumb-current">차량 상세</span>
          </nav>
        </div>
      </header>

      <main className="kp-main">
        {/* 차량 기본 정보 카드 */}
        <section className="kp-card kp-hero-card">
          <div className="kp-badge-row">
            <span className="kp-badge kp-badge-primary">단기 렌트</span>
            <span className="kp-badge kp-badge-subtle">카픽존 픽업</span>
          </div>

          <h1 className="kp-car-title">
            아반떼 AD 가솔린 모던
          </h1>
          <p className="kp-car-subtitle">
            서울역 카픽존 · 24시간 무인 픽업 · 만 26세 이상
          </p>

          <div className="kp-rating-row">
            <span className="kp-rating-score">4.8</span>
            <span className="kp-rating-stars">★★★★★</span>
            <span className="kp-rating-count">후기 128개</span>
          </div>

          <div className="kp-tag-row">
            <span className="kp-tag">연식 2023</span>
            <span className="kp-tag">완전자차</span>
            <span className="kp-tag">내비게이션</span>
            <span className="kp-tag">블랙박스</span>
          </div>
        </section>

        {/* 360 뷰어 + 작은 컨트롤 */}
        <section className="kp-card">
          <div className="kp-section-header">
            <div>
              <h2 className="kp-section-title">360° 실사 뷰</h2>
              <p className="kp-section-desc">
                실 촬영 이미지를 기반으로 차량 외관 상태를 확인할 수 있어요.
              </p>
            </div>
            <div className="kp-section-meta">
              <span className="kp-dot" />
              <span>카픽존 인증 차량</span>
            </div>
          </div>

          <Car360Viewer />

          <div className="kp-viewer-tabs">
            <button className="kp-viewer-tab kp-viewer-tab-active">
              외관
            </button>
            <button className="kp-viewer-tab" disabled>
              실내 (준비 중)
            </button>
          </div>
        </section>

        {/* 가격/예약 카드 */}
        <section className="kp-card kp-price-card">
          <div className="kp-price-left">
            <span className="kp-price-label">오늘 · 24시간 기준</span>
            <div className="kp-price-main">
              <span className="kp-price-value">89,000</span>
              <span className="kp-price-unit">원</span>
            </div>
            <div className="kp-price-detail-row">
              <span className="kp-price-detail">
                기본 요금 79,000원
              </span>
              <span className="kp-price-detail">
                보험 10,000원
              </span>
            </div>
          </div>

          <div className="kp-price-right">
            <button className="kp-btn kp-btn-primary">
              바로 예약하기
            </button>
            <button className="kp-btn kp-btn-ghost">
              다른 날짜 보기
            </button>
            <p className="kp-price-notice">
              결제 전까지 요금이 변동될 수 있어요.
            </p>
          </div>
        </section>

        {/* 탭 영역: 개요 / 차량정보 / 후기 / 카픽존 안내 */}
        <section className="kp-card">
          <div className="kp-tab-list">
            <button
              className={
                "kp-tab" + (activeTab === "overview" ? " kp-tab-active" : "")
              }
              onClick={() => setActiveTab("overview")}
            >
              개요
            </button>
            <button
              className={
                "kp-tab" + (activeTab === "specs" ? " kp-tab-active" : "")
              }
              onClick={() => setActiveTab("specs")}
            >
              차량 정보
            </button>
            <button
              className={
                "kp-tab" + (activeTab === "reviews" ? " kp-tab-active" : "")
              }
              onClick={() => setActiveTab("reviews")}
            >
              이용 후기
            </button>
            <button
              className={
                "kp-tab" + (activeTab === "zone" ? " kp-tab-active" : "")
              }
              onClick={() => setActiveTab("zone")}
            >
              카픽존 안내
            </button>
          </div>

          <div className="kp-tab-panel">
            {activeTab === "overview" && (
              <div className="kp-tab-section">
                <h3>이 차량, 이런 분께 추천드려요</h3>
                <ul className="kp-bullet-list">
                  <li>서울 도심 위주의 1~2인 여행</li>
                  <li>주차·골목 진입이 편한 준중형 차량이 필요한 경우</li>
                  <li>비용은 아끼되, 연식과 안전 옵션은 포기하기 싫을 때</li>
                </ul>
                <p className="kp-text-muted">
                  카픽은 도착지 기준으로 가장 실용적인 차량을 추천해
                  드립니다. 이 차량은 서울역/용산/KTX 연계 고객에게 인기가
                  높아요.
                </p>
              </div>
            )}

            {activeTab === "specs" && (
              <div className="kp-tab-section kp-spec-grid">
                <div>
                  <span className="kp-spec-label">차종</span>
                  <span className="kp-spec-value">준중형 / 아반떼 AD</span>
                </div>
                <div>
                  <span className="kp-spec-label">연료</span>
                  <span className="kp-spec-value">가솔린</span>
                </div>
                <div>
                  <span className="kp-spec-label">정원</span>
                  <span className="kp-spec-value">5인승</span>
                </div>
                <div>
                  <span className="kp-spec-label">변속기</span>
                  <span className="kp-spec-value">오토</span>
                </div>
                <div>
                  <span className="kp-spec-label">연식</span>
                  <span className="kp-spec-value">2023년식</span>
                </div>
                <div>
                  <span className="kp-spec-label">주행거리</span>
                  <span className="kp-spec-value">3만 km 이하</span>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="kp-tab-section">
                <div className="kp-review-summary">
                  <div className="kp-review-score">4.8</div>
                  <div>
                    <div className="kp-review-stars">★★★★★</div>
                    <div className="kp-review-count">128개의 이용 후기</div>
                  </div>
                </div>

                <div className="kp-review-item">
                  <div className="kp-review-header">
                    <span className="kp-review-name">g****</span>
                    <span className="kp-review-badge">서울역 카픽존</span>
                  </div>
                  <div className="kp-review-stars">★★★★★</div>
                  <p className="kp-review-text">
                    새벽 KTX 도착이라 걱정했는데, 카픽존 안내대로 바로
                    찾을 수 있었어요. 360 뷰로 미리 외관 상태를 보고 와서
                    안심됐습니다.
                  </p>
                  <span className="kp-review-date">2025.11.23 이용</span>
                </div>

                <button className="kp-btn kp-btn-ghost kp-btn-full">
                  후기 127개 더 보기
                </button>
              </div>
            )}

            {activeTab === "zone" && (
              <div className="kp-tab-section">
                <h3>서울역 카픽존은 이렇게 이용해요</h3>
                <ol className="kp-ordered-list">
                  <li>서울역 도착 후, 카픽 앱에서 "픽업 시작" 버튼을 눌러요.</li>
                  <li>앱에 표시된 지도를 따라 카픽존 주차구역으로 이동해요.</li>
                  <li>360° 실사 이미지와 실제 차량 번호를 한 번 더 확인해요.</li>
                  <li>앱에서 무인 차량 문 열기 → 바로 출발!</li>
                </ol>
                <p className="kp-text-muted">
                  카픽존은 모든 차량을 사전에 촬영·기록하고 있어, 차량
                  상태에 대한 분쟁을 최소화합니다.  
                  360° 이미지와 실제 차량이 다를 경우, 즉시 고객센터에서
                  대응해 드려요.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* 신뢰/카픽존 설명 카드 */}
        <section className="kp-card kp-trust-card">
          <h2 className="kp-section-title">KaPick Zone 360° 디스플레이</h2>
          <p className="kp-text">
            카픽은 단순히 차를 빌려주는 것을 넘어서,{" "}
            <strong>“도착 후 첫 10분의 스트레스”</strong>를 줄이는 데
            집중합니다.
          </p>
          <ul className="kp-bullet-list">
            <li>실제 차량 기준 360° 촬영·기록</li>
            <li>픽업 시점 기준 외관 상태를 미리 확인 가능</li>
            <li>반납 후에도 동일 기준으로 기록되어 분쟁 최소화</li>
          </ul>
          <p className="kp-text-muted">
            이 페이지는 카픽 브랜드의 신뢰 UX를 보여주는 포트폴리오용
            상세 페이지 예시입니다.
          </p>
        </section>
      </main>
    </div>
  );
}
