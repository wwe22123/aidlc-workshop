# Business Rules - Frontend (table-order-frontend)

---

## 1. 인증 규칙

### BR-FE-001: 관리자 JWT 관리
- JWT 토큰은 localStorage `admin_token` 키에 저장
- 16시간 만료 (서버 설정과 동일)
- 모든 관리자 API 요청에 `Authorization: Bearer {token}` 헤더 첨부
- 401 응답 수신 시 토큰 삭제 후 로그인 페이지로 리다이렉트
- 브라우저 새로고침 시 토큰 존재하면 자동 인증 유지

### BR-FE-002: 테이블 자동 로그인
- 초기 설정 정보는 localStorage `table_config` 키에 저장
- 브라우저 열 때 `table_config` 존재하면 자동 로그인 시도
- 자동 로그인 실패 시 초기 설정 화면으로 이동
- 초기 설정: store_identifier, table_number, password 입력

---

## 2. 장바구니 규칙

### BR-FE-003: 장바구니 데이터 관리
- localStorage `cart_items` 키에 JSON 배열로 저장
- 동일 메뉴 추가 시 수량 증가 (중복 항목 병합)
- 수량 최소값: 1, 최대값: 99
- 수량 0 이하로 감소 시 항목 삭제
- 총액 = SUM(price * quantity)

### BR-FE-004: 장바구니 라이프사이클
- 페이지 새로고침 시 유지 (localStorage)
- 주문 확정 성공 시 자동 비우기
- 주문 실패 시 장바구니 유지
- 장바구니 비우기 버튼으로 수동 초기화 가능

---

## 3. 주문 규칙

### BR-FE-005: 주문 생성
- 장바구니가 비어있으면 주문 불가 (버튼 비활성화)
- 주문 확정 전 최종 확인 화면 표시 (OrderConfirmPage)
- 주문 성공 시: 장바구니 비우기 → OrderSuccessPage → 5초 후 MenuPage 자동 이동
- 주문 실패 시: 에러 Toast 표시, 장바구니 유지

### BR-FE-006: 주문 상태 표시
- PENDING: "대기중" (노란색)
- PREPARING: "준비중" (파란색)
- COMPLETED: "완료" (초록색)

### BR-FE-007: 주문 내역 범위
- 현재 세션의 주문만 표시
- 이전 세션 주문은 표시하지 않음
- 시간 순 정렬 (최신 먼저)

---

## 4. 폼 검증 규칙

### BR-FE-008: 관리자 로그인 폼
- store_identifier: 필수, 1~50자
- username: 필수, 1~50자
- password: 필수, 4자 이상

### BR-FE-009: 테이블 초기 설정 폼
- store_identifier: 필수, 1~50자
- table_number: 필수, 1 이상 정수
- password: 필수, 4자 이상

### BR-FE-010: 메뉴 등록/수정 폼
- name: 필수, 1~100자
- price: 필수, 1~1,000,000 정수
- category_id: 필수
- description: 선택
- image_url: 선택 (이미지 업로드 후 자동 설정)

### BR-FE-011: 테이블 설정 폼 (관리자)
- table_number: 필수, 1 이상 정수
- password: 필수, 4자 이상

---

## 5. UI/UX 규칙

### BR-FE-012: 태블릿 최적화
- 최소 뷰포트: 768px
- 터치 타겟 최소 크기: 44x44px
- 메뉴 카드 그리드: 2~3열 (태블릿 가로 기준)
- 관리자 대시보드: 테이블 카드 그리드 레이아웃

### BR-FE-013: 실시간 업데이트 (관리자)
- SSE 연결로 주문 이벤트 수신
- 신규 주문: 해당 테이블 카드 시각적 강조 (색상/애니메이션)
- 상태 변경: 즉시 UI 반영
- SSE 연결 끊김 시 자동 재연결

### BR-FE-014: 사용자 피드백
- 성공 작업: 초록색 Toast (3초 자동 닫힘)
- 실패 작업: 빨간색 Toast (수동 닫힘)
- 위험 작업 (삭제, 이용 완료): ConfirmDialog 필수
- API 호출 중: Loading 스피너 표시
