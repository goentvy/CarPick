import React, { useEffect, useState } from 'react';
import '../../styles/emergencyService.css';

const EmergencyService = () => {
  const [guideList, setGuideList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/emergency")
      .then((res) => {
        if (!res.ok) throw new Error("API Error");
        return res.json();
      })
      .then((data) => {
        setGuideList(data);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="status-message">정보를 불러오는 중입니다...</div>;
  if (error) return <div className="status-message error">데이터 로드에 실패했습니다.</div>;

  return (
    <div className="emergency-container"> 
    <header className="emergency-header">
      <h2 className="emergency-main-title">긴급지원서비스</h2>
    </header>

      <main className="emergency-body">
        <div className="emergency-grid">
          {guideList.map((item, index) => (
            <div key={index} className="service-card-item">
              <div className="card-badge">Emergency</div>
              <h3 className="card-title">{item.title}</h3>
              <p className="card-text">{item.description}</p>
            </div>
          ))}
        </div>

        <section className="info-section">
          <h2 className="info-title">💡 알아두면 유용한 상황</h2>
          <div className="info-box">
            <ul className="info-list">
              <li>여행 도중 밤에 펑크가 나서 견인이 필요할 때</li>
              <li>차 안에 열쇠를 두고 내렸다가 문을 잠가버렸을 때</li>
              <li>배터리 방전으로 시동이 걸리지 않을 때</li>
              <li>연료가 바닥났지만 근처에 주유소가 없을 때</li>
              <li>사고나 갑작스런 고장으로 운행이 불가능할 때</li>
            </ul>
          </div>
        </section>

        <section className="contact-section">
          <div className="contact-container">
            <div className="contact-text">
              <h3>도움이 필요하신가요?</h3>
              <p>365일 24시간 연중무휴 사고 접수 및 긴급출동 서비스를 이용하실 수 있습니다.</p>
            </div>
            <a href="tel:1588-1234" className="contact-button">
              <i className="fa fa-phone-alt"></i> 1588 - 1234
            </a>
          </div>
        </section>
        
      </main>
    </div>
  );
};

export default EmergencyService;