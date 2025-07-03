const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');
const winston = require('winston');

// Load environment configuration
if (process.env.NODE_ENV === 'production') {
  require('dotenv').config({ path: path.resolve(__dirname, '.env.production') });
} else {
  require('dotenv').config();
}

// Database connection
const { connectDB, disconnectDB } = require('./config/database');

// Winston logger setup
const logDir = path.resolve(__dirname, 'logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: path.join(logDir, 'app.log') }),
    new winston.transports.Console({ 
      format: winston.format.simple(),
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
    })
  ]
});

// Connect to database
connectDB();

const app = express();

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: true,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : 
          process.env.NODE_ENV === 'production' ? false : '*',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Compression for better performance
app.use(compression());

// Sanitize data against NoSQL injection
app.use(mongoSanitize());

// Logging middleware
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined', { 
    stream: fs.createWriteStream(path.join(logDir, 'access.log'), { flags: 'a' }) 
  }));
} else {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000,
  max: process.env.RATE_LIMIT_MAX || 100,
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil((process.env.RATE_LIMIT_WINDOW || 15) * 60)
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/wallets', require('./routes/wallets'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/crypto', require('./routes/crypto'));

// Root endpoint - API info
app.get('/', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    // In production, serve the React app for root path
    const clientBuildPath = path.resolve(__dirname, '../client/build');
    return res.sendFile(path.join(clientBuildPath, 'index.html'));
  }
  
  // In development, show API info
  res.json({
    name: 'Crypto Wallet API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    status: 'Running',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      wallets: '/api/wallets',
      transactions: '/api/transactions',
      crypto: '/api/crypto'
    },
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Serve React static build in production
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.resolve(__dirname, '../client/build');
  app.use(express.static(clientBuildPath, {
    maxAge: '1y',
    etag: false
  }));
  
  // Handle React Router routes
  const generalRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // max 100 requests per windowMs
  });
  
  app.get('*', generalRateLimiter, (req, res) => {
    if (req.originalUrl.startsWith('/api/')) {
      return res.status(404).json({ message: 'API route not found' });
    }
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler for API routes only
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'API route not found',
    path: req.originalUrl
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  logger.info(`📊 Health check available at http://localhost:${PORT}/api/health`);
  if (process.env.NODE_ENV === 'production') {
    logger.info(`🌐 Frontend served at http://localhost:${PORT}`);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

module.exports = app;
