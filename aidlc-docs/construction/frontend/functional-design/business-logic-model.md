# Business Logic Model - Frontend (table-order-frontend)

## Tech Stack Decisions
- UI Framework: React + TypeScript + Vite
- Styling: Material UI (MUI)
- State Management: React Context API
- HTTP Client: Axios
- Target Device: 태블릿 전용 (768px+)

---

## 1. 고객 앱 플로우

```
[브라우저 열기]
    |
    v
[localStorage에 TableConfig 존재?]
    |-- No --> [LoginPage: 초기 설정 입력]
    |              |
    |              v
    |          [POST /api/auth/table/login]
    |              |-- 성공 --> [TableConfig 저장] --> [MenuPage]
    |              |-- 실패 --> [에러 표시, 재입력]
    |
    |-- Yes --> [자동 로그인 시도]
                   |-- 성공 --> [MenuPage (기본 화면)]
                   |-- 실패 --> [LoginPage]

[MenuPage]
    |-- 카테고리 탭 선택 --> [GET /api/categories] + [GET /api/menus]
    |-- 메뉴 카드 클릭 --> [장바구니에 추가 (localStorage)]
    |-- 장바구니 아이콘 --> [CartDrawer 열기]
    |-- 주문 내역 --> [OrderHistoryPage]

[CartDrawer]
    |-- 수량 변경 --> [localStorage 업데이트, 총액 재계산]
    |-- 항목 삭제 --> [localStorage 업데이트]
    |-- 주문하기 --> [OrderConfirmPage]

[OrderConfirmPage]
    |-- 주문 확정 --> [POST /api/orders]
    |                    |-- 성공 --> [장바구니 비우기] --> [OrderSuccessPage]
    |                    |-- 실패 --> [에러 표시, 장바구니 유지]
    |-- 뒤로가기 --> [MenuPage]

[OrderSuccessPage]
    |-- 주문번호 표시
    |-- 5초 후 자동 --> [MenuPage]

[OrderHistoryPage]
    |-- [GET /api/orders?table_id=X&session_id=Y]
    |-- 주문 목록 표시 (시간순)
```

---

## 2. 관리자 앱 플로우

```
[브라우저 열기 /admin]
    |
    v
[localStorage에 JWT 토큰 존재?]
    |-- No --> [AdminLoginPage]
    |-- Yes --> [토큰 만료 확인]
                   |-- 유효 --> [DashboardPage]
                   |-- 만료 --> [AdminLoginPage]

[AdminLoginPage]
    |-- [POST /api/auth/admin/login]
    |       |-- 성공 --> [JWT 저장] --> [DashboardPage]
    |       |-- 실패 --> [에러 표시]

[DashboardPage]
    |-- SSE 연결: [GET /api/sse/orders?store_id=X]
    |-- 테이블 그리드 표시 (TableCard[])
    |-- TableCard 클릭 --> [OrderDetailModal]
    |-- 사이드바 네비게이션:
         |-- 대시보드 (현재)
         |-- 테이블 관리 --> [TableManagePage]
         |-- 메뉴 관리 --> [MenuManagePage]

[OrderDetailModal]
    |-- 주문 상세 보기
    |-- 상태 변경 --> [PUT /api/orders/{id}/status]
    |-- 주문 삭제 --> [ConfirmDialog] --> [DELETE /api/orders/{id}]
    |-- 이용 완료 --> [ConfirmDialog] --> [POST /api/tables/{id}/complete]
    |-- 과거 이력 --> [OrderHistoryModal]

[TableManagePage]
    |-- 테이블 목록: [GET /api/tables?store_id=X]
    |-- 테이블 추가: [TableSettingForm] --> [POST /api/tables]

[MenuManagePage]
    |-- 카테고리별 메뉴 목록: [GET /api/menus?store_id=X]
    |-- 메뉴 추가: [MenuForm] --> [POST /api/menus]
    |-- 메뉴 수정: [MenuForm] --> [PUT /api/menus/{id}]
    |-- 메뉴 삭제: [ConfirmDialog] --> [DELETE /api/menus/{id}]
    |-- 이미지 업로드: [POST /api/upload]
```

---

## 3. 상태 관리 전략

### AuthContext (React Context API)
- 관리자 JWT 토큰 관리
- 로그인/로그아웃 함수
- 토큰 만료 자동 감지 (16시간)
- localStorage 동기화

### 장바구니 상태 (localStorage)
- `cart_items`: CartItem[] - 장바구니 항목
- 페이지 새로고침 시에도 유지
- 주문 확정 시 비우기
- Context 불필요 (localStorage + 컴포넌트 로컬 state로 충분)

### 테이블 설정 (localStorage)
- `table_config`: TableConfig - 테이블 인증 정보
- 브라우저 새로고침 시 자동 로그인에 사용
- 초기 설정 후 영구 저장

---

## 4. API 통신 패턴

### Axios Client 설정
- Base URL: 환경변수 `VITE_API_URL` (기본: http://localhost:8000)
- Request Interceptor: JWT 토큰 자동 첨부 (Authorization: Bearer)
- Response Interceptor: 401 응답 시 자동 로그아웃
- 에러 처리: Toast 알림으로 사용자 피드백

### SSE 연결 (관리자 대시보드)
- EventSource API 사용
- 자동 재연결 (연결 끊김 시)
- 이벤트 타입별 핸들링: order_created, order_updated, order_deleted, session_completed
