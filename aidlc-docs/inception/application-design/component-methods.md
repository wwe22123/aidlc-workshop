# 테이블오더 서비스 - Component Methods

상세 비즈니스 규칙은 Functional Design (CONSTRUCTION) 단계에서 정의됩니다.

---

## 1. Backend - API Layer

### AuthRouter
| Method | Endpoint | Input | Output |
|--------|----------|-------|--------|
| `admin_login` | POST /api/auth/admin/login | store_id, username, password | JWT token |
| `table_login` | POST /api/auth/table/login | store_id, table_number, password | session token |
| `verify_token` | GET /api/auth/verify | JWT token (header) | user info |

### MenuRouter
| Method | Endpoint | Input | Output |
|--------|----------|-------|--------|
| `get_menus` | GET /api/menus | store_id, category_id? | Menu[] |
| `get_categories` | GET /api/categories | store_id | Category[] |
| `create_menu` | POST /api/menus | MenuCreateDTO | Menu |
| `update_menu` | PUT /api/menus/{id} | MenuUpdateDTO | Menu |
| `delete_menu` | DELETE /api/menus/{id} | menu_id | success |
| `update_menu_order` | PUT /api/menus/order | menu_id, display_order | success |

### OrderRouter
| Method | Endpoint | Input | Output |
|--------|----------|-------|--------|
| `create_order` | POST /api/orders | OrderCreateDTO | Order |
| `get_orders` | GET /api/orders | table_id, session_id | Order[] |
| `get_order_detail` | GET /api/orders/{id} | order_id | Order (with items) |
| `update_order_status` | PUT /api/orders/{id}/status | order_id, status | Order |
| `delete_order` | DELETE /api/orders/{id} | order_id | success |

### TableRouter
| Method | Endpoint | Input | Output |
|--------|----------|-------|--------|
| `setup_table` | POST /api/tables | TableSetupDTO | Table |
| `get_tables` | GET /api/tables | store_id | Table[] |
| `complete_table_session` | POST /api/tables/{id}/complete | table_id | success |
| `get_table_history` | GET /api/tables/{id}/history | table_id, date? | OrderHistory[] |

### UploadRouter
| Method | Endpoint | Input | Output |
|--------|----------|-------|--------|
| `upload_image` | POST /api/upload | file (multipart) | image_url |

### SSERouter
| Method | Endpoint | Input | Output |
|--------|----------|-------|--------|
| `subscribe` | GET /api/sse/orders | store_id | EventStream |

---

## 2. Backend - Service Layer

### AuthService
| Method | Input | Output | 목적 |
|--------|-------|--------|------|
| `authenticate_admin` | store_id, username, password | JWT token | 관리자 인증 |
| `authenticate_table` | store_id, table_number, password | session token | 테이블 인증 |
| `create_jwt_token` | payload | token string | JWT 생성 |
| `verify_jwt_token` | token | payload | JWT 검증 |
| `hash_password` | plain_password | hashed_password | bcrypt 해싱 |
| `verify_password` | plain, hashed | bool | 비밀번호 검증 |

### MenuService
| Method | Input | Output | 목적 |
|--------|-------|--------|------|
| `get_menus_by_category` | store_id, category_id? | Menu[] | 카테고리별 메뉴 조회 |
| `get_categories` | store_id | Category[] | 카테고리 목록 |
| `create_menu` | MenuCreateDTO | Menu | 메뉴 등록 |
| `update_menu` | menu_id, MenuUpdateDTO | Menu | 메뉴 수정 |
| `delete_menu` | menu_id | success | 메뉴 삭제 |
| `update_display_order` | menu_id, order | success | 노출 순서 변경 |

### OrderService
| Method | Input | Output | 목적 |
|--------|-------|--------|------|
| `create_order` | OrderCreateDTO | Order | 주문 생성 |
| `get_orders_by_session` | table_id, session_id | Order[] | 세션별 주문 조회 |
| `update_order_status` | order_id, status | Order | 주문 상태 변경 |
| `delete_order` | order_id | success | 주문 삭제 |
| `calculate_total` | OrderItem[] | total_amount | 총액 계산 |

### TableService
| Method | Input | Output | 목적 |
|--------|-------|--------|------|
| `setup_table` | TableSetupDTO | Table | 테이블 초기 설정 |
| `get_tables` | store_id | Table[] | 테이블 목록 |
| `start_session` | table_id | TableSession | 세션 시작 |
| `complete_session` | table_id | success | 세션 종료 (이용 완료) |
| `move_to_history` | session_id | success | 주문 이력 이동 |
| `get_table_history` | table_id, date? | OrderHistory[] | 과거 이력 조회 |

### SSEService
| Method | Input | Output | 목적 |
|--------|-------|--------|------|
| `subscribe` | store_id | AsyncGenerator | SSE 구독 |
| `broadcast_order_event` | store_id, event_data | void | 주문 이벤트 브로드캐스트 |
| `remove_connection` | connection_id | void | 연결 해제 |
