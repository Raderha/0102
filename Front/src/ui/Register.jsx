import React, { useState } from 'react';

// 백엔드 API URL
const API_BASE_URL = 'https://jobready-backend-282796839955.asia-northeast3.run.app';

export default function Register({ onClose, onOpenLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (onClose) onClose();
    if (onOpenLogin) onOpenLogin();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // 입력 검증
    if (!name || !email || !password) {
      setError('이름, 이메일, 비밀번호를 모두 입력해주세요.');
      setLoading(false);
      return;
    }

    // 비밀번호 최소 길이 검증
    if (password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          name: name,
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        // 회원가입 성공
        alert(data.message || '회원가입이 완료되었습니다!');
        
        // 모달 닫고 로그인 모달 열기
        if (onClose) onClose();
        if (onOpenLogin) onOpenLogin();
      } else {
        // 회원가입 실패
        setError(data.detail || data.message || '회원가입에 실패했습니다.');
      }
    } catch (err) {
      console.error('Register error:', err);
      setError('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <button className="auth-modal-close" onClick={onClose} aria-label="Close">×</button>
      <div style={styles.welcome}>
        <div style={styles.welcomeContent}>
          <div style={styles.logo}>JR</div>
          <h1 style={styles.brand}>JobReady</h1>
          <p style={styles.welcomeText}><br /><br />지금 가입하고, AI 면접 전문가와 함께 <br /> 꿈꾸는 직무에 한 발 더 다가가세요.</p>
        </div>
        <div style={styles.link}>www.jobready.com</div>
      </div>

      <div style={styles.formArea}>
        <div style={styles.formBox}>
          <h2 style={styles.title}>회원가입</h2>
          <p style={styles.subtitle}>JobReady를 시작하려면 정보를 입력하세요</p>

          {error && (
            <div style={styles.errorBox}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={styles.group}>
              <label htmlFor="name" style={styles.label}>이름</label>
              <input 
                id="name" 
                type="text" 
                placeholder="이름을 입력하세요" 
                style={styles.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div style={styles.group}>
              <label htmlFor="email" style={styles.label}>이메일 주소</label>
              <input 
                id="email" 
                type="email" 
                placeholder="example@jobready.com" 
                style={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div style={styles.group}>
              <label htmlFor="password" style={styles.label}>비밀번호</label>
              <input 
                id="password" 
                type="password" 
                placeholder="8자 이상, 문자/숫자 포함" 
                style={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                minLength={8}
              />
            </div>
            <div style={styles.group}>
              <label htmlFor="job" style={styles.label}>관심 직무/분야 (선택)</label>
              <select id="job" defaultValue="" style={styles.select} disabled={loading}>
                <option value="">직무를 선택하세요</option>
                <option>개발 (프론트/백엔드)</option>
                <option>디자인 (UI/UX)</option>
                <option>기획 (PM/PO)</option>
                <option>영업/마케팅</option>
                <option>경영지원/회계</option>
                <option>기타</option>
              </select>
            </div>
            <div style={styles.group}>
              <label htmlFor="edu" style={styles.label}>최종 학력 (선택)</label>
              <select id="edu" defaultValue="" style={styles.select} disabled={loading}>
                <option value="">선택 안 함</option>
                <option>고졸</option>
                <option>전문대졸</option>
                <option>대학교 졸업 (4년)</option>
                <option>석사 이상</option>
              </select>
            </div>
            <button 
              type="submit" 
              style={{...styles.primaryBtn, opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer'}}
              disabled={loading}
            >
              {loading ? '가입 중...' : '계정 생성'}
            </button>
          </form>

          <p style={styles.helper}>이미 계정이 있으신가요? <a href="#" onClick={handleLogin} style={styles.anchor}>로그인</a></p>
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
  container: { display: 'flex', width: 850, height: 720, borderRadius: 20, overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', background: theme.white, position: 'relative' },
  welcome: { flex: 1, background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`, color: theme.white, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: 40, textAlign: 'center' },
  welcomeContent: { marginTop: 50 },
  logo: { fontSize: '3rem', fontWeight: 700, marginBottom: 20, border: `3px solid ${theme.white}`, borderRadius: 10, padding: '0 15px', display: 'inline-block' },
  brand: { margin: 0, fontSize: '2.5rem' },
  welcomeText: { margin: '12px 0 0', lineHeight: 1.5, opacity: 0.9 },
  link: { fontSize: '.9rem', opacity: .8 },
  formArea: { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '30px 40px', overflowY: 'visible' },
  formBox: { width: '100%', maxWidth: 350 },
  title: { fontSize: '2rem', fontWeight: 700, color: theme.primary, margin: 0 },
  subtitle: { color: theme.textLight, margin: '6px 0 20px' },
  group: { marginBottom: 16 },
  label: { display: 'block', fontSize: '.9rem', fontWeight: 500, color: theme.textDark, marginBottom: 6 },
  input: { width: '100%', padding: '10px 0', border: 'none', borderBottom: `2px solid ${theme.border}`, fontSize: '1rem', outline: 'none', background: 'transparent' },
  select: { width: '100%', padding: '10px 0', border: 'none', borderBottom: `2px solid ${theme.border}`, fontSize: '1rem', outline: 'none', background: 'transparent', appearance: 'none' },
  primaryBtn: { width: '100%', padding: 15, border: 'none', borderRadius: 8, fontSize: '1.05rem', fontWeight: 700, color: theme.white, background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})`, cursor: 'pointer', marginTop: 8 },
  helper: { textAlign: 'center', marginTop: 20, color: theme.textLight },
  anchor: { color: theme.primary, textDecoration: 'none', fontWeight: 500 },
  errorBox: { 
    padding: '12px 16px', 
    marginBottom: 20, 
    backgroundColor: '#fee', 
    color: '#c33', 
    borderRadius: 6, 
    fontSize: '.9rem',
    border: '1px solid #fcc'
  },
};


