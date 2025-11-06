# 0102
3-2 소프트웨어 공학 팀 프로젝트 repository입니다. 팀명 : 공일공이

# JobReady Project
 - JobReady는 AI 취업/면접 준비 플랫폼으로써 구직자가 실제 면접 상황을 시뮬레이션하고, 자신의 대답을 분석·피드백받으며 반복 학습할 수 있는 웹 기반 서비스입니다

## Front (React + Vite + React Router) 구조

```
Front/
  index.html
  package.json
  vite.config.js
  public/
    Ai_interView.jpg   # 히어로 섹션에서 사용하는 이미지
    robots.txt
  src/
    main.jsx           # 진입 파일
    App.jsx            # 라우터 설정 (/, /career)
    styles/
      global.css       # 전역 스타일
    pages/
      Home.jsx         # 메인 페이지
      Career.jsx       # 직종 선택 독립 페이지
    ui/
      NavBar.jsx
      Hero.jsx
      Features.jsx
      Footer.jsx
      SelectCareer.jsx # Career 페이지의 콘텐츠
```

### 로컬 실행 방법

```bash
cd Front
npm install
npm run dev
# http://localhost:5173 접속
```

필수 패키지: `react`, `react-dom`, `react-router-dom`, `vite`, `@vitejs/plugin-react`