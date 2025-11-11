# JobReady 시스템 구성도

## 전체 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER (Frontend)                        │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  React Application (Vite)                                       │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │   │
│  │  │   Pages      │  │  UI Components│  │   Router     │         │   │
│  │  │              │  │              │  │              │         │   │
│  │  │ • Home       │  │ • NavBar     │  │ React Router │         │   │
│  │  │ • Login      │  │ • Login      │  │              │         │   │
│  │  │ • Register   │  │ • Register   │  │              │         │   │
│  │  │ • UploadFile │  │ • UploadFile │  │              │         │   │
│  │  │ • AiInterview│  │ • AiInterview│  │              │         │   │
│  │  │ • Career     │  │ • Hero       │  │              │         │   │
│  │  │ • FindPW     │  │ • Features   │  │              │         │   │
│  │  │              │  │ • Footer     │  │              │         │   │
│  │  │              │  │ • Modals     │  │              │         │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘         │   │
│  │                                                                 │   │
│  │  State Management: localStorage (user_id, user_email)          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  Port: 5173 (Vite Dev Server)                                            │
│  Build: Static Files (HTML/CSS/JS)                                       │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTPS/REST API
                                    │ (CORS Enabled)
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        API GATEWAY LAYER (Backend)                       │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  FastAPI Application                                            │   │
│  │  ┌──────────────────────────────────────────────────────────┐  │   │
│  │  │  Middleware Layer                                        │  │   │
│  │  │  • CORS Middleware (allow_origins: ["*"])                │  │   │
│  │  │  • Request/Response Processing                           │  │   │
│  │  └──────────────────────────────────────────────────────────┘  │   │
│  │                                                                 │   │
│  │  ┌──────────────────────────────────────────────────────────┐  │   │
│  │  │  Router Layer                                            │  │   │
│  │  │  ┌────────────┐  ┌────────────┐  ┌────────────┐        │  │   │
│  │  │  │  /api/auth │  │ /api/resume│  │/api/interview│       │  │   │
│  │  │  │            │  │            │  │            │        │  │   │
│  │  │  │ • register │  │ • upload   │  │ • analyze  │        │  │   │
│  │  │  │ • login    │  │ • generate │  │ • history  │        │  │   │
│  │  │  │            │  │   questions│  │            │        │  │   │
│  │  │  └────────────┘  └────────────┘  └────────────┘        │  │   │
│  │  │  ┌────────────┐  ┌────────────┐                        │  │   │
│  │  │  │ /api/stt   │  │ /api/health│                        │  │   │
│  │  │  │            │  │            │                        │  │   │
│  │  │  │ • analyze  │  │ • check    │                        │  │   │
│  │  │  │  (Mock)    │  │            │                        │  │   │
│  │  │  └────────────┘  └────────────┘                        │  │   │
│  │  └──────────────────────────────────────────────────────────┘  │   │
│  │                                                                 │   │
│  │  ┌──────────────────────────────────────────────────────────┐  │   │
│  │  │  Service Layer                                           │  │   │
│  │  │  • gemini_service.py (Gemini API Client)                 │  │   │
│  │  │  • stt_service.py (STT Mock Service)                     │  │   │
│  │  └──────────────────────────────────────────────────────────┘  │   │
│  │                                                                 │   │
│  │  ┌──────────────────────────────────────────────────────────┐  │   │
│  │  │  Data Access Layer                                       │  │   │
│  │  │  • database.py (Firestore Client)                        │  │   │
│  │  │  • models.py (Pydantic Models)                           │  │   │
│  │  └──────────────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  Port: 8000 (Local) / Cloud Run (Production)                             │
│  URL: https://jobready-backend-282796839955.asia-northeast3.run.app     │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
┌───────────────────────┐  ┌──────────────────┐  ┌──────────────────────┐
│   Firebase Services   │  │   Gemini AI API  │  │   File Processing    │
│                       │  │                  │  │                      │
│  ┌─────────────────┐  │  │  • gemini-2.5-  │  │  • PDF Text          │
│  │ Firebase Auth   │  │  │    flash        │  │    Extraction        │
│  │                 │  │  │                  │  │    (pypdf)           │
│  │ • User Creation │  │  │  • Content       │  │                      │
│  │ • Authentication│  │  │    Generation    │  │  • Audio File        │
│  │ • Password Hash │  │  │                  │  │    Handling          │
│  └─────────────────┘  │  │  • JSON Response │  │    (Mock STT)        │
│                       │  │    Parsing       │  │                      │
│  ┌─────────────────┐  │  └──────────────────┘  └──────────────────────┘
│  │   Firestore     │  │
│  │   Database      │  │
│  │                 │  │
│  │ Collections:    │  │
│  │ • users/        │  │
│  │   - {user_id}/  │  │
│  │     - resumes/  │  │
│  │ • interviews/   │  │
│  │                 │  │
│  │ Documents:      │  │
│  │ • User Profile  │  │
│  │ • Resume Data   │  │
│  │ • Interview     │  │
│  │   Records       │  │
│  └─────────────────┘  │
│                       │
│  Auth: serviceAccountKey.json                                            │
└───────────────────────┘
```

## 데이터 흐름도 (Use Case별)

### 1. 회원가입 플로우
```
User (Frontend)
    │
    │ POST /api/auth/register
    │ { email, password, name }
    ▼
