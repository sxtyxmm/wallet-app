const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  wallet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['send', 'receive', 'swap'],
    lowercase: true
  },
  amount: {
    type: Number,
    required: [true, 'Transaction amount is required'],
    min: [0, 'Amount must be positive']
  },
  currency: {
    type: String,
    required: true,
    enum: ['BTC', 'ETH', 'LTC', 'ADA', 'DOT'],
    uppercase: true
  },
  fromAddress: {
    type: String,
    required: function() { return this.type === 'send' || this.type === 'swap'; },
    trim: true
  },
  toAddress: {
    type: String,
    required: function() { return this.type === 'receive' || this.type === 'send'; },
    trim: true
  },
  hash: {
    type: String,
    unique: true,
    sparse: true, // Allow multiple null values
    trim: true
  },
  blockHeight: {
    type: Number,
    min: 0
  },
  confirmations: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'failed', 'cancelled'],
    default: 'pending',
    lowercase: true
  },
  fee: {
    type: Number,
    default: 0,
    min: 0
  },
  gasPrice: {
    type: Number,
    min: 0
  },
  gasUsed: {
    type: Number,
    min: 0
  },
  note: {
    type: String,
    maxlength: [500, 'Note cannot exceed 500 characters'],
    trim: true
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

// Virtual for total transaction cost
transactionSchema.virtual('totalCost').get(function() {
  return this.amount + (this.fee || 0);
});

// Virtual for confirmation status
transactionSchema.virtual('isConfirmed').get(function() {
  return this.confirmations >= 3; // Considering 3+ confirmations as confirmed
});

// Index for performance
transactionSchema.index({ wallet: 1 });
transactionSchema.index({ user: 1 });
transactionSchema.index({ hash: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ createdAt: -1 });
transactionSchema.index({ user: 1, createdAt: -1 });
transactionSchema.index({ wallet: 1, createdAt: -1 });

// Pre-save middleware
transactionSchema.pre('save', function(next) {
  // Auto-generate hash if not provided (for demo purposes)
  if (!this.hash && this.isNew) {
    this.hash = `demo_${this.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  next();
});

module.exports = mongoose.model('Transaction', transactionSchema);
