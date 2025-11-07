# 0102
3-2 소프트웨어 공학 팀 프로젝트 repository입니다. 팀명 : 공일공이

# JobReady Project
- JobReady는 AI 취업/면접 준비 플랫폼으로 구직자가 실제 면접을 시뮬레이션하고, 답변을 분석·피드백받으며 반복 학습할 수 있는 웹 서비스입니다.

## Front (React + Vite + React Router) 구조

```
Front/
  index.html
  package.json
  vite.config.js
  public/
    Ai_interView.jpg   # 히어로 섹션 이미지
    robots.txt
  src/
    main.jsx           # 진입 파일
    App.jsx            # 라우터 설정 (/, /career, /login, /register, /findpw)
    styles/
      global.css       # 전역 스타일
    pages/
      Home.jsx         # 메인 페이지
      Career.jsx       # 직종 선택 독립 페이지
      Login.jsx        # 로그인 페이지 Wrapper
      Register.jsx     # 회원가입 페이지 Wrapper
      FindPW.jsx       # 비밀번호 찾기 페이지 Wrapper
    ui/
      NavBar.jsx
      Hero.jsx
      Features.jsx
      Footer.jsx
      SelectCareer.jsx # Career 페이지 콘텐츠
      Login.jsx        # 로그인 UI (정적)
      Register.jsx     # 회원가입 UI (정적)
      FindPW.jsx       # 비밀번호 찾기 UI (정적)
```

### 로컬 실행 방법
```bash
cd Front
npm install
npm run dev
# http://localhost:5173 접속
```

### 기술 스택
- React 18, Vite 5, React Router 6
- CSS: 전역 global.css + 일부 컴포넌트 인라인 스타일

### 최근 변경 사항
- 직종 선택을 독립 라우트(/career)로 분리
- 인증 관련 정적 페이지 추가: /login, /register, /findpw
- 네비게이션 링크 갱신 및 레이아웃 정리


