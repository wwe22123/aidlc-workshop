# Frontend Components Design - Frontend (table-order-frontend)

---

## 라우팅 구조

```
/ (App.tsx - Root Router)
├── /                        → 고객 앱 (CustomerApp)
│   ├── /login               → LoginPage (테이블 초기 설정)
│   ├── /menu                → MenuPage (기본 화면, 카테고리 탭 + 메뉴 카드)
│   ├── /order/confirm       → OrderConfirmPage
│   ├── /order/success       → OrderSuccessPage
│   └── /order/history       → OrderHistoryPage
│
└── /admin                   → 관리자 앱 (AdminApp)
    ├── /admin/login         → AdminLoginPage
    ├── /admin/dashboard     → DashboardPage (기본 화면)
    ├── /admin/tables        → TableManagePage
    └── /admin/menus         → MenuManagePage
```

---

## 1. 고객용 컴포넌트

### LoginPage
- Props: 없음
- State: `storeIdentifier`, `tableNumber`, `password`, `loading`, `error`
- API: `POST /api/auth/table/login`
- 동작: 성공 시 TableConfig를 localStorage에 저장 후 /menu로 이동

### MenuPage
- Props: 없음
- State: `categories`, `menus`, `selectedCategory`, `cartItems`, `drawerOpen`
- API: `GET /api/categories?store_id=X`, `GET /api/menus?store_id=X&category_id=Y`
- 동작: 카테고리 탭 전환, 메뉴 카드 클릭 시 장바구니 추가

### MenuCard
- Props: `menu: Menu`, `onAddToCart: (menu: Menu) => void`
- State: 없음
- 동작: 카드 클릭/버튼 클릭 시 onAddToCart 호출

### CartDrawer
- Props: `open: boolean`, `onClose: () => void`, `items: CartItem[]`, `onUpdateQuantity`, `onRemove`, `onOrder`
- State: 없음 (부모에서 관리)
- 동작: 수량 변경, 항목 삭제, 주문하기 버튼

### CartItem
- Props: `item: CartItem`, `onUpdateQuantity`, `onRemove`
- State: 없음
- 동작: +/- 버튼으로 수량 조절, 삭제 버튼

### OrderConfirmPage
- Props: 없음
- State: `cartItems` (localStorage에서 로드), `loading`
- API: `POST /api/orders`
- 동작: 주문 확정 → 성공 시 장바구니 비우기 → OrderSuccessPage

### OrderSuccessPage
- Props: 없음
- State: `orderNumber` (URL params 또는 location state)
- 동작: 주문번호 표시, 5초 타이머 후 /menu로 자동 이동

### OrderHistoryPage
- Props: 없음
- State: `orders: Order[]`, `loading`
- API: `GET /api/orders?table_id=X&session_id=Y`
- 동작: 현재 세션 주문 목록 표시

### OrderHistoryItem
- Props: `order: Order`
- State: 없음
- 동작: 주문 정보 카드 표시 (번호, 시각, 항목, 금액, 상태)

---

## 2. 관리자용 컴포넌트

### AdminLoginPage
- Props: 없음
- State: `storeIdentifier`, `username`, `password`, `loading`, `error`
- API: `POST /api/auth/admin/login`
- 동작: 성공 시 JWT를 localStorage에 저장 후 /admin/dashboard로 이동

### DashboardPage
- Props: 없음
- State: `tables: Table[]`, `orders: Map<number, Order[]>`, `sseConnected`
- API: `GET /api/tables?store_id=X`, `GET /api/orders`, SSE `/api/sse/orders?store_id=X`
- 동작: 테이블 그리드 표시, SSE로 실시간 업데이트, TableCard 클릭 시 모달

### TableCard
- Props: `table: Table`, `orders: Order[]`, `isHighlighted: boolean`, `onClick`
- State: 없음
- 동작: 테이블 번호, 총 주문액, 최신 주문 미리보기, 클릭 시 상세 모달

### OrderDetailModal
- Props: `open`, `onClose`, `table: Table`, `orders: Order[]`, `onStatusChange`, `onDelete`, `onComplete`, `onViewHistory`
- State: `loading`
- API: `PUT /api/orders/{id}/status`, `DELETE /api/orders/{id}`, `POST /api/tables/{id}/complete`
- 동작: 주문 상세, 상태 변경, 삭제, 이용 완료, 이력 보기

### TableManagePage
- Props: 없음
- State: `tables: Table[]`, `showForm: boolean`, `loading`
- API: `GET /api/tables?store_id=X`, `POST /api/tables`
- 동작: 테이블 목록, 추가 폼 토글

### TableSettingForm
- Props: `storeId: number`, `onSuccess: () => void`
- State: `tableNumber`, `password`, `loading`, `error`
- API: `POST /api/tables?store_id=X`
- 동작: 테이블 번호/비밀번호 입력, 생성

### OrderHistoryModal
- Props: `open`, `onClose`, `tableId: number`
- State: `history: OrderHistory[]`, `dateFilter`, `loading`
- API: `GET /api/tables/{id}/history?date=YYYY-MM-DD`
- 동작: 과거 주문 이력 표시, 날짜 필터링

### MenuManagePage
- Props: 없음
- State: `categories`, `menus`, `selectedCategory`, `editingMenu`, `showForm`, `loading`
- API: `GET /api/categories`, `GET /api/menus`, `DELETE /api/menus/{id}`
- 동작: 카테고리별 메뉴 목록, 추가/수정/삭제

### MenuForm
- Props: `menu?: Menu` (수정 시), `categories: Category[]`, `storeId: number`, `onSuccess`
- State: `name`, `price`, `description`, `categoryId`, `imageUrl`, `imageFile`, `loading`
- API: `POST /api/upload`, `POST /api/menus`, `PUT /api/menus/{id}`
- 동작: 메뉴 정보 입력, 이미지 업로드, 저장

---

## 3. 공유 컴포넌트

### ApiClient (api/client.ts)
- Axios 인스턴스 생성
- Request Interceptor: localStorage에서 JWT 토큰 읽어 헤더 첨부
- Response Interceptor: 401 시 토큰 삭제 + 로그인 리다이렉트

### AuthContext (contexts/AuthContext.tsx)
- State: `isAuthenticated`, `token`, `storeId`
- Methods: `login(token)`, `logout()`, `isTokenValid()`
- Provider: App 루트에서 감싸기

### ConfirmDialog
- Props: `open`, `title`, `message`, `onConfirm`, `onCancel`
- MUI Dialog 기반

### Toast
- Props: `open`, `message`, `severity: 'success' | 'error' | 'warning'`, `onClose`
- MUI Snackbar + Alert 기반
- 성공: 3초 자동 닫힘, 실패: 수동 닫힘

### Loading
- Props: `open: boolean`
- MUI Backdrop + CircularProgress 기반
