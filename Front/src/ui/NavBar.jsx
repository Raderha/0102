import React from 'react';

export default function NavBar() {
  return (
    <header className="nav">
      <div className="container nav__inner">
        <a className="brand" href="#" aria-label="JobReady Home">
          <span className="brand__logo">JR</span>
          <span className="brand__name">JobReady</span>
        </a>
        <nav className="nav__links" aria-label="Primary">
          <a href="#features">기능 소개</a>
          <a href="#contact">Contact</a>
          <a href="#support">Buy us a Coffee</a>
        </nav>
        <a className="btn btn-primary" href="#hero">모의 면접 시작</a>
      </div>
    </header>
  );
}


