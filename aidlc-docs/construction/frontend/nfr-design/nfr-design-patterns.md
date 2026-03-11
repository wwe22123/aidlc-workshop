# NFR Design Patterns - Frontend (table-order-frontend)

---

## 1. API Client Pattern (Axios Interceptor)

### Request Interceptor
- localStorage에서 JWT 토큰 읽기
- `Authorization: Bearer {token}` 헤더 자동 첨부
- Content-Type 기본값: `application/json`

### Response Interceptor
- 401 Unauthorized: 토큰 삭제 → 로그인 페이지 리다이렉트
- 네트워크 에러: Toast로 "서버 연결 실패" 표시
- 4xx/5xx: 서버 에러 메시지 추출 → Toast 표시

---

## 2. Authentication Pattern

### Admin Auth Flow
- 로그인 성공 → JWT를 localStorage `admin_token`에 저장
- AuthContext에 상태 반영
- 보호된 라우트: AuthContext 확인 → 미인증 시 /admin/login 리다이렉트
- 로그아웃: localStorage 삭제 + AuthContext 초기화

### Table Auth Flow
- 초기 설정 → TableConfig를 localStorage `table_config`에 저장
- 앱 시작 시 자동 로그인 시도
- 실패 시 /login으로 이동

---

## 3. SSE Connection Pattern

### EventSource 관리
```
DashboardPage mount
  → new EventSource('/api/sse/orders?store_id=X')
  → onmessage: 이벤트 타입별 핸들링
  → onerror: 자동 재연결 (EventSource 기본 동작)
  → unmount: eventSource.close()
```

### 이벤트 핸들링
- `order_created`: 해당 테이블 주문 목록에 추가 + 카드 하이라이트
- `order_updated`: 해당 주문 상태 업데이트
- `order_deleted`: 해당 주문 목록에서 제거
- `session_completed`: 해당 테이블 주문 초기화

---

## 4. Error Handling Pattern

### 계층별 에러 처리
1. API Client (Axios Interceptor): 공통 에러 처리
2. Component Level: 개별 API 호출의 try-catch
3. UI Level: Toast/ConfirmDialog로 사용자 피드백

### 에러 표시 규칙
- 폼 검증 실패: 인라인 에러 메시지 (MUI TextField error)
- API 에러: Toast 알림
- 네트워크 에러: Toast + 재시도 안내

---

## 5. Code Splitting (Vite)

### Lazy Loading
- 고객 앱과 관리자 앱을 React.lazy로 분리
- 초기 로드 시 필요한 앱만 로드
- MUI 컴포넌트는 tree-shaking으로 최적화
