# JobReady - AI 면접 준비 플랫폼

JobReady는 AI 기반 면접 시뮬레이션 플랫폼으로, 구직자가 이력서를 업로드하면 맞춤형 면접 질문을 생성하고, 음성 답변을 분석하여 실시간 피드백을 제공합니다.

## 📋 프로젝트 소개

JobReady는 다음과 같은 기능을 제공합니다:

- **이력서 분석**: PDF 이력서를 업로드하여 AI가 핵심 역량 키워드를 추출
- **맞춤 질문 생성**: 이력서와 직종을 바탕으로 개인화된 면접 질문 5개 생성
- **면접 시뮬레이션**: 음성으로 답변하고 AI가 실시간으로 분석 및 피드백 제공
- **면접 기록 관리**: 과거 면접 기록을 조회하고 개선점을 확인
- **커뮤니티 게시판**: 면접 질문과 답변을 공유하고 다른 사용자들의 경험을 확인

## 👥 팀 정보

- **팀명**: 공일공이
- **프로젝트**: 3-2 소프트웨어 공학 팀 프로젝트
- **버전**: 1.0

## 🏗️ 프로젝트 구조

```
JobReady_project/
├── Backend/                    # 백엔드 (FastAPI)
│   ├── main.py                # FastAPI 앱 초기화 및 라우터 등록
│   ├── Procfile               # Cloud Run 배포 설정
│   ├── requirements.txt       # Python 패키지 의존성
│   ├── serviceAccountKey.json # Firebase 인증 키
│   └── app/                   # 애플리케이션 코드
│       ├── __init__.py
│       ├── database.py        # Firestore 초기화 및 DB 접근
│       ├── models.py          # Pydantic 모델 정의
│       ├── routers/           # API 라우터
│       │   ├── __init__.py
│       │   ├── auth.py        # 인증 (회원가입, 로그인)
│       │   ├── interview.py   # 면접 (분석, 기록 조회)
│       │   ├── users.py       # 사용자 정보 (마이페이지)
│       │   └── board.py       # 게시판 (커뮤니티)
│       └── services/          # 서비스 레이어
│           ├── __init__.py
│           ├── ai_service.py # Gemini API 클라이언트
│           └── stt_service.py # STT 서비스 (Mock)
│
├── Front/                      # 프론트엔드 (React + Vite)
│   ├── src/
│   │   ├── App.jsx           # 라우터 설정
│   │   ├── main.jsx          # 진입 파일
│   │   ├── pages/            # 페이지 컴포넌트
│   │   │   ├── Home.jsx      # 메인 페이지
│   │   │   ├── Login.jsx     # 로그인 페이지
│   │   │   ├── Register.jsx  # 회원가입 페이지
│   │   │   ├── UploadFile.jsx # 파일 업로드 페이지
│   │   │   ├── AiInterview.jsx # AI 면접 페이지
│   │   │   ├── ScoreBoard.jsx # 점수판 페이지
│   │   │   ├── MyPage.jsx    # 마이페이지
│   │   │   ├── Community.jsx # 커뮤니티 페이지
│   │   │   ├── Career.jsx    # 직종 선택 페이지
│   │   │   └── FindPW.jsx    # 비밀번호 찾기 페이지
│   │   ├── components/       # 재사용 가능한 컴포넌트
│   │   │   ├── common/       # 공통 컴포넌트
│   │   │   │   ├── Hero.jsx
│   │   │   │   ├── Features.jsx
│   │   │   │   └── WarningModal.jsx
│   │   │   ├── features/     # 기능별 컴포넌트
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Register.jsx
│   │   │   │   ├── UploadFile.jsx
│   │   │   │   ├── AiInterview.jsx
│   │   │   │   ├── ScoreBoard.jsx
│   │   │   │   ├── MyPage.jsx
│   │   │   │   ├── Community.jsx
│   │   │   │   ├── SelectCareer.jsx
│   │   │   │   └── FindPW.jsx
│   │   │   └── layout/       # 레이아웃 컴포넌트
│   │   │       ├── NavBar.jsx
│   │   │       └── Footer.jsx
│   │   └── styles/           # CSS 스타일 파일
│   │       ├── global.css
│   │       ├── Auth.css
│   │       ├── Community.css
│   │       ├── MyPage.css
│   │       ├── Pages.css
│   │       ├── ScoreBoard.css
│   │       └── SelectCareer.css
│   ├── package.json
│   ├── vite.config.js        # Vite 설정 (프록시 포함)
│   └── index.html
│
└── SYSTEM_ARCHITECTURE.md     # 시스템 아키텍처 문서
```

## 📦 사전 설치 요구사항

### 필수 요구사항
- **Node.js** 16.x 이상
- **Python** 3.8 이상
- **npm** 또는 **yarn**

### 환경 변수 설정

#### Backend
`Backend/.env` 파일 생성:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

#### Frontend
`Front/.env` 파일 생성 (프로덕션용):
```env
VITE_API_BASE_URL=https://jobready-backend-282796839955.asia-northeast3.run.app
```

## 🚀 설치 및 실행 방법

### Backend 실행

```bash
cd Backend

# 가상환경 생성 (선택사항)
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 패키지 설치
pip install -r requirements.txt

# 서버 실행
uvicorn main:app --reload --port 8000
```

서버는 `http://localhost:8000`에서 실행됩니다.
API 문서는 `http://localhost:8000/docs`에서 확인할 수 있습니다.

### Frontend 실행

```bash
cd Front

# 패키지 설치
npm install

# 개발 서버 실행
npm run dev
```

프론트엔드는 `http://localhost:5173`에서 실행됩니다.

