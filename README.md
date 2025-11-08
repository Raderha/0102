# JobReady Project

JobReady는 AI 취업/면접 준비 플랫폼으로 구직자가 실제 면접을 시뮬레이션하고, 답변을 분석·피드백받으며 반복 학습할 수 있는 웹 서비스입니다.

## 프로젝트 구조

```
JobReady_project/
├── Front/                    # 프론트엔드 (React + Vite)
│   ├── src/
│   │   ├── App.jsx          # 라우터 설정
│   │   ├── main.jsx         # 진입 파일
│   │   ├── pages/           # 페이지 컴포넌트
│   │   │   ├── Home.jsx     # 메인 페이지 (모달 관리)
│   │   │   ├── Career.jsx   # 직종 선택 페이지
│   │   │   ├── Login.jsx    # 로그인 페이지 (라우터용)
│   │   │   ├── Register.jsx # 회원가입 페이지 (라우터용)
│   │   │   ├── FindPW.jsx   # 비밀번호 찾기 페이지 (라우터용)
│   │   │   └── UploadFile.jsx # 파일 업로드 페이지 (라우터용)
│   │   ├── ui/              # UI 컴포넌트
│   │   │   ├── NavBar.jsx   # 네비게이션 바
│   │   │   ├── Hero.jsx      # 히어로 섹션
│   │   │   ├── Features.jsx # 기능 소개
│   │   │   ├── Footer.jsx   # 푸터
│   │   │   ├── Login.jsx    # 로그인 모달 UI
│   │   │   ├── Register.jsx # 회원가입 모달 UI
│   │   │   ├── FindPW.jsx   # 비밀번호 찾기 모달 UI
│   │   │   ├── UploadFile.jsx # 파일 업로드 모달 UI
│   │   │   ├── WarningModal.jsx # 경고 모달 UI
│   │   │   └── SelectCareer.jsx # 직종 선택 UI
│   │   └── styles/
│   │       └── global.css   # 전역 스타일
│   ├── public/
│   │   ├── Ai_interView.jpg # 히어로 섹션 이미지
│   │   └── robots.txt
│   ├── package.json
│   └── vite.config.js
└── Backend/                  # 백엔드 (향후 구현)
    └── README.md
```

## 주요 기능

### 1. 메인 페이지
- **히어로 섹션**: AI 면접 시뮬레이션 소개
- **기능 소개**: JobReady의 주요 기능 설명
- **모의 면접 시작**: 버튼 클릭 시 경고 모달 → 파일 업로드 모달 순서로 표시

### 2. 모달 기반 UI
- **로그인 모달**: 메인 페이지 위에 블러 배경과 함께 표시
- **회원가입 모달**: 로그인 모달과 동일한 스타일, 스크롤 없이 모든 내용 표시
- **비밀번호 찾기 모달**: 간단한 이메일 입력 폼
- **파일 업로드 모달**: 이력서 파일 업로드 (드래그 앤 드롭 지원)
- **경고 모달**: 개인정보 보호 안내 및 동의 확인

### 3. 파일 업로드 기능
- 드래그 앤 드롭 지원
- 클릭하여 파일 선택
- 지원 형식: .txt, .docx, .pdf (최대 20MB)
- 업로드 진행률 표시
- 파일 목록 및 제거 기능

## 기술 스택

### Frontend
- **React 18.3.1**: UI 라이브러리
- **Vite 5.4.8**: 빌드 도구 및 개발 서버
- **React Router 6.28.0**: 클라이언트 사이드 라우팅
- **CSS**: 전역 스타일 + 컴포넌트 인라인 스타일

## 설치 및 실행

### 사전 요구사항
- Node.js 16.x 이상
- npm 또는 yarn

## 팀 정보

- 팀명: 공일공이
- 프로젝트: 3-2 소프트웨어 공학 팀 프로젝트
