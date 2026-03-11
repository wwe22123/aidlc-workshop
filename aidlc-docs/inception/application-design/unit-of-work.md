# 테이블오더 서비스 - Units of Work

---

## Unit 1: Backend (table-order-backend)

### 개요
| 항목 | 내용 |
|------|------|
| **Unit 이름** | table-order-backend |
| **기술 스택** | FastAPI + SQLAlchemy + SQLite |
| **책임** | REST API, SSE, 인증, 비즈니스 로직, 데이터 관리 |
| **배포 단위** | Docker 컨테이너 (FastAPI 서버) |

### 포함 컴포넌트
- API Layer: AuthRouter, MenuRouter, OrderRouter, TableRouter, UploadRouter, SSERouter
- Service Layer: AuthService, MenuService, OrderService, TableService, SSEService
- Data Layer: 모든 Model (Store, Admin, Table, TableSession, Category, Menu, Order, OrderItem, OrderHistory)
- Infrastructure: Database, AuthMiddleware, CORSMiddleware, Config, SeedData

### 디렉토리 구조
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI 앱 진입점
│   ├── config.py             # 설정 관리
│   ├── database.py           # SQLAlchemy 설정
│   ├── seed.py               # 초기 데이터
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── menu.py
│   │   ├── order.py
│   │   ├── table.py
│   │   ├── upload.py
│   │   └── sse.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   ├── menu_service.py
│   │   ├── order_service.py
│   │   ├── table_service.py
│   │   └── sse_service.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── store.py
│   │   ├── admin.py
│   │   ├── table.py
│   │   ├── table_session.py
│   │   ├── category.py
│   │   ├── menu.py
│   │   ├── order.py
│   │   ├── order_item.py
│   │   └── order_history.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── menu.py
│   │   ├── order.py
│   │   └── table.py
│   └── middleware/
│       ├── __init__.py
│       └── auth_middleware.py
├── uploads/                  # 이미지 업로드 디렉토리
├── requirements.txt
└── Dockerfile
```

---

## Unit 2: Frontend (table-order-frontend)

### 개요
| 항목 | 내용 |
|------|------|
| **Unit 이름** | table-order-frontend |
| **기술 스택** | React + TypeScript + Vite |
| **책임** | 고객용 UI, 관리자용 UI, API 통신, 상태 관리 |
| **배포 단위** | Docker 컨테이너 (Nginx + 정적 파일) |

### 포함 컴포넌트
- 고객용: CustomerApp, LoginPage, MenuPage, MenuCard, CartDrawer, CartItem, OrderConfirmPage, OrderSuccessPage, OrderHistoryPage, OrderHistoryItem
- 관리자용: AdminApp, AdminLoginPage, DashboardPage, TableCard, OrderDetailModal, TableManagePage, TableSettingForm, OrderHistoryModal, MenuManagePage, MenuForm
- 공유: ApiClient, AuthContext, ConfirmDialog, Toast, Loading

### 디렉토리 구조
```
frontend/
├── src/
│   ├── main.tsx              # 앱 진입점
│   ├── App.tsx               # 루트 라우터
│   ├── api/
│   │   └── client.ts         # Axios API 클라이언트
│   ├── contexts/
│   │   └── AuthContext.tsx    # 인증 상태 관리
│   ├── customer/
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── MenuPage.tsx
│   │   │   ├── OrderConfirmPage.tsx
│   │   │   ├── OrderSuccessPage.tsx
│   │   │   └── OrderHistoryPage.tsx
│   │   └── components/
│   │       ├── MenuCard.tsx
│   │       ├── CartDrawer.tsx
│   │       ├── CartItem.tsx
│   │       └── OrderHistoryItem.tsx
│   ├── admin/
│   │   ├── pages/
│   │   │   ├── AdminLoginPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── TableManagePage.tsx
│   │   │   └── MenuManagePage.tsx
│   │   └── components/
│   │       ├── TableCard.tsx
│   │       ├── OrderDetailModal.tsx
│   │       ├── TableSettingForm.tsx
│   │       ├── OrderHistoryModal.tsx
│   │       └── MenuForm.tsx
│   ├── shared/
│   │   ├── ConfirmDialog.tsx
│   │   ├── Toast.tsx
│   │   └── Loading.tsx
│   └── types/
│       └── index.ts          # TypeScript 타입 정의
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── Dockerfile
```

---

## Monorepo 루트 구조
```
aidlc-workshop/              # Workspace root
├── backend/                 # Unit 1: Backend
├── frontend/                # Unit 2: Frontend
├── docker-compose.yml       # Docker Compose 설정
├── aidlc-docs/              # AIDLC 문서 (코드 아님)
├── requirements/            # 요구사항 원본
└── ...
```