FastAPI Backend
    │
    ├─→ Firebase Auth (create_user)
    │   └─→ Returns: user.uid
    │
    └─→ Firestore
        └─→ users/{user_id}
            └─→ { email, name, desiredJob, created_at, role }
    │
    │ Response: { status, message, user_id }
    ▼
User (Frontend)
    └─→ localStorage.setItem('user_id', user_id)
```

### 2. 로그인 플로우
```
User (Frontend)
    │
    │ POST /api/auth/login
    │ { email, password }
    ▼
FastAPI Backend
    │
    └─→ Firestore Query
        └─→ users.where("email", "==", email)
            └─→ Returns: user document
    │
    │ Response: { status, message, user_id }
    ▼
User (Frontend)
    └─→ localStorage.setItem('user_id', user_id)
```

### 3. 이력서 업로드 및 질문 생성 플로우
```
User (Frontend)
    │
    │ POST /api/resume/upload
    │ FormData: { user_id, job_field, resume_file (PDF) }
    ▼
FastAPI Backend
    │
    ├─→ PDF Processing (pypdf)
    │   └─→ Extract text from PDF
    │
    ├─→ Gemini API Service
    │   └─→ Prompt: "이력서 분석하여 핵심 키워드 추출"
    │   └─→ Returns: analysis_keywords
    │
    └─→ Firestore
        ├─→ users/{user_id}/resumes/{resume_id}
        │   └─→ { file_name, extracted_text, analysis_keywords, job_field, uploaded_at }
        │
        └─→ users/{user_id}
            └─→ Update: { desiredJob: job_field }
    │
    │ Response: { user_id, job_field, analysis_keywords }
    ▼
User (Frontend)
    │
    │ GET /api/question/generate?user_id={user_id}
    ▼
FastAPI Backend
    │
    ├─→ Firestore Query
    │   ├─→ users/{user_id} (get user profile)
    │   └─→ users/{user_id}/resumes (get latest resume)
    │
    ├─→ Gemini API Service
    │   └─→ Prompt: "직종과 키워드 기반 면접 질문 5개 생성"
    │   └─→ Returns: JSON array of questions
    │
    │ Response: { status, question_list, analysis_summary }
    ▼
User (Frontend)
    └─→ Display questions in AiInterview page
```

### 4. 면접 답변 분석 플로우
```
User (Frontend)
    │
    │ POST /api/interview/analyze
    │ FormData: { question, audio_file, user_id }
    ▼
