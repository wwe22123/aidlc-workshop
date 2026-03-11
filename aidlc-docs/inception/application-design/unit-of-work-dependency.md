# 테이블오더 서비스 - Unit of Work Dependencies

---

## 의존성 매트릭스

| Unit | 의존 대상 | 의존 유형 |
|------|----------|----------|
| **table-order-backend** | (없음) | 독립적 |
| **table-order-frontend** | table-order-backend | Runtime (API 호출) |

---

## 개발 순서

```
+-------------------------+
| Unit 1: Backend         |  <-- 먼저 개발
| (table-order-backend)   |
| FastAPI + SQLite        |
+------------+------------+
             |
             | REST API / SSE
             v
+-------------------------+
| Unit 2: Frontend        |  <-- Backend 완료 후 개발
| (table-order-frontend)  |
| React + TypeScript      |
+-------------------------+
```

Text Alternative:
1. Unit 1 (Backend) 먼저 개발 - API 엔드포인트 완성
2. Unit 2 (Frontend) Backend API 기반으로 개발

---

## 개발 순서 근거

| 순서 | Unit | 근거 |
|------|------|------|
| 1 | **Backend** | Frontend가 호출할 API가 먼저 존재해야 함. 데이터 모델, 비즈니스 로직, 인증이 Backend에 집중. |
| 2 | **Frontend** | Backend API를 호출하여 UI를 구성. API 스펙이 확정된 후 개발하는 것이 효율적. |

---

## 통합 포인트

| 통합 영역 | 설명 |
|-----------|------|
| **REST API** | Frontend → Backend HTTP 요청 (JSON) |
| **SSE** | Backend → Frontend 실시간 이벤트 (관리자 대시보드) |
| **Static Files** | Backend가 업로드된 이미지 파일 서빙 |
| **CORS** | Backend에서 Frontend 도메인 허용 설정 |
| **Docker Network** | docker-compose 내부 네트워크로 통신 |
