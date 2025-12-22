function GuideStep({ data }) {
  const { step, title, sections } = data;

  return (
    <section className="guide-step">
      {/* Step Header */}
      <div className="guide-step-header">
        <span className="guide-step-number">{step}</span>
        <h3 className="guide-step-title">{title}</h3>
      </div>

      {/* Sections */}
      {sections.map((section, idx) => (
        <div key={idx} className="guide-section">
          <h4 className="guide-section-title">{section.subtitle}</h4>

          <ul className="guide-item-list">
            {section.items.map((item, i) => (
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
