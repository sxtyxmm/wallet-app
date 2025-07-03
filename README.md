# Crypto Wallet App

A modern, secure cryptocurrency wallet application built with React and Node.js. This is a demo application designed for educational purposes showcasing wallet management functionality.

## Features

### 🔐 Security First
- JWT-based authentication with secure token management
- Password hashing with bcrypt
- Rate limiting and comprehensive security headers (Helmet)
- Input sanitization and XSS protection
- MongoDB sanitization to prevent NoSQL injection
- Account lockout after failed login attempts
- Two-factor authentication support (schema ready)

### 💰 Multi-Currency Support
- Bitcoin (BTC)
- Ethereum (ETH)
- Litecoin (LTC)
- Bitcoin Cash (BCH)
- Cardano (ADA) 
- Polkadot (DOT)
- Extensible architecture for adding more currencies

### 📱 Modern UI/UX
- Fully responsive design for all devices
- Beautiful gradient backgrounds and modern styling
- Clean and intuitive user interface
- Mobile-first responsive design
- Real-time price updates with mock data
- Interactive charts and visualizations

### 🚀 Core Functionality
- User registration and authentication
- Create and manage multiple wallets per user
- Send cryptocurrency transactions
- Receive cryptocurrency with QR codes
- Transaction history with filtering
- Portfolio tracking with Chart.js integration
- Address generation and management
- Balance tracking and portfolio overview

### 🛡️ Additional Features
- Comprehensive logging with Winston
- MongoDB database integration
- Environment-based configuration
- Production deployment scripts
- PM2 process management configuration
- Compression and performance optimization

## Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **React Router 6** - Client-side routing and navigation
- **Styled Components 6** - CSS-in-JS styling solution
- **Chart.js 4** with **React Chart.js 2** - Interactive data visualization
- **React Icons 4** - Beautiful icon library
- **Axios** - HTTP client for API requests
- **QR Code React** - QR code generation for addresses
- **React Hot Toast** - Toast notifications
- **Crypto-JS** - Client-side cryptographic functions

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** with **Mongoose 7** - Database and ODM
- **JWT (jsonwebtoken)** - Authentication tokens
- **bcryptjs** - Password hashing
- **Helmet** - Security headers middleware
- **CORS** - Cross-origin resource sharing
- **Express Rate Limit** - API rate limiting
- **Express Validator** - Input validation
- **Winston** - Logging framework
- **Morgan** - HTTP request logger
- **Compression** - Response compression
- **XSS Clean** - XSS protection middleware

### Development & Production
- **Nodemon** - Development server auto-restart
- **Concurrently** - Run multiple commands simultaneously
- **PM2** - Production process manager
- **ESLint** - Code linting
- **Jest & Supertest** - Testing framework

## Installation

### Prerequisites
- **Node.js 18+** - JavaScript runtime
- **npm** - Package manager
- **MongoDB** - Database (for production)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wallet-app
   ```

2. **Install dependencies**
   ```bash
   npm run install-deps
   ```
   This installs dependencies for root, server, and client.

3. **Set up environment variables**
   ```bash
   # Copy example environment file
   cp server/.env.example server/.env
   # Edit server/.env with your configuration
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

This will start:
- **Frontend**: http://localhost:3000 (React development server)
- **Backend**: http://localhost:5000 (Express server with nodemon)

### Development Environment Notes
- The application uses in-memory data storage for development
- MongoDB is only required for production deployment
- Frontend proxy is configured to redirect API calls to the backend

## Usage

### Creating Your First Wallet

1. **Register/Login**: Create an account or login with existing credentials
2. **Wallet Setup**: Follow the guided setup to create your first wallet
3. **Choose Currency**: Select from BTC, ETH, LTC, or BCH
4. **Secure Your Wallet**: Save your recovery phrase securely

### Sending Cryptocurrency

1. Navigate to the **Send** page
2. Select your wallet
3. Enter recipient address
4. Specify amount
5. Review transaction details
6. Confirm and send

### Receiving Cryptocurrency

1. Go to the **Receive** page
2. Select your wallet
3. Share your address or QR code
4. Monitor incoming transactions

### Managing Wallets

