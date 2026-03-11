# Contract/Interface Definition - Backend (table-order-backend)

## Unit Context
- **Stories**: US-01, US-02, US-04, US-05, US-06, US-07, US-08, US-09
- **Dependencies**: None (독립 unit)
- **Database Entities**: Store, Admin, Table, TableSession, Category, Menu, Order, OrderItem, OrderHistory

---

## Business Logic Layer

### AuthService
- `authenticate_admin(db, store_identifier, username, password) -> dict`: 관리자 인증 후 JWT 토큰 반환
  - Returns: {"access_token": str, "token_type": "bearer"}
  - Raises: HTTPException(401) 인증 실패, HTTPException(423) 계정 잠금
- `authenticate_table(db, store_identifier, table_number, password) -> dict`: 테이블 인증
  - Returns: {"table_id": int, "store_id": int, "table_number": int}
  - Raises: HTTPException(401) 인증 실패
- `create_jwt_token(data: dict) -> str`: JWT 토큰 생성
- `verify_jwt_token(token: str) -> dict`: JWT 토큰 검증
  - Raises: HTTPException(401) 토큰 만료/무효
- `hash_password(password: str) -> str`: bcrypt 해싱
- `verify_password(plain: str, hashed: str) -> bool`: 비밀번호 검증

### MenuService
- `get_categories(db, store_id) -> list[Category]`: 카테고리 목록 조회
- `get_menus_by_category(db, store_id, category_id?) -> list[Menu]`: 메뉴 조회
- `create_menu(db, store_id, menu_data) -> Menu`: 메뉴 등록
  - Raises: HTTPException(404) 카테고리 없음, HTTPException(422) 검증 실패
- `update_menu(db, menu_id, menu_data) -> Menu`: 메뉴 수정
  - Raises: HTTPException(404) 메뉴 없음
- `delete_menu(db, menu_id) -> dict`: 메뉴 삭제 (soft/hard)
  - Raises: HTTPException(404) 메뉴 없음
- `update_display_order(db, menu_id, display_order) -> Menu`: 순서 변경

### OrderService
- `create_order(db, store_id, table_id, items) -> Order`: 주문 생성 (자동 세션 시작)
  - Raises: HTTPException(404) 테이블/메뉴 없음, HTTPException(400) 메뉴 비활성
- `get_orders_by_session(db, table_id, session_id) -> list[Order]`: 세션별 주문 조회
- `get_order_detail(db, order_id) -> Order`: 주문 상세 (items 포함)
  - Raises: HTTPException(404) 주문 없음
- `update_order_status(db, order_id, status) -> Order`: 상태 변경 (단방향)
  - Raises: HTTPException(400) 허용되지 않는 전이, HTTPException(404) 주문 없음
- `delete_order(db, order_id) -> dict`: 주문 삭제
  - Raises: HTTPException(404) 주문 없음

### TableService
- `setup_table(db, store_id, table_number, password) -> Table`: 테이블 설정
  - Raises: HTTPException(409) 중복 테이블 번호
- `get_tables(db, store_id) -> list[Table]`: 테이블 목록
- `complete_session(db, table_id) -> dict`: 세션 종료 (이력 이동)
  - Raises: HTTPException(404) 활성 세션 없음
- `get_table_history(db, table_id, date?) -> list[OrderHistory]`: 과거 이력 조회

### SSEService
- `subscribe(store_id) -> AsyncGenerator`: SSE 구독
- `broadcast(store_id, event_type, data) -> None`: 이벤트 브로드캐스트
- `remove_connection(store_id, queue) -> None`: 연결 해제

---

## API Layer

### Auth Endpoints
- `POST /api/auth/admin/login`: 관리자 로그인
- `POST /api/auth/table/login`: 테이블 로그인
- `GET /api/auth/verify`: 토큰 검증

### Menu Endpoints
- `GET /api/categories`: 카테고리 목록
- `GET /api/menus`: 메뉴 목록 (query: store_id, category_id?)
- `POST /api/menus`: 메뉴 등록 (Admin)
- `PUT /api/menus/{id}`: 메뉴 수정 (Admin)
- `DELETE /api/menus/{id}`: 메뉴 삭제 (Admin)
- `PUT /api/menus/{id}/order`: 순서 변경 (Admin)

### Order Endpoints
- `POST /api/orders`: 주문 생성
- `GET /api/orders`: 주문 목록 (query: table_id, session_id)
- `GET /api/orders/{id}`: 주문 상세
- `PUT /api/orders/{id}/status`: 상태 변경 (Admin)
- `DELETE /api/orders/{id}`: 주문 삭제 (Admin)

### Table Endpoints
- `POST /api/tables`: 테이블 설정 (Admin)
- `GET /api/tables`: 테이블 목록 (Admin)
- `POST /api/tables/{id}/complete`: 세션 종료 (Admin)
- `GET /api/tables/{id}/history`: 과거 이력 (Admin)

### Upload Endpoints
- `POST /api/upload`: 이미지 업로드 (Admin)

### SSE Endpoints
- `GET /api/sse/orders`: 주문 이벤트 구독 (Admin)
