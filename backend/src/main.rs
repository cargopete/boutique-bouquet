use axum::{
    middleware,
    routing::{delete, get, post, put},
    Router,
};
use sqlx::postgres::PgPoolOptions;
use std::net::SocketAddr;
use tower_http::{
    cors::{Any, CorsLayer},
    services::ServeDir,
    trace::TraceLayer,
};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

mod auth;
mod error;
mod handlers;
mod models;

#[tokio::main]
async fn main() {
    println!("=== Starting Boutique Bouquet API ===");

    // Load environment variables
    dotenv::dotenv().ok();
    println!("=== Environment loaded ===");

    // Initialize tracing
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "boutique_bouquet_api=debug,tower_http=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    // Database connection
    let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    tracing::info!("Connecting to database...");
    let db_pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .expect("Failed to connect to database");

    tracing::info!("Running migrations...");
    sqlx::migrate!("./migrations")
        .run(&db_pool)
        .await
        .expect("Failed to run migrations");

    tracing::info!("Database ready!");

    // CORS configuration
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    // Get upload directory from env
    let upload_dir = std::env::var("UPLOAD_DIR").unwrap_or_else(|_| "./uploads".to_string());

    // Create upload directory if it doesn't exist
    tokio::fs::create_dir_all(&upload_dir)
        .await
        .expect("Failed to create upload directory");

    // Public routes
    let public_routes = Router::new()
        .route("/api/health", get(handlers::health::health_check))
        .route("/api/products", get(handlers::products::list_products))
        .route("/api/products/:id", get(handlers::products::get_product))
        .route("/api/orders", post(handlers::orders::create_order))
        .route("/api/admin/login", post(handlers::admin::login));

    // Admin routes (protected with JWT)
    let admin_routes = Router::new()
        .route(
            "/api/admin/products",
            get(handlers::products::list_all_products).post(handlers::products::create_product),
        )
        .route(
            "/api/admin/products/:id",
            put(handlers::products::update_product).delete(handlers::products::delete_product),
        )
        .route(
            "/api/admin/products/:id/image",
            post(handlers::products::upload_product_image),
        )
        .route("/api/admin/orders", get(handlers::orders::list_orders))
        .route(
            "/api/admin/orders/:id",
            get(handlers::orders::get_order).put(handlers::orders::update_order_status),
        )
        .layer(middleware::from_fn(auth::auth_middleware));

    // Combine routes and add state
    let app = Router::new()
        .merge(public_routes)
        .merge(admin_routes)
        .nest_service("/uploads", ServeDir::new(upload_dir))
        .layer(TraceLayer::new_for_http())
        .layer(cors)
        .with_state(db_pool);

    // Get host and port from environment
    let host = std::env::var("HOST").unwrap_or_else(|_| "0.0.0.0".to_string());
    let port = std::env::var("PORT")
        .unwrap_or_else(|_| "8000".to_string())
        .parse::<u16>()
        .expect("PORT must be a valid number");

    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    tracing::info!("Starting server on {}:{}", host, port);

    let listener = tokio::net::TcpListener::bind(&addr)
        .await
        .expect("Failed to bind to address");

    axum::serve(listener, app)
        .await
        .expect("Server error");
}
