# JobReady - AI 면접 준비 플랫폼

JobReady는 AI 기반 면접 시뮬레이션 플랫폼으로, 구직자가 이력서를 업로드하면 맞춤형 면접 질문을 생성하고, 음성 답변을 분석하여 실시간 피드백을 제공합니다.

## 📋 프로젝트 소개

JobReady는 다음과 같은 기능을 제공합니다:

- **이력서 분석**: PDF 이력서를 업로드하여 AI가 핵심 역량 키워드를 추출
- **맞춤 질문 생성**: 이력서와 직종을 바탕으로 개인화된 면접 질문 5개 생성
- **면접 시뮬레이션**: 음성으로 답변하고 AI가 실시간으로 분석 및 피드백 제공
- **면접 기록 관리**: 과거 면접 기록을 조회하고 개선점을 확인

## 👥 팀 정보

- **팀명**: 공일공이
- **프로젝트**: 3-2 소프트웨어 공학 팀 프로젝트

## 🏗️ 프로젝트 구조

```
JobReady_project/
├── Backend/                    # 백엔드 (FastAPI)
│   ├── main.py                # FastAPI 앱 초기화 및 라우터 등록
│   ├── config.py              # 환경 변수 및 설정
│   ├── database.py            # Firestore 초기화
│   ├── models.py              # Pydantic 모델 정의
│   ├── routers/               # API 라우터
│   │   ├── auth.py           # 인증 (회원가입, 로그인)
│   │   ├── resume.py         # 이력서 (업로드, 질문 생성)
│   │   ├── interview.py      # 면접 (분석, 기록 조회)
│   │   ├── stt.py            # 음성 인식 (Mock)
│   │   └── health.py         # 헬스 체크
│   └── services/              # 서비스 레이어
│       ├── gemini_service.py # Gemini API 클라이언트
│       └── stt_service.py    # STT 서비스 (Mock)
│
├── Front/                      # 프론트엔드 (React + Vite)
│   ├── src/
│   │   ├── App.jsx           # 라우터 설정
│   │   ├── main.jsx          # 진입 파일
│   │   ├── pages/            # 페이지 컴포넌트
│   │   │   ├── Home.jsx     # 메인 페이지
│   │   │   ├── Login.jsx    # 로그인 페이지
│   │   │   ├── Register.jsx # 회원가입 페이지
│   │   │   ├── UploadFile.jsx # 파일 업로드 페이지
│   │   │   ├── AiInterview.jsx # AI 면접 페이지
│   │   │   ├── Career.jsx   # 직종 선택 페이지
│   │   │   └── FindPW.jsx   # 비밀번호 찾기 페이지
│   │   ├── ui/               # UI 컴포넌트
│   │   │   ├── NavBar.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── Features.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── UploadFile.jsx
│   │   │   ├── AiInterview.jsx
│   │   │   └── ...
│   │   └── styles/
│   │       └── global.css    # 전역 스타일
│   ├── package.json
│   └── vite.config.js
│
└── SYSTEM_ARCHITECTURE.md     # 시스템 아키텍처 문서
```

## 📦 사전 설치 요구사항

### 필수 요구사항
- **Node.js** 16.x 이상
- **Python** 3.8 이상
- **npm** 또는 **yarn**



