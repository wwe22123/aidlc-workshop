# Domain Entities - Backend

---

## Entity Relationship Diagram

```
Store (1) ----< (N) Admin
Store (1) ----< (N) Table
Store (1) ----< (N) Category
Table (1) ----< (N) TableSession
Category (1) ----< (N) Menu
TableSession (1) ----< (N) Order
Order (1) ----< (N) OrderItem
OrderItem (N) >---- (1) Menu
TableSession (1) ----< (N) OrderHistory
```

Text Alternative:
- Store 1:N Admin, Table, Category
- Table 1:N TableSession
- Category 1:N Menu
- TableSession 1:N Order, OrderHistory
- Order 1:N OrderItem
- OrderItem N:1 Menu

---

## Entity 상세 정의

### Store (매장)
| 필드 | 타입 | 제약조건 | 설명 |
|------|------|---------|------|
| id | Integer | PK, Auto Increment | 매장 고유 ID |
| store_identifier | String(50) | UNIQUE, NOT NULL | 매장 식별자 |
| name | String(100) | NOT NULL | 매장명 |
| created_at | DateTime | NOT NULL, DEFAULT NOW | 생성일시 |

### Admin (관리자)
| 필드 | 타입 | 제약조건 | 설명 |
|------|------|---------|------|
| id | Integer | PK, Auto Increment | 관리자 고유 ID |
| store_id | Integer | FK(Store.id), NOT NULL | 매장 ID |
| username | String(50) | NOT NULL | 사용자명 |
| password_hash | String(255) | NOT NULL | bcrypt 해싱된 비밀번호 |
| login_attempts | Integer | DEFAULT 0 | 로그인 시도 횟수 |
| locked_until | DateTime | NULLABLE | 잠금 해제 시각 |
| created_at | DateTime | NOT NULL, DEFAULT NOW | 생성일시 |

### Table (테이블)
| 필드 | 타입 | 제약조건 | 설명 |
|------|------|---------|------|
| id | Integer | PK, Auto Increment | 테이블 고유 ID |
| store_id | Integer | FK(Store.id), NOT NULL | 매장 ID |
| table_number | Integer | NOT NULL | 테이블 번호 |
| password_hash | String(255) | NOT NULL | bcrypt 해싱된 비밀번호 |
| is_active | Boolean | DEFAULT TRUE | 활성 상태 |
| created_at | DateTime | NOT NULL, DEFAULT NOW | 생성일시 |
| **UNIQUE** | (store_id, table_number) | | 매장 내 테이블 번호 유일 |

### TableSession (테이블 세션)
| 필드 | 타입 | 제약조건 | 설명 |
|------|------|---------|------|
| id | Integer | PK, Auto Increment | 세션 고유 ID |
| table_id | Integer | FK(Table.id), NOT NULL | 테이블 ID |
| store_id | Integer | FK(Store.id), NOT NULL | 매장 ID |
| started_at | DateTime | NOT NULL, DEFAULT NOW | 세션 시작 시각 |
| completed_at | DateTime | NULLABLE | 세션 종료 시각 (이용 완료) |
| is_active | Boolean | DEFAULT TRUE | 활성 세션 여부 |
| created_at | DateTime | NOT NULL, DEFAULT NOW | 생성일시 |

### Category (카테고리)
| 필드 | 타입 | 제약조건 | 설명 |
|------|------|---------|------|
| id | Integer | PK, Auto Increment | 카테고리 고유 ID |
| store_id | Integer | FK(Store.id), NOT NULL | 매장 ID |
| name | String(50) | NOT NULL | 카테고리명 |
| display_order | Integer | DEFAULT 0 | 표시 순서 |
| created_at | DateTime | NOT NULL, DEFAULT NOW | 생성일시 |

### Menu (메뉴)
| 필드 | 타입 | 제약조건 | 설명 |
|------|------|---------|------|
| id | Integer | PK, Auto Increment | 메뉴 고유 ID |
| category_id | Integer | FK(Category.id), NOT NULL | 카테고리 ID |
| store_id | Integer | FK(Store.id), NOT NULL | 매장 ID |
| name | String(100) | NOT NULL | 메뉴명 |
| price | Integer | NOT NULL, >= 0 | 가격 (원) |
| description | Text | NULLABLE | 메뉴 설명 |
| image_url | String(500) | NULLABLE | 이미지 URL |
| display_order | Integer | DEFAULT 0 | 표시 순서 |
| is_available | Boolean | DEFAULT TRUE | 판매 가능 여부 |
| created_at | DateTime | NOT NULL, DEFAULT NOW | 생성일시 |

### Order (주문)
| 필드 | 타입 | 제약조건 | 설명 |
|------|------|---------|------|
| id | Integer | PK, Auto Increment | 주문 고유 ID |
| store_id | Integer | FK(Store.id), NOT NULL | 매장 ID |
| table_id | Integer | FK(Table.id), NOT NULL | 테이블 ID |
| session_id | Integer | FK(TableSession.id), NOT NULL | 세션 ID |
| order_number | String(20) | UNIQUE, NOT NULL | 주문 번호 (표시용) |
| total_amount | Integer | NOT NULL, >= 0 | 총 주문 금액 |
| status | String(20) | NOT NULL, DEFAULT 'PENDING' | 주문 상태 |
| created_at | DateTime | NOT NULL, DEFAULT NOW | 주문 시각 |

**status 허용값**: PENDING(대기중), PREPARING(준비중), COMPLETED(완료)

### OrderItem (주문 항목)
| 필드 | 타입 | 제약조건 | 설명 |
|------|------|---------|------|
| id | Integer | PK, Auto Increment | 항목 고유 ID |
| order_id | Integer | FK(Order.id), NOT NULL | 주문 ID |
| menu_id | Integer | FK(Menu.id), NOT NULL | 메뉴 ID |
| menu_name | String(100) | NOT NULL | 주문 시점 메뉴명 (스냅샷) |
| quantity | Integer | NOT NULL, >= 1 | 수량 |
| unit_price | Integer | NOT NULL, >= 0 | 주문 시점 단가 (스냅샷) |
| subtotal | Integer | NOT NULL, >= 0 | 소계 (quantity * unit_price) |
| created_at | DateTime | NOT NULL, DEFAULT NOW | 생성일시 |

### OrderHistory (과거 주문 이력)
| 필드 | 타입 | 제약조건 | 설명 |
|------|------|---------|------|
| id | Integer | PK, Auto Increment | 이력 고유 ID |
| original_order_id | Integer | NOT NULL | 원본 주문 ID |
| store_id | Integer | NOT NULL | 매장 ID |
| table_id | Integer | NOT NULL | 테이블 ID |
| session_id | Integer | NOT NULL | 세션 ID |
| table_number | Integer | NOT NULL | 테이블 번호 |
| order_number | String(20) | NOT NULL | 주문 번호 |
| total_amount | Integer | NOT NULL | 총 금액 |
| status | String(20) | NOT NULL | 최종 상태 |
| items_json | Text | NOT NULL | 주문 항목 JSON |
| ordered_at | DateTime | NOT NULL | 원본 주문 시각 |
| completed_at | DateTime | NOT NULL, DEFAULT NOW | 이용 완료 처리 시각 |
| created_at | DateTime | NOT NULL, DEFAULT NOW | 생성일시 |
