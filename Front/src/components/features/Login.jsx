import React, { useState } from 'react';
import '../../styles/Auth.css';

// 백엔드 API URL (환경 변수에서 가져오기)
// 개발 환경에서는 프록시를 사용하므로 빈 문자열, 프로덕션에서는 전체 URL 사용
const API_BASE_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_BASE_URL || 'https://jobready-backend-282796839955.asia-northeast3.run.app');

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
    <div className="auth-container">
      <button className="auth-modal-close" onClick={onClose} aria-label="Close">×</button>
      <div className="auth-welcome">
        <div className="auth-welcome-content">
          <div className="auth-logo">JR</div>
          <h1 className="auth-brand">JobReady</h1>
          <p className="auth-welcome-text"><br /><br />AI 기반 면접 시뮬레이션으로 <br /> 취업 성공률을 높이세요.</p>
        </div>
        <div className="auth-link">www.jobready.com</div>
      </div>

      <div className="auth-form-area">
        <div className="auth-form-box">
          <h2 className="auth-title">로그인</h2>
          <p className="auth-subtitle">계정에 로그인하여 면접을 준비하세요</p>

          {error && (
            <div className="auth-error-box">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="auth-group">
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
            <div className="auth-group">
              <label htmlFor="password" className="auth-label">비밀번호</label>
              <input 
                id="password" 
                type="password" 
                placeholder="비밀번호를 입력하세요" 
                className="auth-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div className="auth-options">
              <label className="auth-remember"><input type="checkbox" defaultChecked /> <span>비밀번호 저장</span></label>
              <a href="#" onClick={handleFindPW} className="auth-anchor">비밀번호 찾기</a>
            </div>
            <button 
              type="submit" 
              className="auth-primary-btn"
              disabled={loading}
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <p className="auth-helper">계정이 없으신가요? <a href="#" onClick={handleRegister} className="auth-anchor">회원가입</a></p>
        </div>
      </div>
    </div>
  );
}
