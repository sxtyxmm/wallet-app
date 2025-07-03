const express = require('express');
const axios = require('axios');
const router = express.Router();

// Mock crypto price data
const mockPrices = {
  'BTC': 45000,
  'ETH': 3200,
  'LTC': 180,
  'BCH': 520
};

// Get current crypto prices
router.get('/prices', async (req, res) => {
  try {
    // In a real app, you would fetch prices from a crypto API like CoinGecko or CoinMarketCap
    // For this demo, we'll use mock data
    
    const prices = {
      bitcoin: {
        usd: mockPrices.BTC,
        change_24h: Math.random() * 10 - 5 // Random change between -5% and +5%
      },
      ethereum: {
        usd: mockPrices.ETH,
        change_24h: Math.random() * 10 - 5
      },
      litecoin: {
        usd: mockPrices.LTC,
        change_24h: Math.random() * 10 - 5
      },
      'bitcoin-cash': {
        usd: mockPrices.BCH,
        change_24h: Math.random() * 10 - 5
      }
    };

    res.json(prices);
  } catch (error) {
    console.error('Get prices error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific crypto price
router.get('/price/:symbol', async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    
    if (!mockPrices[symbol]) {
      return res.status(404).json({ message: 'Cryptocurrency not found' });
    }

    const price = {
      symbol,
      usd: mockPrices[symbol],
      change_24h: Math.random() * 10 - 5,
      last_updated: new Date().toISOString()
    };

    res.json(price);
  } catch (error) {
    console.error('Get price error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get market data
router.get('/market/:symbol', async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    
    if (!mockPrices[symbol]) {
      return res.status(404).json({ message: 'Cryptocurrency not found' });
    }

    const marketData = {
      symbol,
      name: getCryptoName(symbol),
      current_price: mockPrices[symbol],
      market_cap: mockPrices[symbol] * 19000000, // Mock market cap
      volume_24h: mockPrices[symbol] * 50000, // Mock volume
      price_change_24h: Math.random() * 1000 - 500,
      price_change_percentage_24h: Math.random() * 10 - 5,
      high_24h: mockPrices[symbol] * 1.05,
      low_24h: mockPrices[symbol] * 0.95,
      last_updated: new Date().toISOString()
    };

    res.json(marketData);
  } catch (error) {
    console.error('Get market data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get historical price data
router.get('/history/:symbol', async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    const { days = 7 } = req.query;
    
    if (!mockPrices[symbol]) {
      return res.status(404).json({ message: 'Cryptocurrency not found' });
    }

    // Generate mock historical data
    const basePrice = mockPrices[symbol];
    const history = [];
    
    for (let i = parseInt(days); i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Generate random price variation
      const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
      const price = basePrice * (1 + variation);
      
      history.push({
        date: date.toISOString(),
        price: Math.round(price * 100) / 100
      });
    }

    res.json({
      symbol,
      days: parseInt(days),
      history
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to get crypto name
function getCryptoName(symbol) {
  const names = {
    'BTC': 'Bitcoin',
    'ETH': 'Ethereum',
    'LTC': 'Litecoin',
    'BCH': 'Bitcoin Cash'
  };
  return names[symbol] || symbol;
}

module.exports = router;
