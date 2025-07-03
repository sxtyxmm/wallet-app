import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [wallets, setWallets] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cryptoPrices, setCryptoPrices] = useState({});

  const fetchWallets = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/wallets');
      setWallets(response.data);
      if (response.data.length > 0 && !selectedWallet) {
        setSelectedWallet(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching wallets:', error);
    } finally {
      setLoading(false);
    }
  };

  const createWallet = async (walletData) => {
    try {
      const response = await axios.post('/api/wallets', walletData);
      const newWallet = response.data;
      setWallets(prev => [...prev, newWallet]);
      
      if (!selectedWallet) {
        setSelectedWallet(newWallet);
      }
      
      toast.success('Wallet created successfully!');
      return { success: true, wallet: newWallet };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create wallet';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const fetchTransactions = async (walletId) => {
    try {
      const response = await axios.get(`/api/wallets/${walletId}/transactions`);
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const sendTransaction = async (transactionData) => {
    try {
      const response = await axios.post('/api/transactions/send', transactionData);
      const transaction = response.data;
      
      setTransactions(prev => [transaction, ...prev]);
      
      // Update wallet balance
      setWallets(prev => prev.map(wallet => 
        wallet._id === transactionData.walletId 
          ? { ...wallet, balance: wallet.balance - transactionData.amount }
          : wallet
      ));
      
      toast.success('Transaction sent successfully!');
      return { success: true, transaction };
    } catch (error) {
      const message = error.response?.data?.message || 'Transaction failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const fetchCryptoPrices = async () => {
    try {
      const response = await axios.get('/api/crypto/prices');
      setCryptoPrices(response.data);
    } catch (error) {
      console.error('Error fetching crypto prices:', error);
    }
  };

  const generateAddress = async (walletId) => {
    try {
      const response = await axios.post(`/api/wallets/${walletId}/address`);
      return response.data.address;
    } catch (error) {
      console.error('Error generating address:', error);
      throw error;
    }
  };

  const value = {
    wallets,
    selectedWallet,
    setSelectedWallet,
    transactions,
    loading,
    cryptoPrices,
    fetchWallets,
    createWallet,
    fetchTransactions,
    sendTransaction,
    fetchCryptoPrices,
    generateAddress,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
