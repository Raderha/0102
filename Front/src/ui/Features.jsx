import React from 'react';

const FEATURE_LIST = [
  {
    title: '이력서 업로드 → 맞춤 질문',
    desc: '자소서/이력서 텍스트를 기반으로 직무별 예상 질문을 자동 생성합니다.',
  },
  {
    title: '음성 인터뷰 시뮬레이션',
    desc: '브라우저 마이크로 답변하고, 음성 텍스트화 및 발화 패턴을 분석합니다.',
  },
  {
    title: '답변 기록 분석',
    desc: '답변 길이, 핵심 키워드 커버율, filler words 통계를 제공합니다.',
  },
  {
    title: '시각화 및 피드백',
    desc: 'filler words 빈도 그래프와 커버리지 점수로 즉각적인 개선 포인트를 제시합니다.',
  },
  {
    title: '공유 게시판',
    desc: '직종별 생성된 질문/답변 사례를 열람하며 답변 전략을 학습하세요.',
  },
];

export default function Features() {
  return (
    <section id="features" className="features">
      <div className="container">
        <h2 className="section-title">핵심 기능</h2>
        <div className="features__grid">
          {FEATURE_LIST.map((f) => (
            <article key={f.title} className="card feature">
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


