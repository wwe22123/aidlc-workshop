# NFR Requirements - Frontend (table-order-frontend)

---

## 1. Performance

| ID | 요구사항 | 목표 |
|----|---------|------|
| NFR-FE-P01 | 초기 로딩 시간 | < 3초 (태블릿 Wi-Fi 환경) |
| NFR-FE-P02 | 페이지 전환 | < 500ms (SPA 라우팅) |
| NFR-FE-P03 | SSE 이벤트 반영 | < 2초 (실시간 주문 업데이트) |
| NFR-FE-P04 | 번들 사이즈 | < 500KB gzipped (초기 로드) |

---

## 2. Security

| ID | 요구사항 | 구현 방법 |
|----|---------|----------|
| NFR-FE-S01 | JWT 토큰 보안 | localStorage 저장, HTTPS 전송 |
| NFR-FE-S02 | XSS 방지 | React 기본 이스케이핑, dangerouslySetInnerHTML 미사용 |
| NFR-FE-S03 | 인증 만료 처리 | 401 응답 시 자동 로그아웃 + 리다이렉트 |
| NFR-FE-S04 | 입력 검증 | 클라이언트 + 서버 이중 검증 |

---

## 3. Usability / Accessibility

| ID | 요구사항 | 구현 방법 |
|----|---------|----------|
| NFR-FE-U01 | 태블릿 최적화 | 768px+ 뷰포트, 터치 타겟 44px+ |
| NFR-FE-U02 | 로딩 피드백 | API 호출 시 Loading 스피너 |
| NFR-FE-U03 | 에러 피드백 | Toast 알림 (성공/실패) |
| NFR-FE-U04 | 위험 작업 확인 | ConfirmDialog (삭제, 이용 완료) |

---

## 4. Tech Stack

| 항목 | 선택 | 근거 |
|------|------|------|
| Framework | React 18 + TypeScript | 타입 안전성, 생태계 |
| Build Tool | Vite | 빠른 HMR, 최적화된 빌드 |
| UI Library | Material UI (MUI) v5 | 풍부한 컴포넌트, 일관된 디자인 |
| HTTP Client | Axios | Interceptor 지원, 에러 처리 |
| Routing | React Router v6 | SPA 라우팅 표준 |
| State | React Context API | 간단, 추가 의존성 없음 |
| SSE | EventSource API | 브라우저 내장, 자동 재연결 |
| Deploy | Docker (Nginx) | 정적 파일 서빙 |
