import React from 'react';
import '../../styles/SelectCareer.css';

// Static design component for picking a career category.
// No interactivity/handlers as requested.
export default function SelectCareer() {
  const careers = [
    { code: 'WD', name: 'Web Developer', gradient: 'linear-gradient(135deg, #ff7aa2 0%, #ffb86c 100%)' },
    { code: 'AC', name: 'Accountant', gradient: 'linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)' },
    { code: 'SE', name: 'Sales Engineer', gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)' },
    { code: 'DS', name: 'Data Scientist', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
    { code: 'PM', name: 'Product Manager', gradient: 'linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)' },
    { code: 'UX', name: 'UX Designer', gradient: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)' },
  ];

  return (
    <section id="selectcareer" className="select-career-page">
      <div className="select-career-container">
        <header className="select-career-header">
          <h1 className="select-career-h1">Hello</h1>
          <p className="select-career-sub">Nice to meet you — let's get you ready!</p>
          <div className="select-career-search-bar">
            <div className="select-career-search-icon" aria-hidden>🔎</div>
            <input
              readOnly
              value={"Select Your Career"}
              className="select-career-search-input"
              aria-label="Select Your Career"
            />
          </div>
        </header>

        <h2 className="select-career-section-title">Career <span className="select-career-count">(6)</span></h2>

        <div className="select-career-grid">
          {careers.map((c) => (
            <article key={c.code} className="select-career-card">
              <div className="select-career-icon" style={{ background: c.gradient }}>
                <span className="select-career-icon-text">{c.code}</span>
              </div>
              <div className="select-career-card-text">
                <strong className="select-career-card-title">{c.name}</strong>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
