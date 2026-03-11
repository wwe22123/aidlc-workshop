# Integration Test Instructions - Full Stack (Backend + Frontend)

## Purpose
서비스 간 상호작용과 전체 API 워크플로우가 올바르게 동작하는지 검증합니다.

## 현재 상태
API Integration 테스트가 TDD 과정에서 이미 구현 및 통과되었습니다 (`tests/test_api.py`, 9개 테스트).

## Test Scenarios

### Scenario 1: 관리자 인증 → 메뉴 관리 워크플로우
- Auth API로 관리자 로그인 → JWT 토큰 획득
- 토큰으로 메뉴 생성 API 호출
- 카테고리 조회 API로 결과 확인
- 테스트: `TestMenuAPI.test_create_menu_api`

### Scenario 2: 테이블 인증 → 주문 생성 → 상태 변경
- 테이블 로그인 → table_id 획득
- 주문 생성 API 호출 (자동 세션 생성)
- 관리자 로그인 → 주문 상태 변경 (PENDING → PREPARING)
- 테스트: `TestOrderAPI.test_create_order_api`, `test_update_order_status_api`

### Scenario 3: 관리자 인증 → 테이블 설정 → 목록 조회
- 관리자 로그인 → JWT 토큰 획득
- 테이블 설정 API 호출
- 테이블 목록 조회 API로 결과 확인
- 테스트: `TestTableAPI.test_setup_table_api`, `test_get_tables_api`

## Run Integration Tests

```bash
cd backend
python -m pytest tests/test_api.py -v
```

### Expected Output
```
9 passed
```

## 추가 Integration Test 시나리오 (수동 테스트)

서버 실행 후 curl/httpie로 전체 워크플로우를 수동 검증할 수 있습니다:

```bash
# 1. 서버 실행
uvicorn app.main:app --port 8000

# 2. 관리자 로그인
curl -X POST http://localhost:8000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"store_identifier":"demo-store","username":"admin","password":"admin1234"}'

# 3. 토큰으로 카테고리 조회
curl http://localhost:8000/api/categories?store_id=1

# 4. 테이블 로그인
curl -X POST http://localhost:8000/api/auth/table/login \
  -H "Content-Type: application/json" \
  -d '{"store_identifier":"demo-store","table_number":1,"password":"table1"}'

# 5. 주문 생성
curl -X POST http://localhost:8000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"store_id":1,"table_id":1,"items":[{"menu_id":1,"quantity":2}]}'
```

---

# E2E Integration Test - Frontend ↔ Backend

## Purpose
Frontend와 Backend 간의 전체 워크플로우가 올바르게 동작하는지 수동으로 검증합니다.

## 사전 준비

```bash
# 1. Backend 실행
cd backend
pip install -r requirements.txt
uvicorn app.main:app --port 8000 --reload

# 2. Frontend 실행 (별도 터미널)
cd frontend
npm install
npm run dev
# http://localhost:5173 접속
```

## Test Scenarios

### Scenario 1: 고객 주문 워크플로우 (US-01 ~ US-05)

1. `http://localhost:5173/login` 접속
2. 매장 식별자: `demo-store`, 테이블 번호: `1`, 비밀번호: `table1` 입력
3. 로그인 성공 → `/menu` 페이지로 이동 확인
4. 카테고리 탭 전환 → 메뉴 목록 변경 확인
5. 메뉴 카드 클릭 → 장바구니에 추가 확인
6. 장바구니 아이콘 클릭 → CartDrawer 열림 확인
7. 수량 변경 (+/-) → 금액 재계산 확인
8. "주문하기" 클릭 → `/order/confirm` 이동 확인
9. "주문 확정" 클릭 → `/order/success` 이동, 주문번호 표시 확인
10. 5초 후 `/menu`로 자동 이동 확인
11. 주문 내역 페이지 → 방금 주문 표시 확인

### Scenario 2: 관리자 로그인 및 대시보드 (US-06, US-07)

1. `http://localhost:5173/admin/login` 접속
2. 매장 식별자: `demo-store`, 아이디: `admin`, 비밀번호: `admin1234` 입력
3. 로그인 성공 → `/admin/dashboard` 이동 확인
4. 테이블 그리드 표시 확인
5. SSE 연결 상태 "실시간 연결" 표시 확인
6. 고객이 주문 시 → 테이블 카드 하이라이트 확인
7. 테이블 카드 클릭 → OrderDetailModal 열림 확인
8. 주문 상태 변경 (대기 → 준비중 → 완료) 확인
9. "이용 완료" 클릭 → 세션 종료 확인

### Scenario 3: 테이블 관리 (US-08)

1. 사이드바 "테이블 관리" 클릭 → `/admin/tables` 이동
2. 기존 테이블 목록 표시 확인
3. 새 테이블 추가 (번호: 99, 비밀번호: test1234)
4. 목록에 새 테이블 추가 확인

### Scenario 4: 메뉴 관리 (US-09)

1. 사이드바 "메뉴 관리" 클릭 → `/admin/menus` 이동
2. 카테고리 탭 전환 → 메뉴 필터링 확인
3. "메뉴 추가" 클릭 → MenuForm 다이얼로그 열림
4. 메뉴 정보 입력 + 이미지 업로드 → 저장
5. 목록에 새 메뉴 추가 확인
6. "수정" 클릭 → 기존 정보 로드 → 수정 → 저장
7. "삭제" 클릭 → 확인 다이얼로그 → 삭제 확인

## Docker Compose 통합 테스트

```bash
# 프로젝트 루트에서
docker-compose up --build

# Frontend: http://localhost:3000
# Backend: http://localhost:8000
# 위 시나리오를 http://localhost:3000 에서 동일하게 수행
```
