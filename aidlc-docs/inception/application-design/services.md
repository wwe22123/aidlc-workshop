# 테이블오더 서비스 - Services

---

## 서비스 아키텍처 개요

```
+------------------+     +------------------+
| Customer React   |     | Admin React      |
| (SPA)            |     | (SPA)            |
+--------+---------+     +--------+---------+
         |                        |
         v                        v
+------------------------------------------------+
|              FastAPI Application                |
|  +----------+  +----------+  +----------+      |
|  |AuthRouter|  |MenuRouter|  |OrderRouter|     |
|  +----+-----+  +----+-----+  +----+-----+     |
|       |              |              |           |
|  +----v-----+  +----v-----+  +----v-----+     |
|  |AuthSvc   |  |MenuSvc   |  |OrderSvc  |     |
|  +----+-----+  +----+-----+  +----+-----+     |
|       |              |              |           |
|  +----v---------------------------------+      |
|  |         SQLAlchemy ORM               |      |
|  +----+---------------------------------+      |
|       |                                        |
+-------+----------------------------------------+
        |
   +----v-----+
   |  SQLite   |
   +----------+
```

Text Alternative:
- Customer React SPA와 Admin React SPA가 FastAPI Application에 HTTP 요청
- FastAPI 내부: Router Layer -> Service Layer -> SQLAlchemy ORM -> SQLite

---

## 서비스 정의

### 1. AuthService
- **책임**: 인증/인가 전체 관리
- **의존성**: AdminModel, TableModel, Config (JWT secret)
- **오케스트레이션**: 
  - 관리자 로그인: 자격 증명 검증 → JWT 토큰 발급
  - 테이블 로그인: 테이블 자격 증명 검증 → 세션 토큰 발급
  - 토큰 검증: 미들웨어에서 호출

### 2. MenuService
- **책임**: 메뉴/카테고리 비즈니스 로직
- **의존성**: MenuModel, CategoryModel
- **오케스트레이션**:
  - 메뉴 CRUD: 검증 → 저장/수정/삭제
  - 카테고리 조회: 매장별 카테고리 목록 반환
  - 순서 조정: display_order 필드 업데이트

### 3. OrderService
- **책임**: 주문 생성/관리/상태 전이
- **의존성**: OrderModel, OrderItemModel, MenuModel, SSEService
- **오케스트레이션**:
  - 주문 생성: 메뉴 검증 → 주문 저장 → 총액 계산 → SSE 이벤트 발행
  - 상태 변경: 상태 전이 검증 → 업데이트 → SSE 이벤트 발행
  - 주문 삭제: 삭제 → 총액 재계산 → SSE 이벤트 발행

### 4. TableService
- **책임**: 테이블 설정/세션 라이프사이클 관리
- **의존성**: TableModel, TableSessionModel, OrderModel, OrderHistoryModel
- **오케스트레이션**:
  - 테이블 설정: 테이블 생성 → 비밀번호 해싱 → 세션 생성
  - 세션 종료: 주문 이력 이동 → 세션 종료 → 테이블 리셋

### 5. SSEService
- **책임**: 실시간 이벤트 관리
- **의존성**: 없음 (독립적 이벤트 브로커)
- **오케스트레이션**:
  - 구독: 클라이언트 연결 등록 → AsyncGenerator 반환
  - 브로드캐스트: 매장별 연결된 클라이언트에 이벤트 전송
  - 연결 해제: 클라이언트 연결 제거

---

## 서비스 간 상호작용

| 호출자 | 피호출자 | 상호작용 |
|--------|---------|---------|
| OrderService | SSEService | 주문 생성/상태변경/삭제 시 이벤트 브로드캐스트 |
| OrderService | MenuModel | 주문 생성 시 메뉴 정보 검증 |
| TableService | OrderModel | 세션 종료 시 주문 이력 이동 |
| AuthMiddleware | AuthService | 요청마다 토큰 검증 |
