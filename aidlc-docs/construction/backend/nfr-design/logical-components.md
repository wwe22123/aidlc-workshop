# Logical Components - Backend

---

## 컴포넌트 구성도

```
+--------------------------------------------------+
|                FastAPI Application                |
|                                                  |
|  +------------------+  +---------------------+  |
|  | CORS Middleware   |  | Auth Middleware      |  |
|  +------------------+  | (JWT Verification)   |  |
|                        +---------------------+  |
|                                                  |
|  +----------------------------------------------+|
|  |              API Router Layer                 ||
|  | AuthRouter | MenuRouter | OrderRouter        ||
|  | TableRouter | UploadRouter | SSERouter        ||
|  +----------------------------------------------+|
|                        |                         |
|  +----------------------------------------------+|
|  |              Service Layer                    ||
|  | AuthService | MenuService | OrderService     ||
|  | TableService | SSEService                     ||
|  +----------------------------------------------+|
|                        |                         |
|  +----------------------------------------------+|
|  |         SQLAlchemy ORM + Pydantic Schemas     ||
|  | Models (9 entities) | Schemas (request/resp)  ||
|  +----------------------------------------------+|
|                        |                         |
+--------------------------------------------------+
                         |
                    +----v----+
                    | SQLite  |
                    | DB File |
                    +---------+
```

Text Alternative:
- FastAPI Application 내부 4개 레이어
- Layer 1: Middleware (CORS, Auth JWT)
- Layer 2: API Router (Auth, Menu, Order, Table, Upload, SSE)
- Layer 3: Service (Auth, Menu, Order, Table, SSE)
- Layer 4: SQLAlchemy ORM + Pydantic Schemas
- 외부: SQLite DB File

---

## 논리적 컴포넌트 상세

### 1. Middleware Layer
| 컴포넌트 | 패턴 | 설명 |
|---------|------|------|
| CORSMiddleware | Cross-Origin | Frontend 도메인 허용 |
| AuthMiddleware | JWT Bearer | 보호된 endpoint 토큰 검증 |

### 2. API Router Layer
| 컴포넌트 | 보호 수준 | 설명 |
|---------|----------|------|
| AuthRouter | Public | 로그인 endpoint |
| MenuRouter | Mixed | 조회(Public), 관리(Admin) |
| OrderRouter | Mixed | 생성(Table), 관리(Admin) |
| TableRouter | Admin | 테이블 관리 전용 |
| UploadRouter | Admin | 이미지 업로드 전용 |
| SSERouter | Admin | 실시간 이벤트 구독 |

### 3. Service Layer
| 컴포넌트 | 의존성 | 핵심 패턴 |
|---------|--------|----------|
| AuthService | Models, Config | JWT + bcrypt |
| MenuService | Models | CRUD + Validation |
| OrderService | Models, SSEService | Transaction + Event |
| TableService | Models | Session Lifecycle |
| SSEService | (독립) | AsyncQueue Broadcasting |

### 4. Data Layer
| 컴포넌트 | 기술 | 설명 |
|---------|------|------|
| SQLAlchemy Models | Declarative Base | 9개 Entity 정의 |
| Pydantic Schemas | BaseModel | 요청/응답 검증 |
| Database Session | SessionLocal | 요청별 세션 관리 |

### 5. Static File Serving
| 컴포넌트 | 경로 | 설명 |
|---------|------|------|
| StaticFiles Mount | /uploads | 업로드된 이미지 서빙 |
