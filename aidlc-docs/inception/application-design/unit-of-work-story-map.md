# 테이블오더 서비스 - Unit of Work Story Map

---

## Story-Unit 매핑

| Story | 제목 | Backend | Frontend |
|-------|------|:-------:|:--------:|
| US-01 | 테이블 자동 로그인 | ✅ (API: 테이블 인증) | ✅ (UI: 로그인 화면, localStorage) |
| US-02 | 메뉴 조회 및 탐색 | ✅ (API: 메뉴/카테고리 조회) | ✅ (UI: 메뉴 화면, 카드 레이아웃) |
| US-03 | 장바구니 관리 | ❌ (클라이언트 전용) | ✅ (UI: 장바구니, localStorage) |
| US-04 | 주문 생성 | ✅ (API: 주문 생성, SSE 발행) | ✅ (UI: 주문 확인/성공 화면) |
| US-05 | 주문 내역 조회 | ✅ (API: 세션별 주문 조회) | ✅ (UI: 주문 내역 화면) |
| US-06 | 매장 관리자 인증 | ✅ (API: JWT 인증) | ✅ (UI: 관리자 로그인) |
| US-07 | 실시간 주문 모니터링 | ✅ (API: SSE endpoint, 상태 변경) | ✅ (UI: 대시보드, SSE 수신) |
| US-08 | 테이블 관리 | ✅ (API: 설정/삭제/세션종료/이력) | ✅ (UI: 테이블 관리 화면) |
| US-09 | 메뉴 관리 | ✅ (API: CRUD, 이미지 업로드) | ✅ (UI: 메뉴 관리 화면) |

---

## Unit별 Story 요약

### Unit 1: Backend (table-order-backend)
- 담당 Story: US-01, US-02, US-04, US-05, US-06, US-07, US-08, US-09 (8개)
- US-03 (장바구니)은 클라이언트 전용이므로 Backend 작업 없음

### Unit 2: Frontend (table-order-frontend)
- 담당 Story: US-01 ~ US-09 (9개 전체)
- 모든 Story에 UI 작업 포함

---

## 검증
- [x] 모든 9개 Story가 최소 1개 Unit에 할당됨
- [x] 모든 컴포넌트가 Unit에 포함됨
- [x] 의존성 방향 일관성 확인 (Frontend → Backend)
