import React from 'react';

export default function Login({ onClose, onOpenRegister, onOpenFindPW }) {
  const handleFindPW = (e) => {
    e.preventDefault();
    if (onClose) onClose();
    if (onOpenFindPW) onOpenFindPW();
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (onClose) onClose();
    if (onOpenRegister) onOpenRegister();
  };

  return (
    <div style={styles.container}>
      <button className="auth-modal-close" onClick={onClose} aria-label="Close">×</button>
      <div style={styles.welcome}>
        <div style={styles.welcomeContent}>
          <div style={styles.logo}>JR</div>
          <h1 style={styles.brand}>JobReady</h1>
          <p style={styles.welcomeText}><br /><br />AI 기반 면접 시뮬레이션으로 <br /> 취업 성공률을 높이세요.</p>
        </div>
        <div style={styles.link}>www.jobready.com</div>
      </div>

      <div style={styles.formArea}>
        <div style={styles.formBox}>
          <h2 style={styles.title}>로그인</h2>
          <p style={styles.subtitle}>계정에 로그인하여 면접을 준비하세요</p>

          <form>
            <div style={styles.group}>
              <label htmlFor="email" style={styles.label}>이메일 주소</label>
              <input id="email" type="email" placeholder="example@jobready.com" style={styles.input} />
            </div>
            <div style={styles.group}>
              <label htmlFor="password" style={styles.label}>비밀번호</label>
              <input id="password" type="password" placeholder="비밀번호를 입력하세요" style={styles.input} />
            </div>
            <div style={styles.options}>
              <label style={styles.remember}><input type="checkbox" defaultChecked /> <span>비밀번호 저장</span></label>
              <a href="#" onClick={handleFindPW} style={styles.anchor}>비밀번호 찾기</a>
            </div>
            <button type="button" style={styles.primaryBtn}>로그인</button>
          </form>

          <p style={styles.helper}>계정이 없으신가요? <a href="#" onClick={handleRegister} style={styles.anchor}>회원가입</a></p>
        </div>
      </div>
    </div>
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
  container: { display: 'flex', width: 850, height: 550, borderRadius: 20, overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', background: theme.white, position: 'relative' },
  welcome: { flex: 1, background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`, color: theme.white, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: 40, textAlign: 'center', position: 'relative' },
  welcomeContent: { marginTop: 50 },
  logo: { fontSize: '3rem', fontWeight: 700, marginBottom: 20, border: `3px solid ${theme.white}`, borderRadius: 10, padding: '0 15px', display: 'inline-block' },
  brand: { margin: 0, fontSize: '2.5rem' },
  welcomeText: { margin: '12px 0 0', lineHeight: 1.5, opacity: 0.9 },
  link: { fontSize: '.9rem', opacity: .8 },
  formArea: { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 40 },
  formBox: { width: '100%', maxWidth: 350 },
  title: { fontSize: '2rem', fontWeight: 700, color: theme.primary, margin: 0 },
  subtitle: { color: theme.textLight, margin: '6px 0 32px' },
  group: { marginBottom: 22 },
  label: { display: 'block', fontSize: '.9rem', fontWeight: 500, color: theme.textDark, marginBottom: 6 },
  input: { width: '100%', padding: '10px 0', border: 'none', borderBottom: `2px solid ${theme.border}`, fontSize: '1rem', outline: 'none' },
  options: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0 24px', fontSize: '.9rem' },
  remember: { display: 'flex', alignItems: 'center', color: theme.textLight, gap: 8 },
  primaryBtn: { width: '100%', padding: 15, border: 'none', borderRadius: 8, fontSize: '1.05rem', fontWeight: 700, color: theme.white, background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})`, cursor: 'pointer' },
  helper: { textAlign: 'center', marginTop: 24, color: theme.textLight },
  anchor: { color: theme.primary, textDecoration: 'none', fontWeight: 500 },
};


