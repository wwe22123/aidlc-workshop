# Functional Design Plan - Unit 1: Backend (table-order-backend)

---

## 질문

### Question 1
주문 상태 전이 규칙을 어떻게 설정하시겠습니까?

A) 단방향만 허용: 대기중 → 준비중 → 완료 (역방향 불가)
B) 유연한 전이: 대기중 ↔ 준비중 → 완료 (완료만 역방향 불가)
C) 완전 자유: 모든 상태 간 전이 가능
D) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2
테이블 세션 시작 시점은 언제입니까?

A) 첫 주문이 생성될 때 자동으로 세션 시작
B) 관리자가 수동으로 세션 시작 버튼을 누를 때
C) 테이블 태블릿이 로그인할 때 자동으로 세션 시작
D) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## 실행 계획

### Step 1: Domain Entity 상세 설계
- [x] 모든 Entity의 필드, 타입, 제약조건 정의
- [x] Entity 간 관계 (1:N, N:M) 정의
- [x] `domain-entities.md` 생성

### Step 2: Business Logic Model 설계
- [x] 주문 생성 플로우 상세 설계
- [x] 주문 상태 전이 로직
- [x] 테이블 세션 라이프사이클
- [x] 메뉴 관리 로직
- [x] 인증 플로우
- [x] `business-logic-model.md` 생성

### Step 3: Business Rules 정의
- [x] 데이터 검증 규칙
- [x] 비즈니스 제약조건
- [x] 에러 처리 규칙
- [x] `business-rules.md` 생성
