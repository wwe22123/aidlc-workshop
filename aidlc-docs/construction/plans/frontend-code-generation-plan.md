# Standard Code Generation Plan - Frontend (table-order-frontend)

## Unit Context
- **Unit**: table-order-frontend
- **Tech Stack**: React 18 + TypeScript + Vite + MUI v5
- **Code Location**: frontend/
- **Stories**: US-01 ~ US-09 (전체 9개)
- **Dependencies**: Backend API (Unit 1 완료)

---

### Step 0: Project Setup
- [x] 0.1 frontend/ 디렉토리 구조 생성
- [x] 0.2 package.json 생성
- [x] 0.3 tsconfig.json, vite.config.ts 설정
- [x] 0.4 index.html, src/main.tsx 진입점
- [x] 0.5 src/types/index.ts (TypeScript 타입 정의)
- [x] 0.6 Dockerfile (multi-stage: Node build + Nginx serve)

### Step 1: Shared Infrastructure
- [x] 1.1 src/api/client.ts (Axios 인스턴스, Interceptor)
- [x] 1.2 src/contexts/AuthContext.tsx (관리자 인증 Context)
- [x] 1.3 src/shared/ConfirmDialog.tsx
- [x] 1.4 src/shared/Toast.tsx
- [x] 1.5 src/shared/Loading.tsx

### Step 2: App Router & Layout
- [x] 2.1 src/App.tsx (Root Router - 고객/관리자 분기)

### Step 3: Customer Pages (US-01, US-02, US-03, US-04, US-05)
- [x] 3.1 src/customer/pages/LoginPage.tsx (US-01: 테이블 자동 로그인)
- [x] 3.2 src/customer/components/MenuCard.tsx (US-02: 메뉴 카드)
- [x] 3.3 src/customer/components/CartItem.tsx (US-03: 장바구니 항목)
- [x] 3.4 src/customer/components/CartDrawer.tsx (US-03: 장바구니 Drawer)
- [x] 3.5 src/customer/pages/MenuPage.tsx (US-02, US-03: 메뉴 + 장바구니)
- [x] 3.6 src/customer/pages/OrderConfirmPage.tsx (US-04: 주문 확인)
- [x] 3.7 src/customer/pages/OrderSuccessPage.tsx (US-04: 주문 성공)
- [x] 3.8 src/customer/components/OrderHistoryItem.tsx (US-05)
- [x] 3.9 src/customer/pages/OrderHistoryPage.tsx (US-05: 주문 내역)

### Step 4: Admin Pages (US-06, US-07, US-08, US-09)
- [x] 4.1 src/admin/pages/AdminLoginPage.tsx (US-06: 관리자 로그인)
- [x] 4.2 src/admin/components/TableCard.tsx (US-07: 테이블 카드)
- [x] 4.3 src/admin/components/OrderDetailModal.tsx (US-07, US-08: 주문 상세)
- [x] 4.4 src/admin/components/OrderHistoryModal.tsx (US-08: 이력 모달)
- [x] 4.5 src/admin/pages/DashboardPage.tsx (US-07: 대시보드 + SSE)
- [x] 4.6 src/admin/components/TableSettingForm.tsx (US-08: 테이블 설정)
- [x] 4.7 src/admin/pages/TableManagePage.tsx (US-08: 테이블 관리)
- [x] 4.8 src/admin/components/MenuForm.tsx (US-09: 메뉴 폼)
- [x] 4.9 src/admin/pages/MenuManagePage.tsx (US-09: 메뉴 관리)

### Step 5: Docker & Build
- [x] 5.1 docker-compose.yml 업데이트 (frontend 서비스 추가)
- [x] 5.2 npm install & build 검증
