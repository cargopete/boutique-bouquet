use axum::{
    extract::{Multipart, Path, State},
    http::StatusCode,
    Extension, Json,
};
use sqlx::PgPool;
use std::path::PathBuf;
use tokio::fs;
use tokio::io::AsyncWriteExt;

use crate::{
    auth::Claims,
    error::AppError,
    models::{CreateProductRequest, Product, UpdateProductRequest},
};

// Public endpoints

pub async fn list_products(State(pool): State<PgPool>) -> Result<Json<Vec<Product>>, AppError> {
    let products = sqlx::query_as::<_, Product>(
        "SELECT * FROM products WHERE is_active = true ORDER BY created_at DESC",
    )
    .fetch_all(&pool)
    .await?;

    Ok(Json(products))
}

pub async fn get_product(
    State(pool): State<PgPool>,
    Path(id): Path<i32>,
) -> Result<Json<Product>, AppError> {
    let product = sqlx::query_as::<_, Product>(
        "SELECT * FROM products WHERE id = $1 AND is_active = true",
    )
    .bind(id)
    .fetch_optional(&pool)
    .await?
    .ok_or_else(|| AppError::NotFound("Product not found".to_string()))?;

    Ok(Json(product))
}

// Admin endpoints (require authentication)

pub async fn list_all_products(
    State(pool): State<PgPool>,
    Extension(_claims): Extension<Claims>,
) -> Result<Json<Vec<Product>>, AppError> {
    let products = sqlx::query_as::<_, Product>("SELECT * FROM products ORDER BY created_at DESC")
        .fetch_all(&pool)
        .await?;

    Ok(Json(products))
}

pub async fn create_product(
    State(pool): State<PgPool>,
    Extension(_claims): Extension<Claims>,
    Json(payload): Json<CreateProductRequest>,
) -> Result<(StatusCode, Json<Product>), AppError> {
    let product = sqlx::query_as::<_, Product>(
        r#"
        INSERT INTO products (name, description, price, stock_quantity)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        "#,
    )
    .bind(&payload.name)
    .bind(&payload.description)
    .bind(payload.price)
    .bind(payload.stock_quantity)
    .fetch_one(&pool)
    .await?;

    Ok((StatusCode::CREATED, Json(product)))
}

pub async fn update_product(
    State(pool): State<PgPool>,
    Path(id): Path<i32>,
    Extension(_claims): Extension<Claims>,
    Json(payload): Json<UpdateProductRequest>,
) -> Result<Json<Product>, AppError> {
    // First check if product exists
    let existing = sqlx::query_as::<_, Product>("SELECT * FROM products WHERE id = $1")
        .bind(id)
        .fetch_optional(&pool)
        .await?
        .ok_or_else(|| AppError::NotFound("Product not found".to_string()))?;

    // Build dynamic update query
    let mut query = String::from("UPDATE products SET ");
    let mut updates = Vec::new();
    let mut param_count = 1;

    if let Some(name) = &payload.name {
        updates.push(format!("name = ${}", param_count));
        param_count += 1;
    }
    if let Some(description) = &payload.description {
        updates.push(format!("description = ${}", param_count));
        param_count += 1;
    }
    if let Some(price) = &payload.price {
        updates.push(format!("price = ${}", param_count));
        param_count += 1;
    }
    if let Some(stock_quantity) = &payload.stock_quantity {
        updates.push(format!("stock_quantity = ${}", param_count));
        param_count += 1;
    }
    if let Some(is_active) = &payload.is_active {
        updates.push(format!("is_active = ${}", param_count));
        param_count += 1;
    }

    if updates.is_empty() {
        return Ok(Json(existing));
    }

    query.push_str(&updates.join(", "));
    query.push_str(&format!(" WHERE id = ${} RETURNING *", param_count));

    let mut query_builder = sqlx::query_as::<_, Product>(&query);

    if let Some(name) = &payload.name {
        query_builder = query_builder.bind(name);
    }
    if let Some(description) = &payload.description {
        query_builder = query_builder.bind(description);
    }
    if let Some(price) = &payload.price {
        query_builder = query_builder.bind(price);
    }
    if let Some(stock_quantity) = &payload.stock_quantity {
        query_builder = query_builder.bind(stock_quantity);
    }
    if let Some(is_active) = &payload.is_active {
        query_builder = query_builder.bind(is_active);
    }

    query_builder = query_builder.bind(id);

    let product = query_builder.fetch_one(&pool).await?;

    Ok(Json(product))
}

