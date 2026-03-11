# Domain Entities - Frontend (table-order-frontend)

## TypeScript Type Definitions

### API Response Types

```typescript
// 매장
interface Store {
  id: number;
  store_identifier: string;
  name: string;
  created_at: string;
}

// 카테고리
interface Category {
  id: number;
  store_id: number;
  name: string;
  display_order: number;
  created_at: string;
}

// 메뉴
interface Menu {
  id: number;
  category_id: number;
  store_id: number;
  name: string;
  price: number;
  description: string | null;
  image_url: string | null;
  display_order: number;
  is_available: boolean;
  created_at: string;
}

// 주문
interface Order {
  id: number;
  store_id: number;
  table_id: number;
  session_id: number;
  order_number: string;
  total_amount: number;
  status: 'PENDING' | 'PREPARING' | 'COMPLETED';
  created_at: string;
  items: OrderItem[];
}

// 주문 항목
interface OrderItem {
  id: number;
  menu_id: number;
  menu_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at: string;
}

// 주문 이력
interface OrderHistory {
  id: number;
  original_order_id: number;
  store_id: number;
  table_id: number;
  session_id: number;
  table_number: number;
  order_number: string;
  total_amount: number;
  status: string;
  items_json: string;
  ordered_at: string;
  completed_at: string;
  created_at: string;
}

// 테이블
interface Table {
  id: number;
  store_id: number;
  table_number: number;
  is_active: boolean;
  created_at: string;
}
```

### API Request Types

```typescript
// 관리자 로그인
interface AdminLoginRequest {
  store_identifier: string;
  username: string;
  password: string;
}

// 테이블 로그인
interface TableLoginRequest {
  store_identifier: string;
  table_number: number;
  password: string;
}

// 주문 생성
interface OrderCreateRequest {
  store_id: number;
  table_id: number;
  items: { menu_id: number; quantity: number }[];
}

// 메뉴 생성
interface MenuCreateRequest {
  category_id: number;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
}

// 메뉴 수정
interface MenuUpdateRequest {
  name?: string;
  price?: number;
  description?: string;
  image_url?: string;
  is_available?: boolean;
}

// 테이블 설정
interface TableCreateRequest {
  table_number: number;
  password: string;
}
```

### Auth Response Types

```typescript
interface TokenResponse {
  access_token: string;
  token_type: string;
}

interface TableLoginResponse {
  table_id: number;
  store_id: number;
  table_number: number;
}
```

### Client-Side Types

```typescript
// 장바구니 항목 (localStorage)
interface CartItem {
  menu_id: number;
  menu_name: string;
  price: number;
  quantity: number;
  image_url: string | null;
}

// 테이블 설정 정보 (localStorage)
interface TableConfig {
  store_identifier: string;
  table_number: number;
  password: string;
  table_id: number;
  store_id: number;
}

// 인증 상태
interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  adminId: number | null;
  storeId: number | null;
}

// SSE 이벤트
interface SSEOrderEvent {
  type: 'order_created' | 'order_updated' | 'order_deleted' | 'session_completed';
  timestamp: string;
  [key: string]: unknown;
}
```