- **Dashboard**: Overview of all wallets and balances
- **History**: View all transactions with search and filters
- **Settings**: Manage security settings and preferences

## Development

### Project Structure
```
wallet-app/
├── client/                    # React frontend application
│   ├── public/               # Static assets
│   │   ├── index.html       # Main HTML template
│   │   └── manifest.json    # PWA manifest
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   │   └── Navbar.js    # Navigation component
│   │   ├── contexts/        # React context providers
│   │   │   ├── AuthContext.js    # Authentication state
│   │   │   └── WalletContext.js  # Wallet management state
│   │   ├── pages/           # Page components (routes)
│   │   │   ├── Dashboard.js      # Main dashboard
│   │   │   ├── Login.js          # User login
│   │   │   ├── Register.js       # User registration
│   │   │   ├── Send.js           # Send cryptocurrency
│   │   │   ├── Receive.js        # Receive cryptocurrency
│   │   │   ├── History.js        # Transaction history
│   │   │   ├── Settings.js       # User settings
│   │   │   └── WalletSetup.js    # Wallet creation
│   │   ├── App.js           # Main app component with routing
│   │   └── index.js         # React app entry point
│   ├── build/               # Production build output
│   └── package.json         # Frontend dependencies
├── server/                   # Node.js backend application
│   ├── config/
│   │   └── database.js      # MongoDB connection configuration
│   ├── middleware/
│   │   └── auth.js          # Authentication middleware
│   ├── models/              # Mongoose data models
│   │   ├── User.js          # User schema with authentication
│   │   ├── Wallet.js        # Wallet schema and methods
│   │   └── Transaction.js   # Transaction history schema
│   ├── routes/              # Express route handlers
│   │   ├── auth.js          # Authentication endpoints
│   │   ├── crypto.js        # Cryptocurrency price data
│   │   ├── transactions.js  # Transaction management
│   │   └── wallets.js       # Wallet operations
│   ├── logs/                # Application logs
│   ├── index.js             # Server entry point
│   └── package.json         # Backend dependencies
├── ecosystem.config.json     # PM2 production configuration
├── setup-production.sh      # Production deployment script
├── PRODUCTION-DEPLOY.md     # Detailed deployment guide
└── package.json             # Root project configuration
```

### Available Scripts

```bash
# Development
npm run dev              # Start both frontend and backend in development mode
npm run client           # Start React frontend only (localhost:3000)
npm run server           # Start Express backend only (localhost:5000)

# Production
npm run build            # Build React frontend for production
npm run build:prod       # Build frontend and install production dependencies
npm start:prod           # Start production server
npm run test:prod        # Build and test production deployment
npm run setup:prod       # Run production setup script (requires sudo)

# Dependencies
npm run install-deps     # Install dependencies for all projects (root, server, client)

# Development utilities
cd server && npm run dev    # Start backend with nodemon
cd client && npm start      # Start frontend development server
cd client && npm run build  # Build frontend only
```

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user (username, email, password)
- `POST /api/auth/login` - Login user (email/username, password)
- `GET /api/auth/me` - Get current authenticated user profile
- `POST /api/auth/logout` - Logout current user

#### Wallets
- `GET /api/wallets` - Get all wallets for authenticated user
- `POST /api/wallets` - Create new wallet (name, currency)
- `GET /api/wallets/:id` - Get specific wallet by ID
- `PUT /api/wallets/:id` - Update wallet information
- `DELETE /api/wallets/:id` - Delete wallet (soft delete)

#### Transactions
- `POST /api/transactions/send` - Create send transaction
- `GET /api/transactions` - Get user's transaction history
- `GET /api/transactions/:id` - Get specific transaction details
- `GET /api/transactions/wallet/:walletId` - Get transactions for specific wallet

#### Cryptocurrency Data
- `GET /api/crypto/prices` - Get current prices for all supported currencies
- `GET /api/crypto/price/:symbol` - Get specific cryptocurrency price
- `GET /api/crypto/market/:symbol` - Get market data for specific currency

### Database Models

#### User Model
- Authentication with username/email and hashed password
- Account security features (login attempts, account locking)
- Two-factor authentication schema (ready for implementation)
- Timestamps and user status tracking

