# Deployment Architecture - Frontend (table-order-frontend)

---

## Docker 배포

### Dockerfile (Multi-stage Build)
```
Stage 1: Build
  - Node.js 20 Alpine
  - npm install + npm run build
  - 출력: dist/ 디렉토리

Stage 2: Serve
  - Nginx Alpine
  - dist/ → /usr/share/nginx/html
  - nginx.conf: SPA fallback (try_files → index.html)
  - Port: 80
```

### docker-compose.yml 통합
```yaml
frontend:
  build: ./frontend
  ports:
    - "5173:80"
  depends_on:
    - backend
```

---

## Nginx 설정

### SPA Routing
- 모든 경로를 index.html로 fallback
- React Router가 클라이언트 사이드 라우팅 처리

### API Proxy (개발 환경)
- Vite dev server에서 `/api` → `http://localhost:8000` 프록시
- 프로덕션: Nginx에서 `/api` → backend 서비스 프록시

---

## 환경 변수

| 변수 | 설명 | 기본값 |
|------|------|--------|
| VITE_API_URL | Backend API URL | http://localhost:8000 |