## 🛠️ 기술 스택

### Frontend
- **Framework**: React 18.3.1
- **Build Tool**: Vite 5.4.8
- **Routing**: React Router 6.28.0
- **State Management**: React Hooks (useState, localStorage)
- **Styling**: CSS Modules + Global CSS
- **HTTP Client**: Fetch API, Axios

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.x
- **API Documentation**: Swagger UI (자동 생성)
- **Validation**: Pydantic Models
- **File Processing**: pypdf (PDF 텍스트 추출)
- **Async Support**: Python async/await

### Database & Authentication
- **Database**: Google Cloud Firestore (NoSQL)
- **Authentication**: Firebase Authentication
- **Admin SDK**: firebase-admin (Python)
- **Credentials**: serviceAccountKey.json

### External Services
- **AI Service**: Google Gemini API (gemini-2.5-flash)
- **STT Service**: Mock (향후 실제 STT API로 교체 예정)
- **Hosting**: Google Cloud Run (Backend)

## 📡 API 엔드포인트

### Health Check
- `GET /` - 기본 엔드포인트
- `GET /health` - 서버 상태 확인

### Authentication
- `POST /api/auth/register` - 회원가입
  - Request: `{ email, password, name }`
  - Response: `{ status, message, user_id }`
  
- `POST /api/auth/login` - 로그인
  - Request: `{ email, password }`
  - Response: `{ status, message, user_id }`

### Interview
- `POST /api/interview/analyze` - 면접 답변 분석
  - Request: FormData `{ question_index, audio_file, user_id, is_public }`
  - Response: `{ status, question, transcribed_text, feedback, user_id, timestamp }`
  
- `GET /api/interviews/{user_id}` - 면접 기록 조회
  - Response: `{ status, count, records: [...] }`

### Users
- `GET /api/users/{user_id}/stats` - 사용자 통계 조회
  - Response: `{ total_interviews, average_score, ... }`

### Board (Community)
- `GET /api/board/` - 게시글 목록 조회
  - Query Parameters: `limit` (기본값: 20), `category` (선택사항)
  - Response: `Array<BoardPostResponse>`
  
- `POST /api/board/` - 게시글 생성
  - Request: `{ question, answer, feedback_summary, job_field, writer_name, user_id }`
  - Response: `{ status, message, post_id }`

## 💾 데이터베이스 스키마 (Firestore)

### Collection: `users`
```
users/
  {user_id}/
    - email: string
    - name: string
    - desiredJob: string
    - created_at: string (ISO format)
    - role: string ("user")
    
    resumes/ (subcollection)
      {resume_id}/
        - file_name: string
        - extracted_text: string (max 10000 chars)
        - analysis_keywords: string
        - job_field: string
        - uploaded_at: string (ISO format)
```

### Collection: `interviews`
```
interviews/
  {interview_id}/
    - question: string
    - transcribed_text: string
    - feedback: {
        relevance_score: int (1-5)
        logic_score: int (1-5)
        improvement_advice: string
        follow_up_question: string
      }
    - user_id: string
    - timestamp: string (ISO format)
    - is_public: int (0 or 1)
```

### Collection: `board`
```
board/
  {post_id}/
    - post_id: string
    - user_id: string
    - writer_name: string
    - job_field: string
    - question: string
    - answer: string
    - feedback_summary: string
    - created_at: string (ISO format)
    - views: int
```

## 🔒 보안 및 설정

### Firebase 설정
- `serviceAccountKey.json` - Firebase Admin SDK 인증 키
- Firestore Security Rules (향후 설정 필요)
- Firebase Auth 설정

### CORS 설정
- 개발 환경: `allow_origins: ["http://localhost:5173"]`
- 프로덕션: 특정 도메인으로 제한 권장

## 🚢 배포

### Backend
- **프로덕션**: Google Cloud Run
  - URL: `https://jobready-backend-282796839955.asia-northeast3.run.app`
  - Region: asia-northeast3
  - 배포: `Procfile` 사용

### Frontend
- **개발**: Vite Dev Server (localhost:5173)
- **프로덕션**: Static Files (빌드 후 호스팅 필요)
  ```bash
  cd Front
  npm run build
  # dist/ 폴더를 정적 호스팅 서비스에 배포
  ```

## 📝 주요 기능

### 1. 이력서 업로드 및 분석
- PDF 이력서 업로드
- AI 기반 핵심 키워드 추출
- 직종별 맞춤 질문 생성

### 2. AI 면접 시뮬레이션
- 음성 답변 녹음 및 업로드
- 실시간 답변 분석
- 관련성 및 논리성 점수 제공
- 개선 사항 및 피드백 제공

### 3. 면접 기록 관리
- 과거 면접 기록 조회
- 점수 추이 확인
- 개인 통계 확인

### 4. 커뮤니티 게시판
- 면접 질문과 답변 공유
- 직종별 필터링
- 다른 사용자들의 경험 확인

## 🔮 향후 개선 사항

1. **STT 서비스**: Mock → 실제 STT API (Google Speech-to-Text 등)
2. **인증 강화**: JWT 토큰 기반 인증
3. **에러 처리**: 전역 에러 핸들러 및 로깅
4. **테스트**: Unit Test, Integration Test
5. **모니터링**: 로깅 및 메트릭 수집
6. **캐싱**: Redis 등 캐시 레이어 추가
7. **파일 저장**: Cloud Storage (이미지/파일 저장)

## 📄 라이선스

이 프로젝트는 교육 목적으로 개발되었습니다.

## 👨‍💻 개발자

공일공이 팀

---

**JobReady Project 1.0** - AI 면접 준비 플랫폼
