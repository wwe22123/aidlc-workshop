# 테이블오더 서비스 요구사항 문서

## Intent Analysis Summary

| 항목 | 내용 |
|------|------|
| **User Request** | 테이블오더 서비스 개발 |
| **Request Type** | New Project (Greenfield) |
| **Scope Estimate** | Multiple Components (고객 UI, 관리자 UI, Backend API, Database) |
| **Complexity Estimate** | Complex (실시간 SSE, JWT 인증, 세션 관리, 다수 CRUD) |
| **Requirements Depth** | Standard |

---

## 기술 스택 결정사항

| 영역 | 선택 |
|------|------|
| **Backend** | FastAPI (Python) |
| **Frontend** | React (TypeScript) |
| **Database** | SQLite |
| **배포 환경** | 로컬 개발 환경 (Docker Compose) |
| **이미지 처리** | 서버에 이미지 파일 업로드 후 URL 자동 생성 |
| **관리자 계정** | 사전 정의된 관리자 계정 1개 (seed data) |
| **매장 데이터** | 단일 매장 (seed data로 1개 매장 생성) |
| **프로젝트 구조** | Monorepo (Frontend + Backend 하나의 저장소) |

---

## 1. Functional Requirements (기능 요구사항)

### 1.1 고객용 기능 (Customer Features)

#### FR-C01: 테이블 태블릿 자동 로그인 및 세션 관리
- 관리자가 초기 설정 시 매장 식별자, 테이블 번호, 테이블 비밀번호 입력
- 로그인 정보 로컬 저장 (localStorage)
- 1회 로그인 성공 후 자동 로그인 활성화

#### FR-C02: 메뉴 조회 및 탐색
- 메뉴 화면이 기본 화면으로 항상 표시
- 카테고리별 메뉴 분류 및 표시
- 메뉴 상세 정보: 메뉴명, 가격, 설명, 이미지
- 카테고리 간 빠른 이동
- 카드 형태 레이아웃, 터치 친화적 버튼 (최소 44x44px)

#### FR-C03: 장바구니 관리
- 메뉴 추가/삭제, 수량 조절 (증가/감소)
- 총 금액 실시간 계산
- 장바구니 비우기
- 클라이언트 측 로컬 저장 (페이지 새로고침 시 유지)
- 서버 전송은 주문 확정 시에만 수행

#### FR-C04: 주문 생성
- 주문 내역 최종 확인 후 주문 확정
- 주문 성공 시: 주문 번호 표시, 장바구니 자동 비우기, 5초 후 메뉴 화면 자동 리다이렉트
- 주문 실패 시: 에러 메시지 표시, 장바구니 유지
- 주문 정보: 매장 ID, 테이블 ID, 메뉴 목록(메뉴명, 수량, 단가), 총 금액, 세션 ID

#### FR-C05: 주문 내역 조회
- 주문 시간 순 정렬
- 주문별 상세: 주문 번호, 시각, 메뉴/수량, 금액, 상태(대기중/준비중/완료)
- 현재 테이블 세션 주문만 표시 (이전 세션 제외)
- 매장 이용 완료 처리된 주문 제외

### 1.2 관리자용 기능 (Admin Features)

#### FR-A01: 매장 인증
- 매장 식별자, 사용자명, 비밀번호 입력
- JWT 토큰 기반 인증
- 16시간 세션 유지, 브라우저 새로고침 시 세션 유지
- 16시간 후 자동 로그아웃
- 비밀번호 bcrypt 해싱
- 로그인 시도 제한

#### FR-A02: 실시간 주문 모니터링
- SSE (Server-Sent Events) 기반 실시간 주문 목록 업데이트
- 그리드/대시보드 레이아웃: 테이블별 카드 형태
- 각 테이블 카드: 총 주문액, 최신 주문 미리보기
- 주문 카드 클릭 시 전체 메뉴 목록 상세 보기
- 주문 상태 변경 (대기중 → 준비중 → 완료)
- 신규 주문 시각적 강조 (색상 변경, 애니메이션)
- 2초 이내 주문 표시
- 테이블별 필터링

