#!/bin/bash
# Production Environment Setup Script for Crypto Wallet App

set -e  # Exit on any error

echo "🚀 Setting up Production Environment for Crypto Wallet App..."

# Check if running as root/sudo
if [ "$EUID" -ne 0 ]; then
    echo "❌ Please run this script with sudo privileges"
    exit 1
fi

# Update system packages
echo "📦 Updating system packages..."
apt update -y

# Install MongoDB
echo "🗄️  Installing MongoDB..."
apt install -y mongodb

# Start MongoDB service
echo "▶️  Starting MongoDB service..."
service mongodb start

# Verify MongoDB is running
echo "✅ Verifying MongoDB connection..."
if mongo --eval "db.runCommand('ping')" > /dev/null 2>&1; then
    echo "✅ MongoDB is running successfully"
else
    echo "❌ MongoDB failed to start"
    exit 1
fi

# Install PM2 for process management (optional but recommended)
echo "⚙️  Installing PM2 for process management..."
npm install -g pm2

# Create MongoDB directories and set permissions
echo "📁 Setting up MongoDB directories..."
mkdir -p /var/log/mongodb
mkdir -p /var/lib/mongodb
chown mongodb:mongodb /var/log/mongodb
chown mongodb:mongodb /var/lib/mongodb

# Create production database
echo "🗄️  Setting up production database..."
mongo --eval "
use cryptowallet_prod;
db.createUser({
  user: 'walletapp',
  pwd: 'secure_password_change_in_production',
  roles: [{ role: 'readWrite', db: 'cryptowallet_prod' }]
});
db.createCollection('users');
db.createCollection('wallets');
db.createCollection('transactions');
"

echo "✅ Production environment setup complete!"
echo ""
echo "🔧 Next steps:"
echo "1. Update your .env.production file with secure credentials"
echo "2. Run: npm run build:prod"
echo "3. Run: npm run start:prod"
echo ""
echo "📊 MongoDB Status:"
service mongodb status
