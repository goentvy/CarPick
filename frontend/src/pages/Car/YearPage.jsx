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
      desc: "수리 기간 동안 고객님의 일상은 멈추지 마세요. 내 차처럼 편안하고 깨끗한 대차 차량을 즉시 준비해 드립니다."
    },
    {
      title: "Pick-UP 서비스",
      img: "/images/sub/rent/pickup.png",
      desc: "계신 곳 어디든 저희가 직접 찾아갑니다. 바쁜 일상 속 서비스 센터 방문의 번거로움 없이 완벽한 정비를 경험해 보세요."
    },
    {
      title: "긴급 서비스",
      img: "/images/sub/rent/emergency.png",
      desc: "365일 24시간, 예상치 못한 상황에서도 당황하지 마세요. 고객님이 계신 곳으로 가장 빠르게 달려가겠습니다."
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

        {/* 섹션 01: 장점 (이용가이드 카드 스타일 적용) */}
        <section className="guide-card">
          <div className="guide-card-header">
            <span className="step-badge">1</span>
            <h3>CarP!ck의 장점</h3>
          </div>

          {/* 이미지 e85403 스타일의 장점 그리드 */}
          <div className="advantage-icon-grid">
            <div className="adv-card">
              <div className="adv-icon-circle blue">
                <i className="fa-solid fa-sack-dollar"></i>
              </div>
              <h4>차량 운용비용 경제적</h4>
              <p>렌트비용 전액 손비처리 및 법인세 절세효과</p>
            </div>

            <div className="adv-card">
              <div className="adv-icon-circle purple">
                <i className="fa-solid fa-screwdriver-wrench"></i>
              </div>
              <h4>차량 유지, 관리 편리성</h4>
              <p>1:1 관리를 통해 점검 및 소모품 교체 서비스 제공</p>
            </div>

            <div className="adv-card">
              <div className="adv-icon-circle light-blue">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <h4>보험료 부담 없음</h4>
              <p>종합보험 가입비용 포함으로 추가 비용 부담 제로</p>
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
        </section>
        <div className="bottom-sticky-area">
          <button
            className="main-consult-btn"
            onClick={() => {
              window.scrollTo(0, 0);
              navigate('/home');
            }}
          >
            지금 차량 예약하기 ❯
          </button>
        </div>
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