#### Wallet Model
- Multi-currency support (BTC, ETH, LTC, BCH, ADA, DOT)
- Secure private key storage (encrypted)
- Balance tracking and address management
- User association and wallet naming

#### Transaction Model
- Complete transaction logging (send/receive)
- Multi-currency transaction support
- Transaction status tracking and confirmation
- Fee calculation and gas price storage

## Production Deployment

### Quick Production Setup

For detailed production deployment instructions, see [PRODUCTION-DEPLOY.md](./PRODUCTION-DEPLOY.md).

1. **Run the automated setup script**
   ```bash
   sudo ./setup-production.sh
   ```
   This script will:
   - Install and configure MongoDB
   - Set up PM2 process manager
   - Create production database with authentication
   - Configure proper file permissions

2. **Configure environment variables**
   Create `/server/.env.production` with:
   ```env
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb://walletapp:your_password@localhost:27017/cryptowallet_prod
   JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters
   ALLOWED_ORIGINS=https://yourdomain.com
   ```

3. **Build and deploy**
   ```bash
   npm run build:prod     # Build frontend and install production dependencies
   pm2 start ecosystem.config.json --env production
   ```

### PM2 Process Management

The application includes PM2 configuration in `ecosystem.config.json`:
- Cluster mode for better performance
- Automatic restarts and error recovery
- Comprehensive logging
- Memory usage monitoring
- Zero-downtime deployments

### Security Features in Production
- MongoDB authentication and connection security
- Rate limiting and request validation
- Security headers via Helmet middleware
- CORS configuration for allowed origins
- Input sanitization and XSS protection
- Comprehensive error logging without exposing sensitive data

## Security Considerations

⚠️ **Important**: This is a demo application for educational purposes. For production use with real cryptocurrency:

### Current Security Features
- JWT-based authentication with secure token handling
- Password hashing using bcryptjs with configurable rounds
- Rate limiting to prevent brute force attacks
- Input validation and sanitization (XSS, NoSQL injection protection)
- Security headers via Helmet middleware
- Account lockout after failed login attempts
- Environment-based configuration management

### Additional Security Requirements for Production
1. **Hardware Security Modules (HSM)** for private key storage
2. **Multi-signature wallet** implementation
3. **Cold storage** for large amounts
4. **Regular security audits** and penetration testing
5. **HTTPS/TLS encryption** for all communications
6. **Database encryption** at rest
7. **Real-time fraud detection** systems
8. **Comprehensive audit logging** with immutable records
9. **Backup and disaster recovery** procedures
10. **Compliance** with financial regulations (KYC/AML)

### Development Security Notes
- Never use real private keys or mainnet addresses in development
- All cryptocurrency operations use mock data
- Database contains only test/demo data
- No real financial transactions are processed

## Contributing

We welcome contributions to improve the wallet application! Please follow these guidelines:

1. **Fork the repository** and create a feature branch
2. **Follow code style** - use ESLint configuration provided
3. **Add tests** for new functionality when applicable
4. **Update documentation** including API endpoints and README changes
5. **Submit a pull request** with clear description of changes

### Development Setup for Contributors
```bash
git clone <your-fork-url>
cd wallet-app
npm run install-deps
npm run dev
```

### Code Style
- Use ES6+ JavaScript features
- Follow React hooks patterns for frontend
- Use async/await for asynchronous operations
- Include proper error handling and logging
- Write descriptive commit messages

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support and Documentation

- **Issues**: Report bugs and request features via [GitHub Issues](../../issues)
- **Documentation**: Comprehensive API documentation in code comments
- **Production Guide**: See [PRODUCTION-DEPLOY.md](./PRODUCTION-DEPLOY.md) for deployment
- **Development**: This README covers development setup and usage

## Acknowledgments

- Built with React and Node.js ecosystem
- Uses Chart.js for data visualization
- MongoDB for data persistence
- Styled Components for modern CSS-in-JS styling

---

**⚠️ Disclaimer**: This is a demo application for educational and development purposes only. Do not use with real cryptocurrency, private keys, or production funds. The developers are not responsible for any financial losses.