import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function NavBar({ onOpenUploadModal, onOpenLoginModal, onOpenRegisterModal }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 로그인 상태 확인 (localStorage의 user_id로 체크)
  useEffect(() => {
    const checkLoginStatus = () => {
      const userId = localStorage.getItem('user_id');
      setIsLoggedIn(!!userId);
    };

    // 초기 상태 확인
    checkLoginStatus();

    // storage 이벤트 리스너 추가 (다른 탭에서 로그인/로그아웃 시 동기화)
    window.addEventListener('storage', checkLoginStatus);
    
    // 커스텀 이벤트 리스너 추가 (같은 탭에서 로그인 시 상태 업데이트)
    window.addEventListener('loginStatusChanged', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('loginStatusChanged', checkLoginStatus);
    };
  }, []);

  const handleUploadClick = (e) => {
    e.preventDefault();
    if (onOpenUploadModal) {
      onOpenUploadModal();
    }
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    if (onOpenLoginModal) {
      onOpenLoginModal();
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    // localStorage에서 사용자 정보 제거
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
    localStorage.removeItem('desiredJob');
    
    // 로그인 상태 업데이트
    setIsLoggedIn(false);
    
    // 커스텀 이벤트 발생 (다른 컴포넌트에서 상태 업데이트 가능)
    window.dispatchEvent(new Event('loginStatusChanged'));
    
    // 페이지 새로고침
    window.location.reload();
  };

  return (
    <header className="nav">
      <div className="container nav__inner">
        <Link className="brand" to="/" aria-label="JobReady Home">
          <span className="brand__logo">JR</span>
          <span className="brand__name">JobReady</span>
        </Link>
        <nav className="nav__links" aria-label="Primary">
          <a href="#features">기능 소개</a>
          <Link to="/career">직종 선택</Link>
          <Link to="/mypage">My Page</Link>
          <Link to="/community">Community</Link>
        </nav>
        {isLoggedIn ? (
          <a className="btn btn-primary" href="#" onClick={handleLogout}>로그아웃</a>
        ) : (
          <a className="btn btn-primary" href="#" onClick={handleLoginClick}>로그인</a>
        )}
      </div>
    </header>
  );
}
