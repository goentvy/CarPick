import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/yearPage.css';

const YearPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 섹션 4를 위한 상태 추가
  const [activeService, setActiveService] = useState(null);

  const managementServices = [
    {
      title: "대차 서비스",
      img: "/images/sub/rent/anotherKey.png",
      desc: "수리 기간 동안 고객님의 일상은 멈추지 마세요. \n내 차처럼 편안하고 깨끗한 대차 차량을 즉시 준비해 드립니다."
    },
    {
      title: "Pick-UP 서비스",
      img: "/images/sub/rent/pickup.png",
      desc: "계신 곳 어디든 저희가 직접 찾아갑니다. \n바쁜 일상 속 서비스 센터 방문의 번거로움 없이 완벽한 정비를 경험해 보세요."
    },
    {
      title: "긴급 서비스",
      img: "/images/sub/rent/emergency.png",
      desc: "365일 24시간, 예상치 못한 상황에서도 당황하지 마세요.\n고객님이 계신 곳으로 가장 빠르게 달려가겠습니다.\n(*우측상단 긴급지원서비스 페이지 참고*)"
    },
    {
      title: "정기점검",
      img: "/images/sub/rent/regularInspection.png",
      desc: "더 오래, 더 안전하게. 보이지 않는 곳까지 꼼꼼하게 살피는 전문가의 진단으로 당신의 완벽한 드라이빙을 약속합니다."
    }
  ];

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/rent/year/details`)
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("데이터 로딩 실패:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading-container">데이터 로딩 중...</div>;

  return (
    <div className="year-container">
      <div className="content-wrapper">
        {/* 톤앤매너를 맞춘 헤더 섹션 */}
        <section className="guide-header-style">
          <h2 className="guide-main-title">장기렌트</h2>
        </section>

        {/* 섹션 01: 장점 */}
        <section className="guide-card">
          <div className="guide-card-header">
            <div className="header-left">
              <span className="step-badge">1</span>
              <h3>CarP!ck의 장점</h3>
            </div>
          </div>

          <div className="advantage-icon-grid">
            {/* 장점 1 */}
            <div className="adv-card">
              <div className="adv-img-box">
                <img src="/images/sub/rent/price.png" alt="합리적 가격" />
              </div>
              <h4>합리적인 가격의 기준</h4>
              <p>데이터 기반 최저가 비교로 유통 거품을 뺀 <br />정직한 견적과 절세 효과 제공</p>
            </div>

            {/* 장점 2 */}
            <div className="adv-card">
              <div className="adv-img-box">
                <img src="/images/sub/rent/care.png" alt="1:1 맞춤 케어" />
              </div>
              <h4>1:1 맞춤 케어</h4>
              <p>전문 매니저가 차량 선정부터 서류 심사까지 모든 번거로운 과정 밀착 지원</p>
            </div>

            {/* 장점 3 */}
            <div className="adv-card">
              <div className="adv-img-box">
                <img src="/images/sub/rent/repair.png" alt="차량 관리" />
              </div>
              <h4>신뢰 기반 차량 관리</h4>
              <p>정기 점검부터 사고 시 대차까지 모든 차량 <br />유지관리 전 과정 지원</p>
            </div>
          </div>
        </section>

        {/* 섹션 02: 계약 조건 */}
        <InfoCard title="계약조건" badge="2" items={data.conditions} />

        {/* 섹션 03: 보험보상 */}
        <InfoCard title="보험보상한도" badge="3" items={data.insurance} />

        {/* 섹션 04: 차량관리 서비스 */}
        <section className="guide-card">
          <div className="guide-card-header">
            <div className="header-left">
              <span className="step-badge">4</span>
              <h3>차량관리 서비스</h3>
            </div>
            <button className="detail-link-btn" onClick={() => navigate('/emergency')}>
              긴급지원서비스 ❯
            </button>
          </div>

          <div className="service-accordion-grid">
            {managementServices.map((s, i) => (
              <div key={i} className="service-item-wrapper">
                <div
                  className={`service-mini-tag ${activeService === i ? 'active' : ''}`}
                  onClick={() => setActiveService(activeService === i ? null : i)}
                >
                  {s.title}
                </div>

                {/* 선택된 경우 펼쳐지는 상세 영역 */}
                <div className={`service-detail-content ${activeService === i ? 'show' : ''}`}>
                  <div className="detail-inner">
                    <img src={s.img} alt={s.title} className="service-img" />
                    <p className="service-desc-text">{s.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 섹션 05: 이용절차 */}
        <section className="guide-card">
          <div className="guide-card-header">
            <div className="header-left">
              <span className="step-badge">5</span>
              <h3>이용절차</h3>
            </div>
            <button className="detail-link-btn" onClick={() => navigate('/guide')}>
              이용가이드  ❯
            </button>
          </div>
          {/* 가로형 타임라인 컨테이너 */}
          <div className="horizontal-process">
            {[
              { step: "1", title: "견적요청", desc: "홈페이지 또는 전화로 견적요청" },
              { step: "2", title: "상담", desc: "영업사원과 상담 및 심사" },
              { step: "3", title: "계약", desc: "구비서류 제출 및 계약서 작성" },
              { step: "4", title: "차량인도", desc: "원하는 시간 및 장소로 인도" },
              { step: "5", title: "차량이용", desc: "월 대여료 납입 및 서비스 이용" },
              { step: "6", title: "계약종료", desc: "차량 반납 및 신차 재계약" }
            ].map((item, i) => (
              <div key={i} className="h-process-item">
                <div className="h-step-circle">{item.step}</div>
                <div className="h-step-info">
                  <strong>{item.title}</strong>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          {/* 추가된 데스크탑용 빠른 견적문의 버튼 (641px 이상 노출) */}
          <div className="desktop-estimate-btn-container">
            <button className="desktop-estimate-btn" onClick={() => navigate('/aipick')}>
              <i className="fa fa-robot"></i>
              <span>빠른 견적문의</span>
              <i className="fa fa-chevron-right"></i>
            </button>
          </div>
        </section>

        {/* 모바일 전용 AI 견적 스낵바 */}
        <div className="ai-chat-snackbar">
          <div className="ai-snackbar-container">
            <button className="ai-estimate-button" onClick={() => navigate('/cs/inquiry')}>
              <div className="button-inner">
                <span className="icon-circle">
                  <i className="fas fa-comment-dots"></i> {/* 로봇 대신 말풍선 적용 */}
                </span>
                <span className="button-text">빠른 견적문의</span>
              </div>
              <i className="fa fa-chevron-right arrow-icon"></i>
            </button>
          </div>
        </div>

        {/* 장기렌트 상담 버튼 */}
        <section className="contact-section">
          <div className="contact-container">
            <div className="contact-text">
              <h3>도움이 필요하신가요?</h3>
              <p>장기렌트 문의, 365일 24시간 언제든 상담 가능합니다.</p>
            </div>
            <a href="tel:1588-1234" className="contact-button">
              <span className="button-content-wrapper">
                <i className="fa fa-phone-alt"></i> 1588 - 5678
              </span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

// 이용가이드 스타일의 카드 컴포넌트
const InfoCard = ({ title, badge, items }) => (
  <section className="guide-card">
    <div className="guide-card-header">
      <span className="step-badge">{badge}</span>
      <h3>{title} </h3>
    </div>
    <div className="guide-list-container">
      {items.map((item, idx) => (
        <div key={idx} className="guide-list-item">
          <span className="list-bullet">•</span>
          <div className="list-content">
            <span className="list-label">{item.label}</span>
            <span className="list-value">{item.value}</span>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default YearPage;