import React from 'react';

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="container footer__inner">
        <p>© {new Date().getFullYear()} JobReady MMU 소프트웨어 공학 교과목 프로젝트</p>
        <nav className="footer__links" aria-label="Footer">
          <a href="#privacy">Privacy</a>
          <a href="#terms">Terms</a>
          <a href="#support" id="support">Support</a>
        </nav>
      </div>
    </footer>
  );
}


