// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// API Response Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface Category {
  id: number;
  store_id: number;
  name: string;
  display_order: number;
  created_at: string;
}

export interface Menu {
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

export interface OrderItem {
  id: number;
  menu_id: number;
  menu_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at: string;
}

export interface Order {
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

export interface OrderHistory {
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

export interface Table {
  id: number;
  store_id: number;
  table_number: number;
  is_active: boolean;
  created_at: string;
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// API Request Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface AdminLoginRequest {
  store_identifier: string;
  username: string;
  password: string;
}

export interface TableLoginRequest {
  store_identifier: string;
  table_number: number;
  password: string;
}

export interface OrderCreateRequest {
  store_id: number;
  table_id: number;
  items: { menu_id: number; quantity: number }[];
}

export interface MenuCreateRequest {
  category_id: number;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
}

export interface MenuUpdateRequest {
  name?: string;
  price?: number;
  description?: string;
  image_url?: string;
  is_available?: boolean;
}

export interface TableCreateRequest {
  table_number: number;
  password: string;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Auth Response Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface TableLoginResponse {
  table_id: number;
  store_id: number;
  table_number: number;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Client-Side Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface CartItem {
  menu_id: number;
  menu_name: string;
  price: number;
  quantity: number;
  image_url: string | null;
}

export interface TableConfig {
  store_identifier: string;
  table_number: number;
  password: string;
  table_id: number;
  store_id: number;
  session_id?: number;
}
