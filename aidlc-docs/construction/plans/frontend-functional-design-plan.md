# Functional Design Plan - Frontend (table-order-frontend)

## Unit Context
- **Unit**: table-order-frontend
- **Tech Stack**: React + TypeScript + Vite
- **Stories**: US-01 ~ US-09 (전체 9개)
- **Dependencies**: Backend API (Unit 1 완료)

---

## Plan Steps

### Step 1: Domain Entities & Types
- [x] 1.1 TypeScript 타입 정의 (API 응답/요청 타입, 공유 타입)

### Step 2: Business Logic Model
- [x] 2.1 고객 앱 플로우 (로그인 → 메뉴 → 장바구니 → 주문 → 내역)
- [x] 2.2 관리자 앱 플로우 (로그인 → 대시보드 → 테이블/메뉴 관리)
- [x] 2.3 상태 관리 전략 (Context API, localStorage)
- [x] 2.4 API 통신 패턴 (Axios client, 인증 헤더, 에러 처리)

### Step 3: Business Rules
- [x] 3.1 인증 규칙 (JWT 저장/만료/자동 로그아웃, 테이블 자동 로그인)
- [x] 3.2 장바구니 규칙 (localStorage 동기화, 수량 제한, 총액 계산)
- [x] 3.3 주문 규칙 (주문 확정 후 장바구니 비우기, 5초 리다이렉트)
- [x] 3.4 폼 검증 규칙 (메뉴 등록, 테이블 설정, 로그인)

### Step 4: Frontend Components Design
- [x] 4.1 고객용 컴포넌트 (Props, State, 인터랙션)
- [x] 4.2 관리자용 컴포넌트 (Props, State, 인터랙션)
- [x] 4.3 공유 컴포넌트 (ConfirmDialog, Toast, Loading)
- [x] 4.4 라우팅 구조

---

## Questions

### Q1: UI 스타일링 프레임워크
CSS 프레임워크/라이브러리 선택:

A) Tailwind CSS - Utility-first, 빠른 프로토타이핑
B) Material UI (MUI) - 풍부한 컴포넌트, 일관된 디자인
C) Chakra UI - 접근성 우수, 간결한 API
D) 순수 CSS Modules - 의존성 최소화
E) shadcn/ui + Tailwind - 커스터마이징 용이, 모던 스타일

[Answer]:

### Q2: 상태 관리 라이브러리
전역 상태 관리 방식:

A) React Context API만 사용 (간단, 추가 의존성 없음)
B) Zustand (경량, 간결한 API)
C) Redux Toolkit (강력하지만 보일러플레이트 많음)
D) Jotai (원자적 상태 관리)

[Answer]:

### Q3: 모바일 반응형 우선순위
고객용 UI의 주요 타겟 디바이스:

A) 태블릿 전용 (768px+ 최적화)
B) 모바일 + 태블릿 반응형
C) 태블릿 우선, 모바일 기본 지원

[Answer]:

