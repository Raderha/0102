import React from 'react';
import '../../styles/Auth.css';

export default function FindPW({ onClose, onOpenLogin }) {
  const handleLogin = (e) => {
    e.preventDefault();
    if (onClose) onClose();
    if (onOpenLogin) onOpenLogin();
  };

  return (
    <div className="auth-container">
      <button className="auth-modal-close" onClick={onClose} aria-label="Close">×</button>
      <div className="auth-welcome">
        <div className="auth-welcome-content">
          <div className="auth-logo">JR</div>
          <h1 className="auth-brand">JobReady</h1>
          <p className="auth-welcome-text">걱정 마세요! <br /><br />간단한 절차를 통해 <br />비밀번호를 재설정해 드립니다.</p>
        </div>
        <div className="auth-link">www.jobready.com</div>
      </div>

      <div className="auth-form-area">
        <div className="auth-form-box">
          <h2 className="auth-title">비밀번호 찾기</h2>
          <p className="auth-subtitle findpw">계정에 등록된 이메일 주소를 입력해 주세요.</p>

          <form>
            <div className="auth-group findpw">
              <label htmlFor="email" className="auth-label">이메일 주소</label>
              <input id="email" type="email" placeholder="example@jobready.com" className="auth-input" />
            </div>
            <button type="button" className="auth-primary-btn">재설정 링크 받기</button>
          </form>

          <p className="auth-helper"><a href="#" onClick={handleLogin} className="auth-anchor">로그인 페이지로 돌아가기</a></p>
        </div>
      </div>
    </div>
  );
}