FastAPI Backend
    │
    ├─→ STT Service (Mock)
    │   └─→ Returns: transcribed_text (Mock response)
    │
    ├─→ Gemini API Service
    │   └─→ Prompt: "면접 질문과 답변 분석하여 피드백 생성"
    │   └─→ Returns: JSON {
    │         relevance_score,
    │         logic_score,
    │         improvement_advice,
    │         follow_up_question
    │       }
    │
    └─→ Firestore
        └─→ interviews/{interview_id}
            └─→ {
                  question,
                  transcribed_text,
                  feedback: { ... },
                  user_id,
                  timestamp
                }
    │
    │ Response: { status, question, transcribed_text, feedback, user_id, timestamp }
    ▼
User (Frontend)
    └─→ Display feedback and scores
```

### 5. 면접 기록 조회 플로우
```
User (Frontend)
    │
    │ GET /api/interviews/{user_id}
    ▼
FastAPI Backend
    │
    └─→ Firestore Query
        └─→ interviews.where("user_id", "==", user_id)
            .order_by("timestamp", DESC)
            └─→ Returns: Array of interview documents
    │
    │ Response: {
    │   status,
    │   count,
    │   records: [
    │     { interview_id, question, transcribed_text, feedback, ... },
    │     ...
    │   ]
    │ }
    ▼
User (Frontend)
    └─→ Display interview history
```

## 기술 스택 상세

### Frontend
- **Framework**: React 18.3.1
- **Build Tool**: Vite 5.4.8
- **Routing**: React Router 6.28.0
- **State Management**: React Hooks (useState, localStorage)
- **Styling**: CSS (global.css + inline styles)
- **HTTP Client**: Fetch API

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

## API 엔드포인트 목록

### Health Check
- `GET /` - 기본 엔드포인트
- `GET /api/health` - 서버 상태 확인

### Authentication
- `POST /api/auth/register` - 회원가입
  - Request: `{ email, password, name }`
  - Response: `{ status, message, user_id }`
  
- `POST /api/auth/login` - 로그인
  - Request: `{ email, password }`
  - Response: `{ status, message, user_id }`

### Resume
- `POST /api/resume/upload` - 이력서 업로드
  - Request: FormData `{ user_id, job_field, resume_file }`
  - Response: `{ user_id, job_field, analysis_keywords }`
  
- `GET /api/question/generate?user_id={user_id}` - 질문 생성
  - Response: `{ status, question_list, analysis_summary }`

### Interview
- `POST /api/interview/analyze` - 면접 답변 분석
  - Request: FormData `{ question, audio_file, user_id }`
  - Response: `{ status, question, transcribed_text, feedback, user_id, timestamp }`
  
- `GET /api/interviews/{user_id}` - 면접 기록 조회
  - Response: `{ status, count, records: [...] }`

### STT
- `POST /api/stt/analyze` - 음성 인식 (Mock)
  - Request: FormData `{ audio_file }`
  - Response: `{ status, filename, transcribed_text }`

## 데이터베이스 스키마 (Firestore)

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
```

## 보안 및 설정

### 환경 변수 (.env)
```
GEMINI_API_KEY=your_gemini_api_key_here
```

### Firebase 설정
- `serviceAccountKey.json` - Firebase Admin SDK 인증 키
- Firestore Security Rules (향후 설정 필요)
- Firebase Auth 설정

### CORS 설정
- 현재: `allow_origins: ["*"]` (개발용)
- 프로덕션: 특정 도메인으로 제한 권장

## 배포 구조

### Frontend
- **개발**: Vite Dev Server (localhost:5173)
- **프로덕션**: Static Files (빌드 후 호스팅 필요)

### Backend
- **개발**: uvicorn (localhost:8000)
- **프로덕션**: Google Cloud Run
  - URL: `https://jobready-backend-282796839955.asia-northeast3.run.app`
  - Region: asia-northeast3

## 향후 개선 사항

1. **STT 서비스**: Mock → 실제 STT API (Google Speech-to-Text 등)
2. **인증 강화**: JWT 토큰 기반 인증
3. **에러 처리**: 전역 에러 핸들러 및 로깅
4. **테스트**: Unit Test, Integration Test
5. **모니터링**: 로깅 및 메트릭 수집
6. **캐싱**: Redis 등 캐시 레이어 추가
7. **파일 저장**: Cloud Storage (이미지/파일 저장)

