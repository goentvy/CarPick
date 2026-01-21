import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/yearPage.css';

const YearPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8080/api/rent/year/details')
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
          <div className="service-simple-grid">
            {["대차 서비스", "Pick-UP 서비스", "긴급 서비스", "정기점검"].map((s, i) => (
              <div key={i} className="service-mini-tag">{s}</div>
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