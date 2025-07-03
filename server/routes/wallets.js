const express = require('express');
const crypto = require('crypto');
const router = express.Router();

// Mock wallet database
const wallets = [];

// Middleware to authenticate JWT token
const authenticateToken = require('../middleware/auth');

// Get all wallets for authenticated user
router.get('/', authenticateToken, (req, res) => {
  try {
    const userWallets = wallets.filter(wallet => wallet.userId === req.userId);
    res.json(userWallets);
  } catch (error) {
    console.error('Get wallets error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new wallet
router.post('/', authenticateToken, (req, res) => {
  try {
    const { name, currency, type } = req.body;

    // Validate input
    if (!name || !currency || !type) {
      return res.status(400).json({ message: 'Name, currency, and type are required' });
    }

    // Generate wallet address (mock)
    const address = generateWalletAddress(currency);
    
    // Generate private key (mock - in production, use proper cryptographic methods)
    const privateKey = crypto.randomBytes(32).toString('hex');

    // Create wallet
    const wallet = {
      _id: Date.now().toString(),
      userId: req.userId,
      name,
      currency,
      type,
      address,
      privateKey, // In production, this should be encrypted
      balance: 0,
      createdAt: new Date()
    };

    wallets.push(wallet);

    // Return wallet data (without private key)
    const { privateKey: _, ...walletWithoutPrivateKey } = wallet;

    res.status(201).json({
      message: 'Wallet created successfully',
      ...walletWithoutPrivateKey
    });
  } catch (error) {
    console.error('Create wallet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get wallet by ID
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const wallet = wallets.find(w => w._id === req.params.id && w.userId === req.userId);
    
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    const { privateKey: _, ...walletWithoutPrivateKey } = wallet;
    res.json(walletWithoutPrivateKey);
  } catch (error) {
    console.error('Get wallet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update wallet
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const { name } = req.body;
    const walletIndex = wallets.findIndex(w => w._id === req.params.id && w.userId === req.userId);
    
    if (walletIndex === -1) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    // Update wallet
    wallets[walletIndex] = {
      ...wallets[walletIndex],
      name: name || wallets[walletIndex].name,
      updatedAt: new Date()
    };

    const { privateKey: _, ...walletWithoutPrivateKey } = wallets[walletIndex];
    res.json(walletWithoutPrivateKey);
  } catch (error) {
    console.error('Update wallet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete wallet
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const walletIndex = wallets.findIndex(w => w._id === req.params.id && w.userId === req.userId);
    
    if (walletIndex === -1) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    wallets.splice(walletIndex, 1);
    res.json({ message: 'Wallet deleted successfully' });
  } catch (error) {
    console.error('Delete wallet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate new address for wallet
router.post('/:id/address', authenticateToken, (req, res) => {
  try {
    const wallet = wallets.find(w => w._id === req.params.id && w.userId === req.userId);
    
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    const newAddress = generateWalletAddress(wallet.currency);
    
    // In a real app, you'd store this address in the database
    res.json({ address: newAddress });
  } catch (error) {
    console.error('Generate address error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get transactions for a wallet
router.get('/:id/transactions', authenticateToken, (req, res) => {
  try {
    const wallet = wallets.find(w => w._id === req.params.id && w.userId === req.userId);
    
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    // Mock transactions - in production, fetch from blockchain or database
    const transactions = [
      {
        id: '1',
        hash: '0x1234567890abcdef',
        type: 'received',
        amount: 0.5,
        currency: wallet.currency,
        fromAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        toAddress: wallet.address,
        date: new Date(Date.now() - 86400000), // 1 day ago
        status: 'confirmed'
      },
      {
        id: '2',
        hash: '0xabcdef1234567890',
        type: 'sent',
        amount: 0.1,
        currency: wallet.currency,
        fromAddress: wallet.address,
        toAddress: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
        date: new Date(Date.now() - 172800000), // 2 days ago
        status: 'confirmed'
      }
    ];

    res.json(transactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to generate wallet address
function generateWalletAddress(currency) {
  const addressPrefixes = {
    'BTC': '1',
    'ETH': '0x',
    'LTC': 'L',
    'BCH': 'bitcoincash:'
  };

  const prefix = addressPrefixes[currency] || '1';
  const randomPart = crypto.randomBytes(20).toString('hex');
  
  if (currency === 'ETH') {
    return prefix + randomPart;
  }
  
  return prefix + randomPart.slice(0, 33);
}

module.exports = router;
