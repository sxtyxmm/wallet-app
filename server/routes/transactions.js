const express = require('express');
const crypto = require('crypto');
const router = express.Router();

// Mock transaction database
const transactions = [];

// Middleware to authenticate JWT token
const authenticateToken = require('../middleware/auth');

// Send transaction
router.post('/send', authenticateToken, (req, res) => {
  try {
    const { walletId, toAddress, amount, note } = req.body;

    // Validate input
    if (!walletId || !toAddress || !amount) {
      return res.status(400).json({ message: 'Wallet ID, recipient address, and amount are required' });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    // In a real app, you would:
    // 1. Verify the wallet belongs to the user
    // 2. Check if the wallet has sufficient balance
    // 3. Create and broadcast the transaction to the blockchain
    // 4. Wait for confirmation

    // Mock transaction creation
    const transaction = {
      id: Date.now().toString(),
      hash: generateTransactionHash(),
      userId: req.userId,
      walletId,
      type: 'sent',
      amount: parseFloat(amount),
      currency: 'BTC', // This should come from the wallet
      fromAddress: generateMockAddress(),
      toAddress,
      note: note || null,
      status: 'pending',
      date: new Date(),
      confirmations: 0,
      fee: 0.0001 // Mock network fee
    };

    transactions.push(transaction);

    // Simulate transaction confirmation after 30 seconds
    setTimeout(() => {
      const txIndex = transactions.findIndex(tx => tx.id === transaction.id);
      if (txIndex !== -1) {
        transactions[txIndex].status = 'confirmed';
        transactions[txIndex].confirmations = 6;
      }
    }, 30000);

    res.status(201).json({
      message: 'Transaction sent successfully',
      transaction
    });
  } catch (error) {
    console.error('Send transaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get transaction by ID
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const transaction = transactions.find(tx => tx.id === req.params.id && tx.userId === req.userId);
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all transactions for user
router.get('/', authenticateToken, (req, res) => {
  try {
    const userTransactions = transactions.filter(tx => tx.userId === req.userId);
    
    // Sort by date (newest first)
    userTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    res.json(userTransactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Estimate transaction fee
router.post('/estimate-fee', authenticateToken, (req, res) => {
  try {
    const { currency, amount, priority } = req.body;

    // Mock fee calculation
    const baseFee = 0.0001;
    const priorityMultiplier = {
      'low': 1,
      'medium': 1.5,
      'high': 2
    };

    const fee = baseFee * (priorityMultiplier[priority] || 1);

    res.json({
      currency,
      amount: parseFloat(amount),
      fee,
      total: parseFloat(amount) + fee,
      estimatedTime: {
        'low': '30-60 minutes',
        'medium': '10-30 minutes',
        'high': '5-15 minutes'
      }[priority] || '10-30 minutes'
    });
  } catch (error) {
    console.error('Estimate fee error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get transaction status
router.get('/:id/status', authenticateToken, (req, res) => {
  try {
    const transaction = transactions.find(tx => tx.id === req.params.id && tx.userId === req.userId);
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({
      id: transaction.id,
      hash: transaction.hash,
      status: transaction.status,
      confirmations: transaction.confirmations,
      date: transaction.date
    });
  } catch (error) {
    console.error('Get transaction status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to generate transaction hash
function generateTransactionHash() {
  return '0x' + crypto.randomBytes(32).toString('hex');
}

// Helper function to generate mock address
function generateMockAddress() {
  return '1' + crypto.randomBytes(20).toString('hex').slice(0, 33);
}

module.exports = router;
