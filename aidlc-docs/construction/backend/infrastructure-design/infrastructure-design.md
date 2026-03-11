# Infrastructure Design - Backend

---

## 배포 환경: Docker Compose (로컬 개발)

---

## 1. 컴포넌트-인프라 매핑

| 논리적 컴포넌트 | 인프라 매핑 | 설명 |
|---------------|-----------|------|
| FastAPI Application | Docker 컨테이너 (python:3.11-slim) | Backend 서버 |
| SQLite Database | Docker Volume (db-data) | 데이터 영속 저장 |
| 이미지 업로드 저장소 | Docker Volume (upload-data) | 업로드 파일 영속 저장 |
| 정적 파일 서빙 | FastAPI StaticFiles | /uploads 경로 마운트 |

---

## 2. Docker 설정

### Backend Dockerfile
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ./app ./app

# uploads 디렉토리 생성
RUN mkdir -p /app/uploads

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
```

### 환경 변수
| 변수 | 기본값 | 설명 |
|------|--------|------|
| DATABASE_URL | sqlite:///./data/table_order.db | DB 연결 문자열 |
| JWT_SECRET_KEY | (필수) | JWT 서명 키 |
| JWT_EXPIRE_HOURS | 16 | JWT 만료 시간 |
| UPLOAD_DIR | /app/uploads | 이미지 업로드 경로 |
| CORS_ORIGINS | http://localhost:5173 | 허용 CORS origins |

---

## 3. 네트워크

| 항목 | 설정 |
|------|------|
| 내부 네트워크 | docker-compose 기본 bridge 네트워크 |
| Backend 포트 | 8000 (호스트 → 컨테이너) |
| Frontend 접근 | http://localhost:8000/api/* |
| SSE 접근 | http://localhost:8000/api/sse/* |

---

## 4. 볼륨

| 볼륨 | 마운트 경로 | 용도 |
|------|-----------|------|
| db-data | /app/data | SQLite DB 파일 영속 저장 |
| upload-data | /app/uploads | 업로드 이미지 영속 저장 |
