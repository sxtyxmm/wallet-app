const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Wallet name is required'],
    trim: true,
    maxlength: [50, 'Wallet name cannot exceed 50 characters']
  },
  currency: {
    type: String,
    required: [true, 'Currency is required'],
    enum: ['BTC', 'ETH', 'LTC', 'ADA', 'DOT'],
    uppercase: true
  },
  address: {
    type: String,
    required: [true, 'Wallet address is required'],
    unique: true,
    trim: true
  },
  privateKey: {
    type: String,
    required: true,
    select: false // Never include in queries by default
  },
  balance: {
    type: Number,
    default: 0,
    min: [0, 'Balance cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastSyncDate: {
    type: Date,
    default: Date.now
  },
  network: {
    type: String,
    enum: ['mainnet', 'testnet'],
    default: 'mainnet'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for formatted balance
walletSchema.virtual('formattedBalance').get(function() {
  return `${this.balance} ${this.currency}`;
});

// Index for performance
walletSchema.index({ user: 1 });
walletSchema.index({ currency: 1 });
walletSchema.index({ address: 1 });
walletSchema.index({ user: 1, currency: 1 });

// Pre-save middleware
walletSchema.pre('save', function(next) {
  this.lastSyncDate = new Date();
  next();
});

module.exports = mongoose.model('Wallet', walletSchema);
