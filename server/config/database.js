const mongoose = require('mongoose');
const winston = require('winston');
const { MongoMemoryServer } = require('mongodb-memory-server');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [new winston.transports.Console()]
});

let mongoServer;

const connectDB = async () => {
  try {
    let mongoURI;
    
    // Use in-memory MongoDB for development if no external MongoDB is available
    if (process.env.NODE_ENV !== 'production' && !process.env.MONGODB_URI) {
      try {
        mongoServer = await MongoMemoryServer.create({
          binary: {
            version: '5.0.18', // Use a specific stable version
            downloadDir: './mongodb-binaries',
            skipMD5: true,
          },
          instance: {
            dbName: 'cryptowallet-test',
            storageEngine: 'wiredTiger',
          },
          autoStart: true,
        });
        mongoURI = mongoServer.getUri();
        logger.info('🔧 Using in-memory MongoDB for development');
      } catch (memoryServerError) {
        logger.warn('⚠️ MongoDB Memory Server failed, falling back to mock data:', memoryServerError.message);
        // Fall back to just using the mock data in routes (no database needed)
        logger.info('📝 Using in-memory data store for development');
        return; // Exit early, no database connection needed
      }
    } else {
      mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cryptowallet';
    }
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    };

    await mongoose.connect(mongoURI, options);
    
    logger.info(`✅ MongoDB connected successfully to ${mongoose.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });

  } catch (error) {
    logger.error('❌ MongoDB connection failed:', error.message);
    
    // In production, we might want to exit the process
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

// Cleanup function for graceful shutdown
const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
      logger.info('🔧 In-memory MongoDB stopped');
    }
  } catch (error) {
    logger.error('❌ Error during database cleanup:', error.message);
  }
};

module.exports = { connectDB, disconnectDB };
