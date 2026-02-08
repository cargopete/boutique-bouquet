#!/bin/bash
# Studio Zemya - DigitalOcean Droplet Setup Script
# Run as root or with sudo

set -e

echo "=== Studio Zemya Backend Setup ==="

# Update system
echo "Updating system..."
apt update && apt upgrade -y

# Install dependencies
echo "Installing dependencies..."
apt install -y \
    build-essential \
    pkg-config \
    libssl-dev \
    postgresql \
    postgresql-contrib \
    nginx \
    certbot \
    python3-certbot-nginx \
    git \
    curl

# Install Rust
echo "Installing Rust..."
if ! command -v rustup &> /dev/null; then
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source ~/.cargo/env
fi

# Create application directory
echo "Creating application directory..."
mkdir -p /var/www/studio-zemya
chown -R www-data:www-data /var/www/studio-zemya

# Clone repository (run this part manually or adjust URL)
echo "Clone the repository:"
echo "  git clone git@github.com:cargopete/boutique-bouquet.git /var/www/studio-zemya"
echo ""

# Setup PostgreSQL
echo "Setting up PostgreSQL..."
sudo -u postgres psql -c "CREATE DATABASE studio_zemya;" 2>/dev/null || echo "Database may already exist"
sudo -u postgres psql -c "CREATE USER zemya WITH PASSWORD 'CHANGE_THIS_PASSWORD';" 2>/dev/null || echo "User may already exist"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE studio_zemya TO zemya;"
sudo -u postgres psql -c "ALTER DATABASE studio_zemya OWNER TO zemya;"

echo ""
echo "=== Manual Steps Required ==="
echo ""
echo "1. Clone the repo:"
echo "   git clone git@github.com:cargopete/boutique-bouquet.git /var/www/studio-zemya"
echo ""
echo "2. Configure environment:"
echo "   cd /var/www/studio-zemya/backend"
echo "   cp .env.example .env"
echo "   nano .env  # Set your DATABASE_URL, JWT_SECRET, CORS_ORIGINS"
echo ""
echo "3. Build the backend:"
echo "   cd /var/www/studio-zemya/backend"
echo "   ~/.cargo/bin/cargo build --release"
echo ""
echo "4. Install systemd service:"
echo "   cp /var/www/studio-zemya/deploy/studio-zemya.service /etc/systemd/system/"
echo "   systemctl daemon-reload"
echo "   systemctl enable studio-zemya"
echo "   systemctl start studio-zemya"
echo ""
echo "5. Setup Nginx:"
echo "   cp /var/www/studio-zemya/deploy/nginx-studio-zemya.conf /etc/nginx/sites-available/studio-zemya"
echo "   ln -s /etc/nginx/sites-available/studio-zemya /etc/nginx/sites-enabled/"
echo "   nginx -t"
echo ""
echo "6. Get SSL certificate:"
echo "   certbot --nginx -d api.studiozemya.com"
echo ""
echo "7. Start everything:"
echo "   systemctl restart nginx"
echo "   systemctl status studio-zemya"
echo ""
echo "8. Create admin user:"
echo "   cd /var/www/studio-zemya/backend"
echo "   ./target/release/studio-zemya-api create-admin admin@studiozemya.com yourpassword"
echo ""
echo "=== Done ==="
