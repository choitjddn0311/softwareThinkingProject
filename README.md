# 국민대학교 소프트웨어적사고 기말 프로젝트 | 감정 그림 일기

일기를 작성하고, 저장하면 AI가 일기 내용을 바탕으로 그림을 자동 생성해주는 웹 다이어리입니다.

## 주요 기능

- 회원가입 / 로그인 / 로그아웃
- 날짜별 일기 작성 (제목, 내용, 감정, 기상·취침 시간)
- 일기 저장 시 AI 그림 자동 생성 (Pollinations AI)
- 편집 시작 시 현재 위치 날씨 자동 연동 (Open-Meteo API)
- 감정별 색상으로 표시되는 달력 뷰 (저장 즉시 반영)
- 책 페이지 넘기기 애니메이션 UI

## 기술 스택

| 구분 | 사용 기술 |
|------|-----------|
| Frontend | React 19, Vite, Tailwind CSS, react-pageflip, react-icons |
| Backend | Python, Flask, SQLite |
| 이미지 생성 | Pollinations AI, Google Translate (무료 엔드포인트) |
| 날씨 | Open-Meteo API (무료, API 키 불필요) |

---

## 실행 방법

### 사전 준비

- [Node.js](https://nodejs.org/) 설치 (v18 이상 권장)
- [Python](https://www.python.org/) 설치 (v3.10 이상 권장)

---

### 백엔드 실행

```bash
# 1. 백엔드 폴더로 이동
cd backend

# 2. 필요 패키지 설치
pip install flask flask-cors

# 3. 서버 실행
python app.py
```

백엔드 서버가 `http://localhost:5000` 에서 실행됩니다.

---

### 프론트엔드 실행

```bash
# 1. 프론트엔드 폴더로 이동
cd frontend

# 2. 패키지 설치 (최초 1회)
npm install

# 3. 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:5173` 으로 접속합니다.

> 프론트엔드 개발 서버는 `/api` 요청을 자동으로 백엔드(`localhost:5000`)로 프록시합니다.  
> **백엔드와 프론트엔드를 동시에 실행해야 정상 작동합니다.**

---

## API 명세

### 인증

| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | `/api/auth/register` | 회원가입 |
| POST | `/api/auth/login` | 로그인 |
| POST | `/api/auth/logout` | 로그아웃 |
| GET | `/api/auth/me` | 현재 로그인 사용자 확인 |

### 일기

| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | `/api/diaries` | 일기 작성 |
| GET | `/api/diaries` | 전체 일기 조회 |
| GET | `/api/diaries/date/:date` | 특정 날짜 일기 조회 |
| PUT | `/api/diaries/date/:date` | 날짜 기준 일기 저장 또는 수정 |
| PATCH | `/api/diaries/date/:date/image` | 이미지 URL만 업데이트 |
| PUT | `/api/diaries/:id` | ID 기준 일기 수정 |
| DELETE | `/api/diaries/:id` | 일기 삭제 |
| GET | `/api/calendar` | 달력용 색상·제목 데이터 조회 |

### 이미지 생성

| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | `/api/generate-image` | 일기 내용 기반 AI 이미지 생성 |
| GET | `/api/image-file/:filename` | 저장된 이미지 파일 서빙 |

---

## 폴더 구조

```
softwareThinkingProject/
├── backend/
│   ├── app.py            # Flask 앱 진입점
│   ├── auth.py           # 회원가입/로그인 API
│   ├── diaryCRUD.py      # 일기 CRUD API
│   ├── imageGen.py       # AI 이미지 생성 API
│   ├── emotioncolor.py   # 감정-색상 매핑
│   ├── diary.db          # 일기 데이터베이스 (최초 실행 시 자동 생성)
│   └── user.db           # 사용자 데이터베이스 (최초 실행 시 자동 생성)
└── frontend/
    ├── src/
    │   ├── pages/        # 페이지 컴포넌트 (diary, register)
    │   ├── component/    # 공통 컴포넌트 (header 등)
    │   └── context/      # AuthContext
    ├── vite.config.js
    └── package.json
```

---

## 트러블슈팅

**프론트엔드가 실행되지 않을 때**
- Node.js가 설치되어 있는지 확인 후 `npm install` 재실행

**API 연결이 안 될 때**
- 백엔드 서버(`python app.py`)가 실행 중인지 확인
- 백엔드는 반드시 `backend/` 폴더 안에서 실행해야 DB 경로가 올바르게 잡힘

**이미지가 생성되지 않을 때**
- 인터넷 연결 확인 (Pollinations AI 외부 서비스 사용)
- 이미지 생성은 최대 90초 소요될 수 있음

**날씨가 자동으로 설정되지 않을 때**
- 브라우저 위치 권한 허용 여부 확인 (편집 버튼 클릭 시 위치 권한 요청)
- 위치 권한 거부 시 날씨 아이콘을 수동으로 선택할 수 있음
