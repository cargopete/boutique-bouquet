# Boutique Bouquet 💐

E-commerce platform for artificial flower bouquets targeting the Bulgarian market.

## Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Shadcn/ui
- Zustand (state management)

**Backend:**
- Rust
- Axum (web framework)
- SQLx (PostgreSQL driver)
- JWT authentication

**Infrastructure:**
- Docker & Docker Compose
- PostgreSQL 16
- Nginx (production)

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Git

### Local Development

1. Clone the repository:
```bash
git clone <repository-url>
cd boutique-bouquet
```

2. Copy environment files:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

3. Start the stack:
```bash
docker-compose up
```

4. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Health check: http://localhost:8000/api/health

### Create Admin User

After the stack is running, create an admin user:

```bash
docker-compose exec backend cargo run -- create-admin admin@example.com yourpassword
```

## Project Structure

```
boutique-bouquet/
├── frontend/          # Next.js application
├── backend/           # Rust/Axum API
├── nginx/             # Production reverse proxy
└── docker-compose.yml # Local development setup
```

## Development Workflow

### Backend Development

```bash
# Run backend tests
docker-compose exec backend cargo test

# Check code
docker-compose exec backend cargo check

# Format code
docker-compose exec backend cargo fmt
```

### Frontend Development

```bash
# Run frontend tests
docker-compose exec frontend npm test

# Lint code
docker-compose exec frontend npm run lint

# Type check
docker-compose exec frontend npm run type-check
```

## Database Migrations

Migrations are automatically run on startup. To add a new migration:

1. Create a new SQL file in `backend/migrations/`
2. Name it with incrementing number: `003_your_migration.sql`
3. Restart the backend container

## API Documentation

### Public Endpoints

- `GET /api/products` - List all active products
- `GET /api/products/:id` - Get product details
- `POST /api/orders` - Create new order
- `GET /api/health` - Health check

### Admin Endpoints (requires JWT)

- `POST /api/admin/login` - Admin login
- `GET /api/admin/products` - List all products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `POST /api/admin/products/:id/image` - Upload product image
- `GET /api/admin/orders` - List orders
- `GET /api/admin/orders/:id` - Get order details
- `PUT /api/admin/orders/:id` - Update order status

## Task Runner (yatr)

This project uses [yatr](https://github.com/crates-go/yatr) as a task runner for simplified development workflows.

### Why yatr?

yatr provides several benefits for this project:

- **Simplified Commands**: Run complex multi-step workflows with a single command
- **Cross-Platform**: Works consistently across macOS, Linux, and Windows
- **Language Agnostic**: Manages both Rust backend and Node.js frontend tasks
- **Parallel Execution**: Run multiple services concurrently for local development
- **Configuration as Code**: All tasks defined in `yatr.toml` for easy versioning

### Available Tasks

```bash
# List all available tasks
yatr list

# Start full stack (Docker)
yatr dev

# Start backend and frontend locally (requires local Postgres)
yatr dev-local

# Run frontend locally
yatr frontend-dev-local

# Run backend locally
cd backend && cargo run

# Database migrations
yatr migrate
```

### Example: Local Development

Instead of running multiple commands:
```bash
docker-compose up -d postgres
cd backend && cargo run &
cd frontend && npm run dev &
```

Simply run:
```bash
yatr dev-local
```

### Task Configuration

All tasks are defined in `yatr.toml` at the project root. Tasks support:
- Sequential and parallel execution
- Custom working directories
- Environment variable configuration
- Shell command composition

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment instructions.

## License

Proprietary - All rights reserved
