use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

// Admin model
#[derive(Debug, Clone, FromRow, Serialize)]
pub struct Admin {
    pub id: i32,
    pub email: String,
    #[serde(skip_serializing)]
    pub password_hash: String,
    pub created_at: NaiveDateTime,
}

// Product model
#[derive(Debug, Clone, FromRow, Serialize, Deserialize)]
pub struct Product {
    pub id: i32,
    pub name: String,
    pub description: Option<String>,
    pub price: rust_decimal::Decimal,
    pub image_url: Option<String>,
    pub stock_quantity: i32,
    pub is_active: bool,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

// Create product request
#[derive(Debug, Deserialize)]
pub struct CreateProductRequest {
    pub name: String,
    pub description: Option<String>,
    pub price: rust_decimal::Decimal,
    pub stock_quantity: i32,
}

// Update product request
#[derive(Debug, Deserialize)]
pub struct UpdateProductRequest {
    pub name: Option<String>,
    pub description: Option<String>,
    pub price: Option<rust_decimal::Decimal>,
    pub stock_quantity: Option<i32>,
    pub is_active: Option<bool>,
}

// Order model
#[derive(Debug, Clone, FromRow, Serialize)]
pub struct Order {
    pub id: Uuid,
    pub customer_name: String,
    pub customer_email: String,
    pub customer_phone: String,
    pub delivery_address: String,
    pub delivery_city: String,
    pub delivery_postal_code: Option<String>,
    pub total_amount: rust_decimal::Decimal,
    pub status: String,
    pub notes: Option<String>,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

// Order item model
#[derive(Debug, Clone, FromRow, Serialize)]
pub struct OrderItem {
    pub id: i32,
    pub order_id: Uuid,
    pub product_id: Option<i32>,
    pub product_name: String,
    pub product_price: rust_decimal::Decimal,
    pub quantity: i32,
    pub subtotal: rust_decimal::Decimal,
    pub created_at: NaiveDateTime,
}

// Create order request
#[derive(Debug, Deserialize)]
pub struct CreateOrderRequest {
    pub customer_name: String,
    pub customer_email: String,
    pub customer_phone: String,
    pub delivery_address: String,
    pub delivery_city: String,
    pub delivery_postal_code: Option<String>,
    pub notes: Option<String>,
    pub items: Vec<OrderItemRequest>,
}

#[derive(Debug, Deserialize)]
pub struct OrderItemRequest {
    pub product_id: i32,
    pub quantity: i32,
}

// Update order status request
#[derive(Debug, Deserialize)]
pub struct UpdateOrderStatusRequest {
    pub status: String,
}

// Login request
#[derive(Debug, Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

// Login response
#[derive(Debug, Serialize)]
pub struct LoginResponse {
    pub token: String,
    pub admin: AdminResponse,
}

#[derive(Debug, Serialize)]
pub struct AdminResponse {
    pub id: i32,
    pub email: String,
}
