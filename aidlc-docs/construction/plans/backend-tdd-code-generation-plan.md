# TDD Code Generation Plan - Backend (table-order-backend)

## Unit Context
- **Workspace Root**: c:\Users\wwe22\OneDrive\Desktop\workshop\aidlc-workshop
- **Project Type**: Greenfield (multi-unit)
- **Code Location**: backend/
- **Stories**: US-01, US-02, US-04, US-05, US-06, US-07, US-08, US-09

---

### Plan Step 0: Project Setup & Contract Skeleton
- [x] 0.1 backend/ 디렉토리 구조 생성
- [x] 0.2 requirements.txt 생성
- [x] 0.3 app/config.py (설정 관리)
- [x] 0.4 app/database.py (SQLAlchemy 설정)
- [x] 0.5 app/models/ (9개 Entity 모델)
- [x] 0.6 app/schemas/ (Pydantic 스키마)
- [x] 0.7 app/services/ (Service 스켈레톤 - NotImplementedError)
- [x] 0.8 app/routers/ (Router 스켈레톤)
- [x] 0.9 app/middleware/auth_middleware.py
- [x] 0.10 app/main.py (FastAPI 앱)
- [x] 0.11 app/seed.py (초기 데이터)
- [x] 0.12 tests/conftest.py (테스트 설정)
- [x] 0.13 Dockerfile
- [x] 0.14 컴파일/구문 검증

### Plan Step 1: AuthService (TDD) - Story US-06, US-01
- [x] 1.1 hash_password / verify_password - RED-GREEN-REFACTOR (TC-BE-001)
- [x] 1.2 create_jwt_token / verify_jwt_token - RED-GREEN-REFACTOR (TC-BE-002, TC-BE-003)
- [x] 1.3 authenticate_admin - RED-GREEN-REFACTOR (TC-BE-004, TC-BE-005, TC-BE-006)
- [x] 1.4 authenticate_table - RED-GREEN-REFACTOR (TC-BE-007)

### Plan Step 2: MenuService (TDD) - Story US-02, US-09
- [x] 2.1 get_categories - RED-GREEN-REFACTOR (TC-BE-008)
- [x] 2.2 get_menus_by_category - RED-GREEN-REFACTOR (TC-BE-009)
- [x] 2.3 create_menu - RED-GREEN-REFACTOR (TC-BE-010, TC-BE-011)
- [x] 2.4 update_menu - RED-GREEN-REFACTOR (TC-BE-012)
- [x] 2.5 delete_menu - RED-GREEN-REFACTOR (TC-BE-013, TC-BE-014)

### Plan Step 3: OrderService (TDD) - Story US-04, US-05, US-07
- [x] 3.1 create_order (자동 세션 포함) - RED-GREEN-REFACTOR (TC-BE-015, TC-BE-016, TC-BE-017)
- [x] 3.2 get_orders_by_session - RED-GREEN-REFACTOR (TC-BE-018)
- [x] 3.3 update_order_status - RED-GREEN-REFACTOR (TC-BE-019, TC-BE-020)
- [x] 3.4 delete_order - RED-GREEN-REFACTOR (TC-BE-021)

### Plan Step 4: TableService (TDD) - Story US-08
- [x] 4.1 setup_table - RED-GREEN-REFACTOR (TC-BE-022, TC-BE-023)
- [x] 4.2 complete_session - RED-GREEN-REFACTOR (TC-BE-024, TC-BE-025)
- [x] 4.3 get_table_history - RED-GREEN-REFACTOR (TC-BE-026)

### Plan Step 5: API Layer (TDD) - Integration Tests
- [x] 5.1 Auth API endpoints (TC-BE-027)
- [x] 5.2 Order API endpoints (TC-BE-028, TC-BE-029)
- [x] 5.3 Table API endpoints (TC-BE-030)
- [x] 5.4 Menu API endpoints
- [x] 5.5 Upload API endpoint
- [x] 5.6 SSE endpoint

### Plan Step 6: Additional Artifacts
- [x] 6.1 app/seed.py 구현 (매장, 관리자, 샘플 카테고리/메뉴)
- [x] 6.2 docker-compose.yml (루트)
- [x] 6.3 최종 전체 테스트 실행 및 검증