#### FR-A03: 테이블 관리
- 테이블 태블릿 초기 설정 (테이블 번호, 비밀번호, 16시간 세션)
- 주문 삭제 (확인 팝업 → 즉시 삭제 → 총 주문액 재계산)
- 테이블 세션 종료 (이용 완료): 주문 내역 과거 이력 이동, 주문 목록/총액 리셋
- 과거 주문 내역 조회: 테이블별 과거 주문 목록 (시간 역순), 날짜 필터링

#### FR-A04: 메뉴 관리
- 메뉴 CRUD (등록/조회/수정/삭제)
- 메뉴 정보: 메뉴명, 가격, 설명, 카테고리, 이미지 (파일 업로드)
- 카테고리별 조회
- 메뉴 노출 순서 조정
- 필수 필드 검증, 가격 범위 검증

---

## 2. Non-Functional Requirements (비기능 요구사항)

### NFR-01: 성능
- SSE 기반 실시간 통신: 주문 발생 후 2초 이내 관리자 화면 표시
- 메뉴 조회 API 응답 시간: 500ms 이내

### NFR-02: 보안
- JWT 토큰 기반 관리자 인증 (16시간 만료)
- 비밀번호 bcrypt 해싱
- 로그인 시도 제한
- CORS 설정

### NFR-03: 사용성
- 터치 친화적 UI (최소 44x44px 버튼)
- 반응형 디자인 (태블릿 최적화)
- 직관적인 시각적 계층 구조

### NFR-04: 데이터 관리
- SQLite 단일 파일 데이터베이스
- 장바구니: 클라이언트 localStorage
- 주문 이력: OrderHistory 테이블, 세션 ID로 그룹화

### NFR-05: 배포
- Docker Compose 기반 로컬 개발 환경
- Frontend + Backend Monorepo 구조

---

## 3. 제외 기능 (Out of Scope)

requirements/constraints.md에 정의된 대로 다음 기능은 구현하지 않음:
- 실제 결제 처리, PG사 연동, 영수증, 환불, 포인트/쿠폰
- OAuth, SNS 로그인, 2FA
- 이미지 리사이징/최적화, CMS, 광고
- 푸시/SMS/이메일 알림
- 주방 전달, 식재료 재고 관리
- 데이터 분석, 매출 리포트, 재고 관리, 직원 관리, 예약, 리뷰, 다국어
- 배달 플랫폼, POS, 소셜 미디어, 지도/번역 API 연동

---

## 4. 데이터 모델 개요

### 핵심 Entity
- **Store**: 매장 정보 (seed data 1개)
- **Admin**: 관리자 계정 (seed data 1개)
- **Table**: 테이블 정보 (매장 내 테이블)
- **TableSession**: 테이블 세션 (고객 이용 시작~종료)
- **Category**: 메뉴 카테고리
- **Menu**: 메뉴 항목
- **Order**: 주문
- **OrderItem**: 주문 항목 (메뉴별)
- **OrderHistory**: 과거 주문 이력 (세션 종료 시 이동)

---

## 5. 시스템 구성 요약

```
+-------------------+     +-------------------+     +----------+
|   Customer UI     |     |    Admin UI       |     |          |
|   (React)         |---->|    (React)        |---->|  SQLite  |
|   - Menu Browse   |     |    - Dashboard    |     |          |
|   - Cart          |     |    - Order Mgmt   |     +----------+
|   - Order         |     |    - Table Mgmt   |          ^
|   - Order History |     |    - Menu Mgmt    |          |
+-------------------+     +-------------------+          |
         |                         |                     |
         v                         v                     |
+------------------------------------------------+      |
|              FastAPI Backend                    |------+
|  - REST API                                    |
|  - SSE (Server-Sent Events)                    |
|  - JWT Authentication                          |
|  - Image Upload                                |
+------------------------------------------------+
```

Text Alternative:
- Customer UI (React): 메뉴 조회, 장바구니, 주문, 주문 내역
- Admin UI (React): 대시보드, 주문 관리, 테이블 관리, 메뉴 관리
- FastAPI Backend: REST API, SSE, JWT 인증, 이미지 업로드
- SQLite: 데이터 저장소
- Customer UI와 Admin UI 모두 FastAPI Backend와 통신
- FastAPI Backend가 SQLite와 통신
