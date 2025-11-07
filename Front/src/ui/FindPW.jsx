import React from 'react';

export default function FindPW() {
  return (
    <section style={styles.page}>
      <div style={styles.container}>
        <div style={styles.welcome}>
          <div style={styles.welcomeContent}>
            <div style={styles.logo}>JR</div>
            <h1 style={styles.brand}>JobReady</h1>
            <p style={styles.welcomeText}>걱정 마세요! <br /><br />간단한 절차를 통해 <br />비밀번호를 재설정해 드립니다.</p>
          </div>
          <div style={styles.link}>www.jobready.com</div>
        </div>

        <div style={styles.formArea}>
          <div style={styles.formBox}>
            <h2 style={styles.title}>비밀번호 찾기</h2>
            <p style={styles.subtitle}>계정에 등록된 이메일 주소를 입력해 주세요.</p>

            <form>
              <div style={styles.group}>
                <label htmlFor="email" style={styles.label}>이메일 주소</label>
                <input id="email" type="email" placeholder="example@jobready.com" style={styles.input} />
              </div>
              <button type="button" style={styles.primaryBtn}>재설정 링크 받기</button>
            </form>

            <p style={styles.helper}><a href="/login" style={styles.anchor}>로그인 페이지로 돌아가기</a></p>
          </div>
        </div>
      </div>
    </section>
  );
}

const theme = {
  primary: '#6C63FF',
  secondary: '#2F80ED',
  textDark: '#333',
  textLight: '#666',
  white: '#fff',
  border: '#ddd',
};

const styles = {
  page: { background: '#f0f2f5', minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 16 },
  container: { display: 'flex', width: 850, height: 550, borderRadius: 20, overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', background: theme.white },
  welcome: { flex: 1, background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`, color: theme.white, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: 40, textAlign: 'center' },
  welcomeContent: { marginTop: 50 },
  logo: { fontSize: '3rem', fontWeight: 700, marginBottom: 20, border: `3px solid ${theme.white}`, borderRadius: 10, padding: '0 15px', display: 'inline-block' },
  brand: { margin: 0, fontSize: '2.5rem' },
  welcomeText: { margin: '12px 0 0', lineHeight: 1.5, opacity: 0.9 },
  link: { fontSize: '.9rem', opacity: .8 },
  formArea: { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 40 },
  formBox: { width: '100%', maxWidth: 350 },
  title: { fontSize: '2rem', fontWeight: 700, color: theme.primary, margin: 0 },
  subtitle: { color: theme.textLight, margin: '6px 0 28px' },
  group: { marginBottom: 28 },
  label: { display: 'block', fontSize: '.9rem', fontWeight: 500, color: theme.textDark, marginBottom: 6 },
  input: { width: '100%', padding: '10px 0', border: 'none', borderBottom: `2px solid ${theme.border}`, fontSize: '1rem', outline: 'none' },
  primaryBtn: { width: '100%', padding: 15, border: 'none', borderRadius: 8, fontSize: '1.05rem', fontWeight: 700, color: theme.white, background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})`, cursor: 'pointer' },
  helper: { textAlign: 'center', marginTop: 24, color: theme.textLight },
  anchor: { color: theme.primary, textDecoration: 'none', fontWeight: 500 },
};


