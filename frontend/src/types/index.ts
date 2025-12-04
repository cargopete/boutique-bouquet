export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string;
  image_url: string | null;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: number;
  quantity: number;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  delivery_city: string;
  delivery_postal_code: string | null;
  total_amount: string;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItemResponse {
  id: number;
  order_id: string;
  product_id: number | null;
  product_name: string;
  product_price: string;
  quantity: number;
  subtotal: string;
  created_at: string;
}

export interface CreateOrderRequest {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  delivery_city: string;
  delivery_postal_code?: string;
  notes?: string;
  items: OrderItem[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  admin: {
    id: number;
    email: string;
  };
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  price: string;
  stock_quantity: number;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: string;
  stock_quantity?: number;
  is_active?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
