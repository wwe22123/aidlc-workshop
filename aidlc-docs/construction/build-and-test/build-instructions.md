# Build Instructions - Full Stack (Backend + Frontend)

## Prerequisites
- Python 3.11+
- pip (Python package manager)
- Docker & Docker Compose (컨테이너 배포 시)

## Environment Variables
| 변수 | 설명 | 기본값 |
|------|------|--------|
| DATABASE_URL | SQLite DB 경로 | sqlite:///./data/table_order.db |
| JWT_SECRET_KEY | JWT 서명 키 | (반드시 변경) |
| CORS_ORIGINS | 허용 Origin | http://localhost:5173 |

## Build Steps

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment
```bash
# .env 파일 생성 (backend/ 디렉토리)
cat > .env << EOF
DATABASE_URL=sqlite:///./data/table_order.db
JWT_SECRET_KEY=your-production-secret-key
CORS_ORIGINS=http://localhost:5173
EOF
```

### 3. Initialize Database & Seed Data
```bash
# data 디렉토리 생성
mkdir -p data uploads

# Python shell에서 초기화
python -c "
from app.database import engine, Base
from app.models import *
Base.metadata.create_all(bind=engine)
from app.database import SessionLocal
from app.seed import seed_data
db = SessionLocal()
seed_data(db)
db.close()
print('Database initialized and seeded.')
"
```

### 4. Run Application
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 5. Docker Build (Alternative)
```bash
# 프로젝트 루트에서
docker-compose up --build
```

## Verify Build Success
- API 접속: http://localhost:8000
- API 문서: http://localhost:8000/docs
- 응답 확인: `{"message": "Table Order API is running"}`

## Troubleshooting

### sqlite3.OperationalError: unable to open database file
- 원인: `data/` 디렉토리 미존재
- 해결: `mkdir -p data`

### ModuleNotFoundError
- 원인: 의존성 미설치
- 해결: `pip install -r requirements.txt`

---

# Build Instructions - Frontend (table-order-frontend)

## Prerequisites
- Node.js 18+
- npm 9+
- Docker & Docker Compose (컨테이너 배포 시)

## Environment Variables
| 변수 | 설명 | 기본값 |
|------|------|--------|
| VITE_API_URL | Backend API URL | (빈 문자열 - 프록시 사용) |

## Build Steps

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Development Mode
```bash
npm run dev
# http://localhost:5173 에서 접속
# /api 요청은 http://localhost:8000 으로 프록시됨
```

### 3. Production Build
```bash
npm run build
# dist/ 디렉토리에 빌드 결과물 생성
```

### 4. TypeScript 검증
```bash
npx tsc --noEmit
# 에러 없이 완료되어야 함
```

### 5. Docker Build (Alternative)
```bash
# 프로젝트 루트에서
docker-compose up --build
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
```

## Verify Build Success
- Development: http://localhost:5173
- Production (Docker): http://localhost:3000
- 고객 화면: `/menu`
- 관리자 화면: `/admin/login`

## Build Output
```
dist/index.html                  0.33 kB
dist/assets/index-*.js         ~507 kB (gzip: ~158 kB)
```

## Troubleshooting

### npm install 실패
- 원인: Node.js 버전 불일치
- 해결: `node -v` 확인 후 18+ 버전 사용

### vite build 실패
- 원인: TypeScript 에러
- 해결: `npx tsc --noEmit`으로 에러 확인 후 수정

---

# Full Stack Build (Docker Compose)

## 전체 시스템 실행
```bash
# 프로젝트 루트에서
docker-compose up --build
```

## 서비스 구성
| 서비스 | 포트 | 설명 |
|--------|------|------|
| backend | 8000 | FastAPI + SQLite |
| frontend | 3000 (→80) | React + Nginx |

## 접속 URL
- 고객 앱: http://localhost:3000/menu
- 관리자 앱: http://localhost:3000/admin/login
- Backend API: http://localhost:8000/docs
