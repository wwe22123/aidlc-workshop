# 테이블오더 서비스 - Component Dependencies

---

## 의존성 매트릭스

### Backend 의존성

| Component | 의존 대상 |
|-----------|----------|
| **AuthRouter** | AuthService |
| **MenuRouter** | MenuService, AuthMiddleware |
| **OrderRouter** | OrderService, AuthMiddleware |
| **TableRouter** | TableService, AuthMiddleware |
| **UploadRouter** | AuthMiddleware, Config (upload path) |
| **SSERouter** | SSEService, AuthMiddleware |
| **AuthService** | AdminModel, TableModel, Config |
| **MenuService** | MenuModel, CategoryModel |
| **OrderService** | OrderModel, OrderItemModel, MenuModel, SSEService |
| **TableService** | TableModel, TableSessionModel, OrderModel, OrderHistoryModel |
| **SSEService** | (독립적 - 의존성 없음) |
| **AuthMiddleware** | AuthService |
| **Database** | Config (DB URL) |
| **SeedData** | StoreModel, AdminModel, AuthService (hash_password) |

### Frontend 의존성

| Component | 의존 대상 |
|-----------|----------|
| **CustomerApp** | ApiClient, AuthContext |
| **LoginPage** | ApiClient, AuthContext, localStorage |
| **MenuPage** | ApiClient, CartDrawer |
| **CartDrawer** | localStorage, CartItem |
| **OrderConfirmPage** | ApiClient, localStorage |
| **OrderSuccessPage** | (독립적) |
| **OrderHistoryPage** | ApiClient |
| **AdminApp** | ApiClient, AuthContext |
| **AdminLoginPage** | ApiClient, AuthContext |
| **DashboardPage** | ApiClient, SSE EventSource, TableCard |
| **TableCard** | OrderDetailModal |
| **TableManagePage** | ApiClient, ConfirmDialog |
| **MenuManagePage** | ApiClient, MenuForm |
| **MenuForm** | ApiClient (upload) |

---

## 통신 패턴

### Client-Server 통신

| 패턴 | 사용처 | 설명 |
|------|--------|------|
| **REST API (HTTP)** | 모든 CRUD 작업 | JSON 요청/응답 |
| **SSE (Server-Sent Events)** | 관리자 주문 모니터링 | 서버→클라이언트 단방향 실시간 |
| **Multipart Upload** | 메뉴 이미지 업로드 | 파일 업로드 |

### 데이터 흐름

```
고객 주문 플로우:
  Customer UI -> POST /api/orders -> OrderService
    -> OrderModel (DB 저장)
    -> SSEService.broadcast (실시간 알림)
    -> Admin Dashboard (SSE 수신)

관리자 상태 변경 플로우:
  Admin UI -> PUT /api/orders/{id}/status -> OrderService
    -> OrderModel (DB 업데이트)
    -> SSEService.broadcast (실시간 알림)
    -> Admin Dashboard (SSE 수신, UI 업데이트)

테이블 세션 종료 플로우:
  Admin UI -> POST /api/tables/{id}/complete -> TableService
    -> OrderModel (주문 조회)
    -> OrderHistoryModel (이력 저장)
    -> TableSessionModel (세션 종료)
    -> SSEService.broadcast (테이블 리셋 알림)
```

Text Alternative:
- 고객 주문: Customer UI -> OrderService -> DB 저장 + SSE 브로드캐스트 -> Admin Dashboard
- 상태 변경: Admin UI -> OrderService -> DB 업데이트 + SSE 브로드캐스트
- 세션 종료: Admin UI -> TableService -> 이력 이동 + 세션 종료 + SSE 브로드캐스트

---

## 인증 흐름

| 사용자 | 인증 방식 | 토큰 저장 | 만료 |
|--------|----------|----------|------|
| 관리자 | JWT (username/password) | localStorage | 16시간 |
| 고객 태블릿 | Session token (table_number/password) | localStorage | 자동 로그인 |
