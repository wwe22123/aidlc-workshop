# NFR Design Patterns - Backend

---

## 1. 인증/보안 패턴

### JWT Authentication Pattern
- 관리자 로그인 시 JWT 토큰 발급 (HS256, 16시간 만료)
- 보호된 endpoint에 `Depends(get_current_admin)` 의존성 주입
- 토큰은 Authorization: Bearer 헤더로 전달
- 만료된 토큰은 401 응답

### Password Hashing Pattern
- bcrypt (cost factor 12) 사용
- passlib의 CryptContext로 해싱/검증 추상화
- 평문 비밀번호는 절대 저장하지 않음

### Rate Limiting Pattern (Login)
- DB 기반 로그인 시도 카운터 (login_attempts 필드)
- 5회 실패 시 locked_until = now + 15분
- 잠금 해제 후 카운터 리셋

---

## 2. 실시간 통신 패턴

### SSE (Server-Sent Events) Pattern
- 매장별 연결 관리 (store_id → Set[Queue])
- asyncio.Queue 기반 이벤트 전달
- 연결 시 Queue 등록, 해제 시 Queue 제거
- 이벤트 발생 시 해당 매장의 모든 Queue에 이벤트 push
- 클라이언트 자동 재연결 (EventSource 기본 동작)

### Event Broadcasting Flow
```
OrderService → SSEService.broadcast(store_id, event)
                    ↓
              store_connections[store_id]
                    ↓
              Queue1.put(event), Queue2.put(event), ...
                    ↓
              SSE endpoint → yield event → Client
```

---

## 3. 데이터 접근 패턴

### Repository Pattern (via SQLAlchemy Session)
- FastAPI Depends로 DB 세션 주입
- 각 요청마다 독립 세션 (get_db generator)
- 트랜잭션: 성공 시 commit, 실패 시 rollback
- Service 레이어에서 비즈니스 로직 처리

### Snapshot Pattern (OrderItem)
- 주문 시점의 메뉴명/단가를 OrderItem에 복사
- 메뉴 변경이 기존 주문에 영향 없음

---

## 4. 에러 처리 패턴

### Structured Error Response
- HTTPException으로 일관된 에러 응답
- 형식: `{"detail": "메시지", "error_code": "BR-XXX-XX"}`
- 비즈니스 규칙 위반: 400
- 인증 실패: 401
- 권한 없음: 403
- 리소스 없음: 404
- 입력 검증: 422 (Pydantic 자동)

---

## 5. 설정 관리 패턴

### Environment-based Configuration
- pydantic-settings의 BaseSettings 사용
- .env 파일 또는 환경 변수에서 설정 로드
- 설정 항목: DB URL, JWT secret, JWT 만료시간, 업로드 경로, CORS origins
