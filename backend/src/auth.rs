use axum::{
    extract::Request,
    middleware::Next,
    response::Response,
};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use std::time::{SystemTime, UNIX_EPOCH};

use crate::error::AppError;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,     // admin email
    pub admin_id: i32,   // admin id
    pub exp: u64,        // expiry timestamp
}

pub fn create_jwt(admin_id: i32, email: &str) -> Result<String, AppError> {
    let secret = std::env::var("JWT_SECRET")
        .map_err(|_| AppError::InternalServerError("JWT_SECRET not configured".to_string()))?;

    let expiry_hours = std::env::var("JWT_EXPIRY_HOURS")
        .unwrap_or_else(|_| "24".to_string())
        .parse::<u64>()
        .unwrap_or(24);

    let expiration = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs()
        + (expiry_hours * 3600);

    let claims = Claims {
        sub: email.to_string(),
        admin_id,
        exp: expiration,
    };

    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(secret.as_bytes()),
    )
    .map_err(|e| {
        tracing::error!("JWT encoding error: {:?}", e);
        AppError::InternalServerError("Failed to create token".to_string())
    })
}

pub fn verify_jwt(token: &str) -> Result<Claims, AppError> {
    let secret = std::env::var("JWT_SECRET")
        .map_err(|_| AppError::InternalServerError("JWT_SECRET not configured".to_string()))?;

    decode::<Claims>(
        token,
        &DecodingKey::from_secret(secret.as_bytes()),
        &Validation::default(),
    )
    .map(|data| data.claims)
    .map_err(|e| {
        tracing::error!("JWT verification error: {:?}", e);
        AppError::Unauthorized("Invalid or expired token".to_string())
    })
}

// Middleware to extract and verify JWT from Authorization header
pub async fn auth_middleware(mut request: Request, next: Next) -> Result<Response, AppError> {
    let auth_header = request
        .headers()
        .get("Authorization")
        .and_then(|h| h.to_str().ok())
        .ok_or_else(|| AppError::Unauthorized("Missing authorization header".to_string()))?;

    let token = auth_header
        .strip_prefix("Bearer ")
        .ok_or_else(|| AppError::Unauthorized("Invalid authorization format".to_string()))?;

    let claims = verify_jwt(token)?;

    // Store claims in request extensions for handlers to access
    request.extensions_mut().insert(claims);

    Ok(next.run(request).await)
}
