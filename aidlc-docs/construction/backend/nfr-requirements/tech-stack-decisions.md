# Tech Stack Decisions - Backend

---

## 핵심 프레임워크

| 패키지 | 버전 | 용도 |
|--------|------|------|
| fastapi | latest | 웹 프레임워크 |
| uvicorn | latest | ASGI 서버 |
| sqlalchemy | latest | ORM (선언적 모델) |
| pydantic | latest | 데이터 검증 (FastAPI 내장) |
| pydantic-settings | latest | 환경 변수 설정 관리 |

## 인증/보안

| 패키지 | 버전 | 용도 |
|--------|------|------|
| python-jose[cryptography] | latest | JWT 토큰 생성/검증 |
| passlib[bcrypt] | latest | bcrypt 비밀번호 해싱 |

## 파일 처리

| 패키지 | 버전 | 용도 |
|--------|------|------|
| python-multipart | latest | 파일 업로드 (multipart/form-data) |
| aiofiles | latest | 비동기 파일 I/O |

## SSE

| 패키지 | 버전 | 용도 |
|--------|------|------|
| sse-starlette | latest | Server-Sent Events 지원 |

## CORS

| 패키지 | 용도 |
|--------|------|
| fastapi.middleware.cors | CORS 미들웨어 (FastAPI 내장) |

---

## 패키지 관리

| 항목 | 선택 |
|------|------|
| **패키지 관리자** | pip |
| **의존성 파일** | requirements.txt |
| **가상환경** | venv (Python 내장) |

---

## 데이터베이스

| 항목 | 선택 |
|------|------|
| **DB 엔진** | SQLite |
| **ORM** | SQLAlchemy ORM (선언적 모델) |
| **마이그레이션** | 초기 테이블 자동 생성 (create_all) |
| **연결 문자열** | sqlite:///./table_order.db |

---

## requirements.txt (예상)

```
fastapi
uvicorn[standard]
sqlalchemy
pydantic-settings
python-jose[cryptography]
passlib[bcrypt]
python-multipart
aiofiles
sse-starlette
```
