import React, { useState } from 'react';
import '../../styles/Auth.css';

// 백엔드 API URL (환경 변수에서 가져오기)
// 개발 환경에서는 프록시를 사용하므로 빈 문자열, 프로덕션에서는 전체 URL 사용
const API_BASE_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_BASE_URL || 'https://jobready-backend-282796839955.asia-northeast3.run.app');

export default function Register({ onClose, onOpenLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [desiredJob, setDesiredJob] = useState('');
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
          desiredJob: desiredJob || undefined,
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
    <div className="auth-container register">
      <button className="auth-modal-close" onClick={onClose} aria-label="Close">×</button>
      <div className="auth-welcome">
        <div className="auth-welcome-content">
          <div className="auth-logo">JR</div>
          <h1 className="auth-brand">JobReady</h1>
          <p className="auth-welcome-text"><br /><br />지금 가입하고, AI 면접 전문가와 함께 <br /> 꿈꾸는 직무에 한 발 더 다가가세요.</p>
        </div>
        <div className="auth-link">www.jobready.com</div>
      </div>

      <div className="auth-form-area register">
        <div className="auth-form-box">
          <h2 className="auth-title">회원가입</h2>
          <p className="auth-subtitle register">JobReady를 시작하려면 정보를 입력하세요</p>

          {error && (
            <div className="auth-error-box">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="auth-group register">
              <label htmlFor="name" className="auth-label">이름</label>
              <input 
                id="name" 
                type="text" 
                placeholder="이름을 입력하세요" 
                className="auth-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div className="auth-group register">
              <label htmlFor="email" className="auth-label">이메일 주소</label>
              <input 
                id="email" 
                type="email" 
                placeholder="example@jobready.com" 
                className="auth-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div className="auth-group register">
              <label htmlFor="password" className="auth-label">비밀번호</label>
              <input 
                id="password" 
                type="password" 
                placeholder="8자 이상, 문자/숫자 포함" 
                className="auth-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                minLength={8}
              />
            </div>
            <div className="auth-group register">
              <label htmlFor="job" className="auth-label">관심 직무/분야 (선택)</label>
              <select 
                id="job" 
                value={desiredJob} 
                onChange={(e) => setDesiredJob(e.target.value)}
                className="auth-select" 
                disabled={loading}
              >
                <option value="">직무를 선택하세요</option>
                <option value="개발 (프론트/백엔드)">개발 (프론트/백엔드)</option>
                <option value="디자인 (UI/UX)">디자인 (UI/UX)</option>
                <option value="기획 (PM/PO)">기획 (PM/PO)</option>
                <option value="영업/마케팅">영업/마케팅</option>
                <option value="경영지원/회계">경영지원/회계</option>
                <option value="기타">기타</option>
              </select>
            </div>
            <div className="auth-group register">
              <label htmlFor="edu" className="auth-label">최종 학력 (선택)</label>
              <select id="edu" defaultValue="" className="auth-select" disabled={loading}>
                <option value="">선택 안 함</option>
                <option>고졸</option>
                <option>전문대졸</option>
                <option>대학교 졸업 (4년)</option>
                <option>석사 이상</option>
              </select>
            </div>
            <button 
              type="submit" 
              className="auth-primary-btn register"
              disabled={loading}
            >
              {loading ? '가입 중...' : '계정 생성'}
            </button>
          </form>

          <p className="auth-helper register">이미 계정이 있으신가요? <a href="#" onClick={handleLogin} className="auth-anchor">로그인</a></p>
        </div>
      </div>
    </div>
  );
}
