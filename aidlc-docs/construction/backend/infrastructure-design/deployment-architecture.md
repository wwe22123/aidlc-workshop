# Deployment Architecture - 전체 시스템

---

## Docker Compose 구성

```
+--------------------------------------------------+
|              Docker Compose                       |
|                                                  |
|  +--------------------+  +--------------------+  |
|  | backend            |  | frontend           |  |
|  | python:3.11-slim   |  | node:20-alpine     |  |
|  | Port: 8000         |  | Port: 5173         |  |
|  |                    |  |                    |  |
|  | FastAPI + Uvicorn  |  | Vite Dev Server    |  |
|  +--------+-----------+  +--------------------+  |
|           |                                      |
|  +--------v-----------+                          |
|  | Volumes            |                          |
|  | - db-data          |                          |
|  | - upload-data      |                          |
|  +--------------------+                          |
+--------------------------------------------------+
```

Text Alternative:
- Docker Compose 내 2개 컨테이너: backend (port 8000), frontend (port 5173)
- backend에 2개 볼륨 연결: db-data, upload-data

---

## docker-compose.yml 설계

```yaml
version: "3.8"

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    volumes:
      - db-data:/app/data
      - upload-data:/app/uploads
    environment:
      - DATABASE_URL=sqlite:///./data/table_order.db
      - JWT_SECRET_KEY=your-secret-key-change-in-production
      - JWT_EXPIRE_HOURS=16
      - UPLOAD_DIR=/app/uploads
      - CORS_ORIGINS=http://localhost:5173

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "5173:5173"
    depends_on:
      - backend

volumes:
  db-data:
  upload-data:
```

---

## 접근 URL

| 서비스 | URL | 설명 |
|--------|-----|------|
| Frontend (고객) | http://localhost:5173/customer | 고객 주문 화면 |
| Frontend (관리자) | http://localhost:5173/admin | 관리자 대시보드 |
| Backend API | http://localhost:8000/api | REST API |
| Backend Docs | http://localhost:8000/docs | Swagger UI |
| 이미지 파일 | http://localhost:8000/uploads/{filename} | 업로드된 이미지 |
