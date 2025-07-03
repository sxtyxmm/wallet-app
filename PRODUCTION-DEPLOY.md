# Production Deployment Guide

## Prerequisites

Before deploying to production, ensure you have:

1. **MongoDB Database** - Required for storing user data, wallets, and transactions
2. **Node.js 18+** - Runtime environment
3. **Process Manager** - PM2 recommended for production
4. **Reverse Proxy** - Nginx or similar for HTTPS and load balancing
5. **SSL Certificate** - For HTTPS encryption

## Quick Production Setup

### 1. Run the Production Setup Script

```bash
sudo ./setup-production.sh
```

This script will:
- Install MongoDB
- Start MongoDB service
- Create production database
- Install PM2 process manager
- Set up proper directories and permissions

### 2. Configure Environment Variables

Update `/server/.env.production`:

```env
NODE_ENV=production
PORT=5000

# Database (Required)
MONGODB_URI=mongodb://walletapp:your_secure_password@localhost:27017/cryptowallet_prod

# Security (Required - Change these!)
JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters
BCRYPT_ROUNDS=12

# CORS (Required - Set your domain)
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### 3. Build and Start

```bash
# Build the application
npm run build:prod

# Start in production mode
npm run start:prod

# OR use PM2 for better process management
pm2 start server/index.js --name "crypto-wallet" -- --env production
```

## Why MongoDB is Essential

MongoDB is **required** because the application:

1. **Stores User Accounts** - Authentication, profiles, security settings
2. **Manages Wallets** - Wallet addresses, balances, configurations
3. **Tracks Transactions** - All send/receive operations and history
4. **Maintains Security** - Session management, rate limiting data

Without MongoDB, the application cannot:
- Register or authenticate users
- Create or manage wallets
- Process transactions
- Store any persistent data

## Production Infrastructure Components

### Required Components
- ✅ **MongoDB** - Primary database
- ✅ **Node.js Server** - Application backend
- ✅ **React Build** - Frontend static files

### Recommended Components
- 🔧 **PM2** - Process management and monitoring
- 🔧 **Nginx** - Reverse proxy and static file serving
- 🔧 **SSL Certificate** - HTTPS encryption
- 🔧 **Log Rotation** - Prevent log files from growing too large
- 🔧 **Backup Strategy** - Regular database backups

## Environment-Specific Configurations

### Development
- Uses in-memory mock data
- MongoDB optional for testing
- Hot reloading enabled
- Debug logging

### Production
- **MongoDB required** - No fallbacks
- Optimized React build
- Production logging
- Security hardening
- Error handling without stack traces

## Monitoring and Maintenance

### Health Checks
```bash
# Check application health
curl http://localhost:5000/api/health

# Check MongoDB status
sudo service mongodb status

# Check PM2 processes
pm2 status
```

### Log Monitoring
```bash
# Application logs
tail -f server/logs/app.log

# Access logs
tail -f server/logs/access.log

# MongoDB logs
sudo tail -f /var/log/mongodb/mongodb.log
```

## Security Checklist

- [ ] MongoDB authentication enabled
- [ ] Strong JWT secret configured
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation active
- [ ] HTTPS enforced
- [ ] Environment variables secured
- [ ] Regular security updates

## Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
sudo service mongodb status

# Test connection
mongo --eval "db.runCommand('ping')"

# Check logs
sudo tail -f /var/log/mongodb/mongodb.log
```

### Application Won't Start
```bash
# Check environment variables
cat server/.env.production

# Test with debug logging
NODE_ENV=production DEBUG=* node server/index.js
```
