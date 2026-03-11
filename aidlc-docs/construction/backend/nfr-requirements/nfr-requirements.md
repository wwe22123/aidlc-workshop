# NFR Requirements - Backend

---

## 1. 성능 (Performance)

| ID | 요구사항 | 목표값 |
|----|---------|--------|
| NFR-PERF-01 | SSE 주문 이벤트 전달 지연 | 2초 이내 |
| NFR-PERF-02 | REST API 응답 시간 (일반) | 500ms 이내 |
| NFR-PERF-03 | 이미지 업로드 응답 시간 | 3초 이내 (5MB 기준) |
| NFR-PERF-04 | 동시 SSE 연결 수 | 최소 10개 (단일 매장) |

---

## 2. 보안 (Security)

| ID | 요구사항 | 구현 방식 |
|----|---------|----------|
| NFR-SEC-01 | 관리자 비밀번호 저장 | bcrypt 해싱 (cost factor 12) |
| NFR-SEC-02 | 관리자 인증 | JWT 토큰 (HS256, 16시간 만료) |
| NFR-SEC-03 | 로그인 시도 제한 | 5회 실패 시 15분 잠금 |
| NFR-SEC-04 | CORS 설정 | Frontend 도메인만 허용 |
| NFR-SEC-05 | 파일 업로드 검증 | 파일 타입 + 크기 제한 |
| NFR-SEC-06 | API 인가 | 관리자 전용 endpoint JWT 검증 |

---

## 3. 가용성/신뢰성 (Availability/Reliability)

| ID | 요구사항 | 구현 방식 |
|----|---------|----------|
| NFR-REL-01 | 데이터 영속성 | SQLite 파일 기반 (Docker volume) |
| NFR-REL-02 | SSE 연결 복구 | 클라이언트 자동 재연결 |
| NFR-REL-03 | 에러 처리 | 구조화된 에러 응답 (HTTP status + error_code) |
| NFR-REL-04 | 데이터 무결성 | DB 트랜잭션 + FK 제약조건 |
| NFR-REL-05 | 업로드 파일 보존 | Docker volume으로 영속 저장 |

---

## 4. 유지보수성 (Maintainability)

| ID | 요구사항 | 구현 방식 |
|----|---------|----------|
| NFR-MNT-01 | 코드 구조 | Router → Service → Model 3계층 분리 |
| NFR-MNT-02 | 설정 관리 | 환경 변수 기반 (pydantic-settings) |
| NFR-MNT-03 | API 문서 | FastAPI 자동 생성 (Swagger/OpenAPI) |
| NFR-MNT-04 | 타입 안전성 | Pydantic 스키마로 요청/응답 검증 |
