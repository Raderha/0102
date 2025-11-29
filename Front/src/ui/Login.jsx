import React, { useState } from 'react';

// 백엔드 API URL (환경 변수로 관리하는 것이 좋지만, 일단 하드코딩)
const API_BASE_URL = 'https://jobready-backend-282796839955.asia-northeast3.run.app';

export default function Login({ onClose, onOpenRegister, onOpenFindPW }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // 입력 검증
    if (!email || !password) {
      setError('이메일과 비밀번호를 모두 입력해주세요.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      // 응답이 비어있는지 확인
      const contentType = response.headers.get('content-type');
      let data = {};
      
      if (contentType && contentType.includes('application/json')) {
        try {
          const text = await response.text();
          data = text ? JSON.parse(text) : {};
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          setError('서버 응답을 처리할 수 없습니다.');
          setLoading(false);
          return;
        }
      }

      if (response.ok && data.status === 'success') {
        // 로그인 성공
        // user_id와 desiredJob을 localStorage에 저장
        if (data.user_id) {
          localStorage.setItem('user_id', data.user_id);
          localStorage.setItem('user_email', email);
          // job_field를 우선적으로 확인하고, 없으면 desiredJob 확인하여 저장
          if (data.job_field) {
            localStorage.setItem('user_job_field', data.job_field);
          } else if (data.desiredJob) {
            localStorage.setItem('user_job_field', data.desiredJob);
          }
        }
        
        // 로그인 상태 변경 이벤트 발생 (NavBar 상태 업데이트용)
        window.dispatchEvent(new Event('loginStatusChanged'));
        
        // 성공 메시지 표시 (선택사항)
        alert(data.message || '로그인 성공!');
        
        // 모달 닫기
        if (onClose) onClose();
        
        // 페이지 새로고침 또는 상태 업데이트 (선택사항)
        window.location.reload();
      } else {
        // 로그인 실패 - FastAPI 에러 응답은 {detail: "..."} 형식
        setError(data.detail || data.message || '로그인에 실패했습니다.');
      }
    } catch (err) {
      console.error('Login error:', err);
      // 네트워크 에러나 기타 에러 처리
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
      } else {
        setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
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
          <p style={styles.welcomeText}><br /><br />AI 기반 면접 시뮬레이션으로 <br /> 취업 성공률을 높이세요.</p>
        </div>
        <div style={styles.link}>www.jobready.com</div>
      </div>

      <div style={styles.formArea}>
        <div style={styles.formBox}>
          <h2 style={styles.title}>로그인</h2>
          <p style={styles.subtitle}>계정에 로그인하여 면접을 준비하세요</p>

          {error && (
            <div style={styles.errorBox}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
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
                placeholder="비밀번호를 입력하세요" 
                style={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div style={styles.options}>
              <label style={styles.remember}><input type="checkbox" defaultChecked /> <span>비밀번호 저장</span></label>
              <a href="#" onClick={handleFindPW} style={styles.anchor}>비밀번호 찾기</a>
            </div>
            <button 
              type="submit" 
              style={{...styles.primaryBtn, opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer'}}
              disabled={loading}
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
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


