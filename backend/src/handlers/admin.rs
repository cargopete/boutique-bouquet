use axum::{extract::State, Json};
use sqlx::PgPool;

use crate::{
    auth::create_jwt,
    error::AppError,
    models::{Admin, AdminResponse, LoginRequest, LoginResponse},
};

pub async fn login(
    State(pool): State<PgPool>,
    Json(payload): Json<LoginRequest>,
) -> Result<Json<LoginResponse>, AppError> {
    // Find admin by email
    let admin = sqlx::query_as::<_, Admin>("SELECT * FROM admins WHERE email = $1")
        .bind(&payload.email)
        .fetch_optional(&pool)
        .await?
        .ok_or_else(|| AppError::Unauthorized("Invalid credentials".to_string()))?;

    // Verify password
    let valid = bcrypt::verify(&payload.password, &admin.password_hash)
        .map_err(|e| {
            tracing::error!("Bcrypt error: {:?}", e);
            AppError::InternalServerError("Authentication error".to_string())
        })?;

    if !valid {
        return Err(AppError::Unauthorized("Invalid credentials".to_string()));
    }

    // Create JWT token
    let token = create_jwt(admin.id, &admin.email)?;

    Ok(Json(LoginResponse {
        token,
        admin: AdminResponse {
            id: admin.id,
            email: admin.email,
        },
    }))
}
