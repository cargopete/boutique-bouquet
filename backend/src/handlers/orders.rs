use axum::{
    extract::{Path, State},
    http::StatusCode,
    Extension, Json,
};
use rust_decimal::Decimal;
use sqlx::PgPool;
use uuid::Uuid;

use crate::{
    auth::Claims,
    error::AppError,
    models::{CreateOrderRequest, Order, OrderItem, Product, UpdateOrderStatusRequest},
};

// Public endpoint - create order

pub async fn create_order(
    State(pool): State<PgPool>,
    Json(payload): Json<CreateOrderRequest>,
) -> Result<(StatusCode, Json<Order>), AppError> {
    if payload.items.is_empty() {
        return Err(AppError::BadRequest("Order must contain at least one item".to_string()));
    }

    // Start transaction
    let mut tx = pool.begin().await?;

    // Calculate total and validate products
    let mut total_amount = Decimal::ZERO;
    let mut order_items = Vec::new();

    for item in &payload.items {
        if item.quantity <= 0 {
            return Err(AppError::BadRequest("Quantity must be positive".to_string()));
        }

        // Get product and check availability
        let product = sqlx::query_as::<_, Product>(
            "SELECT * FROM products WHERE id = $1 AND is_active = true FOR UPDATE",
        )
        .bind(item.product_id)
        .fetch_optional(&mut *tx)
        .await?
        .ok_or_else(|| AppError::NotFound(format!("Product {} not found", item.product_id)))?;

        if product.stock_quantity < item.quantity {
            return Err(AppError::BadRequest(format!(
                "Insufficient stock for product '{}'. Available: {}, Requested: {}",
                product.name, product.stock_quantity, item.quantity
            )));
        }

        let subtotal = product.price * Decimal::from(item.quantity);
        total_amount += subtotal;

        order_items.push((product, item.quantity, subtotal));

        // Update stock
        sqlx::query("UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2")
            .bind(item.quantity)
            .bind(item.product_id)
            .execute(&mut *tx)
            .await?;
    }

    // Create order
    let order_id = Uuid::new_v4();
    let order = sqlx::query_as::<_, Order>(
        r#"
        INSERT INTO orders (
            id, customer_name, customer_email, customer_phone,
            delivery_address, delivery_city, delivery_postal_code,
            total_amount, status, notes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', $9)
        RETURNING *
        "#,
    )
    .bind(order_id)
    .bind(&payload.customer_name)
    .bind(&payload.customer_email)
    .bind(&payload.customer_phone)
    .bind(&payload.delivery_address)
    .bind(&payload.delivery_city)
    .bind(&payload.delivery_postal_code)
    .bind(total_amount)
    .bind(&payload.notes)
    .fetch_one(&mut *tx)
    .await?;

    // Create order items
    for (product, quantity, subtotal) in order_items {
        sqlx::query(
            r#"
            INSERT INTO order_items (
                order_id, product_id, product_name, product_price, quantity, subtotal
            ) VALUES ($1, $2, $3, $4, $5, $6)
            "#,
        )
        .bind(order_id)
        .bind(product.id)
        .bind(&product.name)
        .bind(product.price)
        .bind(quantity)
        .bind(subtotal)
        .execute(&mut *tx)
        .await?;
    }

    // Commit transaction
    tx.commit().await?;

    Ok((StatusCode::CREATED, Json(order)))
}

// Admin endpoints (require authentication)

pub async fn list_orders(
    State(pool): State<PgPool>,
    Extension(_claims): Extension<Claims>,
) -> Result<Json<Vec<Order>>, AppError> {
    let orders = sqlx::query_as::<_, Order>("SELECT * FROM orders ORDER BY created_at DESC")
        .fetch_all(&pool)
        .await?;

    Ok(Json(orders))
}

pub async fn get_order(
    State(pool): State<PgPool>,
    Path(id): Path<Uuid>,
    Extension(_claims): Extension<Claims>,
) -> Result<Json<(Order, Vec<OrderItem>)>, AppError> {
    let order = sqlx::query_as::<_, Order>("SELECT * FROM orders WHERE id = $1")
        .bind(id)
        .fetch_optional(&pool)
        .await?
        .ok_or_else(|| AppError::NotFound("Order not found".to_string()))?;

    let items = sqlx::query_as::<_, OrderItem>("SELECT * FROM order_items WHERE order_id = $1")
        .bind(id)
        .fetch_all(&pool)
        .await?;

    Ok(Json((order, items)))
}

pub async fn update_order_status(
    State(pool): State<PgPool>,
    Path(id): Path<Uuid>,
    Extension(_claims): Extension<Claims>,
    Json(payload): Json<UpdateOrderStatusRequest>,
) -> Result<Json<Order>, AppError> {
    // Validate status
    let valid_statuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if !valid_statuses.contains(&payload.status.as_str()) {
        return Err(AppError::BadRequest(format!(
            "Invalid status. Must be one of: {}",
            valid_statuses.join(", ")
        )));
    }

    let order = sqlx::query_as::<_, Order>(
        "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *",
    )
    .bind(&payload.status)
    .bind(id)
    .fetch_optional(&pool)
    .await?
    .ok_or_else(|| AppError::NotFound("Order not found".to_string()))?;

    Ok(Json(order))
}
