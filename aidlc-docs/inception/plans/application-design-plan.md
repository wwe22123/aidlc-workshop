# Application Design Plan - 테이블오더 서비스

## 설계 범위
- FastAPI Backend 컴포넌트 구조
- React Frontend 컴포넌트 구조 (고객용/관리자용)
- 서비스 레이어 설계
- 컴포넌트 간 의존성 및 통신 패턴

## 실행 계획

### Step 1: Backend 컴포넌트 식별
- [x] API Router 컴포넌트 정의 (Auth, Menu, Order, Table, Upload)
- [x] Service 레이어 컴포넌트 정의
- [x] Data Access 레이어 (Repository/Model) 정의
- [x] 공통 컴포넌트 정의 (Auth middleware, SSE manager, Config)

### Step 2: Frontend 컴포넌트 식별
- [x] 고객용 페이지/컴포넌트 정의
- [x] 관리자용 페이지/컴포넌트 정의
- [x] 공유 컴포넌트 정의

### Step 3: 설계 산출물 생성
- [x] components.md 생성
- [x] component-methods.md 생성
- [x] services.md 생성
- [x] component-dependency.md 생성

### Step 4: 검증
- [x] 설계 완전성 및 일관성 검증
