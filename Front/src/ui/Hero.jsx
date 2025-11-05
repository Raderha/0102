import React from 'react';

export default function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="container hero__grid">
        <div className="hero__content">
          <p className="eyebrow">AI 취업/면접 준비 플랫폼</p>
          <h1 className="hero__title">
            Boost Your <span className="accent">Communication</span> with
            <span className="brand-accent"> JobReady</span>
          </h1>
          <p className="hero__subtitle">
            이력서 업로드만 하면 자소서 기반 맞춤 질문을 생성하고,
            웹 마이크로 답변하면 실시간으로 음성과 텍스트를 분석해 드립니다.
          </p>
          <div className="hero__cta">
            <a className="btn btn-primary" href="#">모의 면접 시작</a>
            <a className="btn btn-ghost" href="#">링크 복사</a>
          </div>
          <p className="hero__footnote"></p>
        </div>
        <div className="hero__art">
          {/* Place Ai_interView.jpg into Front/public/ and reference with absolute path */}
          <img src="/Ai_interView.jpg" alt="AI Interview Illustration" className="hero__image" />
        </div>
      </div>
      <div className="social-proof">
        <div className="container">
          <p>
            
          </p>
        </div>
      </div>
    </section>
  );
}


