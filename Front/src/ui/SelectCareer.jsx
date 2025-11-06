import React from 'react';

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
    <section id="selectcareer" style={styles.page}>
      <div style={styles.container}>
        <header style={styles.headerArea}>
          <h1 style={styles.h1}>Hello</h1>
          <p style={styles.sub}>Nice to meet you — let’s get you ready!</p>
          <div style={styles.searchBar}>
            <div style={styles.searchIcon} aria-hidden>🔎</div>
            <input
              readOnly
              value={"Select Your Career"}
              style={styles.searchInput}
              aria-label="Select Your Career"
            />
          </div>
        </header>

        <h2 style={styles.sectionTitle}>Career <span style={styles.count}>(6)</span></h2>

        <div style={styles.grid}>
          {careers.map((c) => (
            <article key={c.code} style={styles.card}>
              <div style={{ ...styles.icon, background: c.gradient }}>
                <span style={styles.iconText}>{c.code}</span>
              </div>
              <div style={styles.cardText}>
                <strong style={styles.cardTitle}>{c.name}</strong>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const styles = {
  page: {
    background: '#ffffff',
    minHeight: '100vh',
    padding: '32px 0 48px',
  },
  container: {
    width: 'min(960px, 92%)',
    margin: '0 auto',
  },
  headerArea: {
    marginBottom: 24,
  },
  h1: {
    margin: 0,
    fontSize: 36,
    fontWeight: 800,
    color: '#0f172a',
  },
  sub: {
    margin: '8px 0 16px',
    color: '#667085',
    fontWeight: 500,
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 14px',
    borderRadius: 14,
    background: '#f2f4f7',
    border: '1px solid #e5e7eb',
    maxWidth: 420,
  },
  searchIcon: { opacity: 0.7 },
  searchInput: {
    border: 'none',
    outline: 'none',
    width: '100%',
    background: 'transparent',
    color: '#667085',
    fontWeight: 600,
  },
  sectionTitle: {
    margin: '28px 0 12px',
    fontSize: 18,
    fontWeight: 700,
    color: '#0f172a',
  },
  count: { color: '#98a2b3', fontWeight: 600 },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: 16,
  },
  card: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 16,
    border: '1px solid #e6e8ef',
    background: '#ffffff',
    boxShadow: '0 4px 14px rgba(17, 24, 39, 0.04)',
  },
  icon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    display: 'grid',
    placeItems: 'center',
    color: '#fff',
    fontWeight: 800,
    letterSpacing: 0.5,
  },
  iconText: { fontSize: 18 },
  cardText: { display: 'flex', flexDirection: 'column' },
  cardTitle: { fontSize: 16, color: '#0f172a' },
};


