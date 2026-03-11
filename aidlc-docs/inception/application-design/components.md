# 테이블오더 서비스 - Components

---

## 1. Backend Components (FastAPI)

### 1.1 API Layer (Routers)

| Component | 책임 |
|-----------|------|
| **AuthRouter** | 관리자 로그인, 테이블 태블릿 로그인, 토큰 검증 |
| **MenuRouter** | 메뉴 CRUD, 카테고리별 조회 |
| **OrderRouter** | 주문 생성, 조회, 상태 변경, 삭제 |
| **TableRouter** | 테이블 설정, 세션 관리, 이용 완료 처리 |
| **UploadRouter** | 이미지 파일 업로드, 정적 파일 서빙 |
| **SSERouter** | Server-Sent Events 연결 관리, 실시간 주문 이벤트 전송 |

### 1.2 Service Layer

| Component | 책임 |
|-----------|------|
| **AuthService** | 인증 로직, JWT 토큰 생성/검증, 비밀번호 해싱 |
| **MenuService** | 메뉴 비즈니스 로직, 카테고리 관리, 순서 조정 |
| **OrderService** | 주문 생성/조회/상태변경/삭제, 금액 계산 |
| **TableService** | 테이블 설정, 세션 시작/종료, 과거 이력 관리 |
| **SSEService** | SSE 연결 관리, 이벤트 브로드캐스트 |

### 1.3 Data Access Layer (Models/Repositories)

| Component | 책임 |
|-----------|------|
| **StoreModel** | 매장 데이터 모델 |
| **AdminModel** | 관리자 계정 데이터 모델 |
| **TableModel** | 테이블 데이터 모델 |
| **TableSessionModel** | 테이블 세션 데이터 모델 |
| **CategoryModel** | 메뉴 카테고리 데이터 모델 |
| **MenuModel** | 메뉴 항목 데이터 모델 |
| **OrderModel** | 주문 데이터 모델 |
| **OrderItemModel** | 주문 항목 데이터 모델 |
| **OrderHistoryModel** | 과거 주문 이력 데이터 모델 |

### 1.4 Infrastructure Components

| Component | 책임 |
|-----------|------|
| **Database** | SQLite 연결 관리, SQLAlchemy 세션 |
| **AuthMiddleware** | JWT 토큰 검증 미들웨어 |
| **CORSMiddleware** | CORS 설정 |
| **Config** | 환경 변수, 앱 설정 관리 |
| **SeedData** | 초기 데이터 생성 (매장, 관리자 계정) |

---

## 2. Frontend Components (React)

### 2.1 고객용 (Customer App)

| Component | 책임 |
|-----------|------|
| **CustomerApp** | 고객 앱 루트, 라우팅 |
| **LoginPage** | 테이블 초기 설정/자동 로그인 |
| **MenuPage** | 메뉴 목록 (기본 화면), 카테고리 탭 |
| **MenuCard** | 개별 메뉴 카드 (이미지, 이름, 가격, 설명) |
| **CartDrawer** | 장바구니 사이드 패널 |
| **CartItem** | 장바구니 개별 항목 (수량 조절) |
| **OrderConfirmPage** | 주문 확인 및 확정 |
| **OrderSuccessPage** | 주문 성공 (번호 표시, 5초 후 리다이렉트) |
| **OrderHistoryPage** | 주문 내역 목록 |
| **OrderHistoryItem** | 개별 주문 내역 카드 |

### 2.2 관리자용 (Admin App)

| Component | 책임 |
|-----------|------|
| **AdminApp** | 관리자 앱 루트, 라우팅 |
| **AdminLoginPage** | 관리자 로그인 |
| **DashboardPage** | 주문 모니터링 대시보드 (그리드 레이아웃) |
| **TableCard** | 테이블별 주문 카드 (총액, 최신 주문) |
| **OrderDetailModal** | 주문 상세 보기 모달 |
| **TableManagePage** | 테이블 관리 |
| **TableSettingForm** | 테이블 초기 설정 폼 |
| **OrderHistoryModal** | 과거 주문 내역 모달 |
| **MenuManagePage** | 메뉴 관리 (목록/등록/수정/삭제) |
| **MenuForm** | 메뉴 등록/수정 폼 (이미지 업로드 포함) |

### 2.3 공유 컴포넌트

| Component | 책임 |
|-----------|------|
| **ApiClient** | Axios 기반 API 호출 래퍼 |
| **AuthContext** | 인증 상태 관리 (Context API) |
| **ConfirmDialog** | 확인 팝업 공통 컴포넌트 |
| **Toast** | 성공/실패 피드백 알림 |
| **Loading** | 로딩 스피너 |
