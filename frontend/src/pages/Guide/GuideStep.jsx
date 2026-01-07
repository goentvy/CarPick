function GuideStep({ data }) {
  // 1. 전체 데이터 존재 여부 확인 (방어 로직)
  // data가 null이거나 undefined이면 화면에 아무것도 그리지 않고 에러를 방지합니다.
  if (!data) return null;

  // 2. 구조 분해 할당 시 기본값 설정
  // 혹시라도 백엔드에서 특정 데이터가 빠져서 올 경우를 대비해 [] 빈 배열을 기본값으로 줍니다.
  const { step, title, sections = [] } = data;

  return (
    <section className="guide-step">
      {/* Step Header */}
      <div className="guide-step-header">
        <span className="guide-step-number">{step}</span>
        <h3 className="guide-step-title">{title}</h3>
      </div>

      {/* 3. Sections 렌더링 (Optional Chaining 적용) */}
      {sections.map((section, idx) => (
        <div key={idx} className="guide-section">
          <h4 className="guide-section-title">{section.subtitle}</h4>

          <ul className="guide-item-list">
            {/* 4. section.items가 없을 경우를 대비해 ?.map 사용 */}
            {section.items?.map((item, i) => (
              <li key={i} className="guide-item">
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

export default GuideStep;