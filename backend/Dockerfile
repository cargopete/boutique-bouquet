# Production Dockerfile - Multi-stage build
FROM rust:1.83-slim as builder

# Install dependencies
RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install nightly toolchain to support edition2024 dependencies
# Retry logic in case of network issues
RUN for i in 1 2 3; do rustup toolchain install nightly && break || sleep 5; done && \
    rustup default nightly

WORKDIR /app

# Copy manifests
COPY Cargo.toml ./

# Build dependencies only (cached layer)
RUN mkdir src && \
    echo "fn main() {}" > src/main.rs && \
    cargo build --release && \
    rm -rf src

# Copy source code
COPY . .

# Touch main.rs to ensure it's rebuilt
RUN touch src/main.rs

# Build the application
RUN cargo build --release

# Runtime stage
FROM debian:bookworm-slim

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    libssl3 \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy the binary from builder
COPY --from=builder /app/target/release/boutique-bouquet-api /app/boutique-bouquet-api

# Copy migrations
COPY --from=builder /app/migrations /app/migrations

# Create uploads directory
RUN mkdir -p /app/uploads

EXPOSE 8000

CMD ["/app/boutique-bouquet-api"]