pub async fn delete_product(
    State(pool): State<PgPool>,
    Path(id): Path<i32>,
    Extension(_claims): Extension<Claims>,
) -> Result<StatusCode, AppError> {
    let result = sqlx::query("DELETE FROM products WHERE id = $1")
        .bind(id)
        .execute(&pool)
        .await?;

    if result.rows_affected() == 0 {
        return Err(AppError::NotFound("Product not found".to_string()));
    }

    Ok(StatusCode::NO_CONTENT)
}

pub async fn upload_product_image(
    State(pool): State<PgPool>,
    Path(id): Path<i32>,
    Extension(_claims): Extension<Claims>,
    mut multipart: Multipart,
) -> Result<Json<Product>, AppError> {
    // Check if product exists
    let _product = sqlx::query_as::<_, Product>("SELECT * FROM products WHERE id = $1")
        .bind(id)
        .fetch_optional(&pool)
        .await?
        .ok_or_else(|| AppError::NotFound("Product not found".to_string()))?;

    // Get upload directory from env
    let upload_dir = std::env::var("UPLOAD_DIR").unwrap_or_else(|_| "./uploads".to_string());

    // Ensure upload directory exists
    fs::create_dir_all(&upload_dir).await.map_err(|e| {
        tracing::error!("Failed to create upload directory: {:?}", e);
        AppError::InternalServerError("Failed to create upload directory".to_string())
    })?;

    // Process multipart form
    while let Some(field) = multipart.next_field().await.map_err(|e| {
        tracing::error!("Multipart error: {:?}", e);
        AppError::BadRequest("Invalid file upload".to_string())
    })? {
        let name = field.name().unwrap_or("").to_string();

        if name != "image" {
            continue;
        }

        let filename = field
            .file_name()
            .ok_or_else(|| AppError::BadRequest("Missing filename".to_string()))?
            .to_string();

        // Validate file extension
        let ext = PathBuf::from(&filename)
            .extension()
            .and_then(|e| e.to_str())
            .map(|e| e.to_lowercase())
            .ok_or_else(|| AppError::BadRequest("Invalid file extension".to_string()))?;

        if !["jpg", "jpeg", "png", "webp"].contains(&ext.as_str()) {
            return Err(AppError::BadRequest(
                "Only jpg, jpeg, png, and webp images are allowed".to_string(),
            ));
        }

        // Generate unique filename
        let unique_filename = format!("product-{}-{}.{}", id, uuid::Uuid::new_v4(), ext);
        let file_path = PathBuf::from(&upload_dir).join(&unique_filename);

        // Save file
        let data = field.bytes().await.map_err(|e| {
            tracing::error!("Failed to read file data: {:?}", e);
            AppError::BadRequest("Failed to read file".to_string())
        })?;

        let mut file = fs::File::create(&file_path).await.map_err(|e| {
            tracing::error!("Failed to create file: {:?}", e);
            AppError::InternalServerError("Failed to save file".to_string())
        })?;

        file.write_all(&data).await.map_err(|e| {
            tracing::error!("Failed to write file: {:?}", e);
            AppError::InternalServerError("Failed to save file".to_string())
        })?;

        // Update product with image URL
        let image_url = format!("/uploads/{}", unique_filename);
        let product = sqlx::query_as::<_, Product>(
            "UPDATE products SET image_url = $1 WHERE id = $2 RETURNING *",
        )
        .bind(&image_url)
        .bind(id)
        .fetch_one(&pool)
        .await?;

        return Ok(Json(product));
    }

    Err(AppError::BadRequest("No image file provided".to_string()))
}
