import React from 'react';
import { Link } from 'react-router-dom';

export default function NavBar({ onOpenUploadModal, onOpenLoginModal, onOpenRegisterModal }) {
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

  return (
    <header className="nav">
      <div className="container nav__inner">
        <Link className="brand" to="/" aria-label="JobReady Home">
          <span className="brand__logo">JR</span>
          <span className="brand__name">JobReady</span>
        </Link>
        <nav className="nav__links" aria-label="Primary">
          <a href="#features">기능 소개</a>
          <a href="#" onClick={handleLoginClick}>Login / Register</a>
          <Link to="/career">직종 선택</Link>
        </nav>
        <a className="btn btn-primary" href="#" onClick={handleUploadClick}>모의 면접 시작</a>
      </div>
    </header>
  );
}


