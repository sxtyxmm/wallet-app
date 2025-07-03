import React, { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { FaHistory, FaArrowUp, FaArrowDown, FaSearch, FaFilter, FaExternalLinkAlt } from 'react-icons/fa';
import styled from 'styled-components';

const HistoryContainer = styled.div`
  padding: 30px 20px;
  max-width: 1000px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const Title = styled.h1`
  color: #333;
  font-size: 2.5rem;
  margin: 0;
`;

const Controls = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  min-width: 300px;
  
  @media (max-width: 768px) {
    min-width: 100%;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 45px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
`;

const FilterButton = styled.button`
  padding: 12px 20px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.8);
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.1);
  }
`;

const StatsBar = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatLabel = styled.div`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 5px;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
`;

const TransactionsList = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const TransactionItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: rgba(102, 126, 234, 0.05);
    border-radius: 10px;
    margin: 0 -15px;
    padding: 20px 15px;
  }
`;

const TransactionLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const TransactionIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.3rem;
  background: ${props => props.type === 'sent' ? '#ff6b6b' : '#00b894'};
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
`;

const TransactionDetails = styled.div``;

const TransactionType = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
  font-size: 1.1rem;
`;

const TransactionAddress = styled.div`
  color: #666;
  font-size: 0.9rem;
  font-family: monospace;
  margin-bottom: 5px;
`;

const TransactionDate = styled.div`
  color: #999;
  font-size: 0.85rem;
`;

const TransactionRight = styled.div`
  text-align: right;
`;

const TransactionAmount = styled.div`
  font-size: 1.3rem;
  font-weight: 700;
  color: ${props => props.type === 'sent' ? '#ff6b6b' : '#00b894'};
  margin-bottom: 5px;
`;

const TransactionStatus = styled.div`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${props => {
    switch (props.status) {
      case 'confirmed': return '#e8f5e8';
      case 'pending': return '#fff3cd';
      case 'failed': return '#f8d7da';
      default: return '#e9ecef';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'confirmed': return '#2e7d32';
      case 'pending': return '#856404';
      case 'failed': return '#721c24';
      default: return '#495057';
    }
  }};
`;

const TransactionHash = styled.button`
  background: none;
  border: none;
  color: #667eea;
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 5px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.5;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const History = () => {
  const { transactions, fetchTransactions, selectedWallet } = useWallet();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedWallet) {
      setLoading(true);
      fetchTransactions(selectedWallet._id).finally(() => setLoading(false));
    }
  }, [selectedWallet, fetchTransactions]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = transactions.filter(tx => 
        tx.hash?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.toAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.fromAddress?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTransactions(filtered);
    } else {
      setFilteredTransactions(transactions);
    }
  }, [transactions, searchTerm]);

  const handleViewTransaction = (hash) => {
    // Open blockchain explorer
    window.open(`https://blockchair.com/bitcoin/transaction/${hash}`, '_blank');
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Mock statistics
  const stats = {
    totalTransactions: transactions.length,
    totalSent: transactions.filter(tx => tx.type === 'sent').length,
    totalReceived: transactions.filter(tx => tx.type === 'received').length,
    totalVolume: transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0)
  };

  return (
    <HistoryContainer>
      <Header>
        <Title>Transaction History</Title>
        <Controls>
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchIcon>
              <FaSearch />
            </SearchIcon>
          </SearchContainer>
          <FilterButton>
            <FaFilter />
            Filter
          </FilterButton>
        </Controls>
      </Header>

      <StatsBar>
        <StatItem>
          <StatLabel>Total Transactions</StatLabel>
          <StatValue>{stats.totalTransactions}</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>Sent</StatLabel>
          <StatValue>{stats.totalSent}</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>Received</StatLabel>
          <StatValue>{stats.totalReceived}</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>Total Volume</StatLabel>
          <StatValue>{stats.totalVolume.toFixed(8)} BTC</StatValue>
        </StatItem>
      </StatsBar>

      <TransactionsList>
        {loading ? (
          <LoadingSpinner>
            <div className="spinner"></div>
          </LoadingSpinner>
        ) : filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction, index) => (
            <TransactionItem key={index}>
              <TransactionLeft>
                <TransactionIcon type={transaction.type}>
                  {transaction.type === 'sent' ? <FaArrowUp /> : <FaArrowDown />}
                </TransactionIcon>
                <TransactionDetails>
                  <TransactionType>
                    {transaction.type === 'sent' ? 'Sent' : 'Received'} {transaction.currency}
                  </TransactionType>
                  <TransactionAddress>
                    {transaction.type === 'sent' ? 'To: ' : 'From: '}
                    {formatAddress(transaction.type === 'sent' ? transaction.toAddress : transaction.fromAddress)}
                  </TransactionAddress>
                  <TransactionDate>
                    {formatDate(transaction.date)}
                  </TransactionDate>
                  {transaction.hash && (
                    <TransactionHash onClick={() => handleViewTransaction(transaction.hash)}>
                      <FaExternalLinkAlt />
                      View on Explorer
                    </TransactionHash>
                  )}
                </TransactionDetails>
              </TransactionLeft>
              <TransactionRight>
                <TransactionAmount type={transaction.type}>
                  {transaction.type === 'sent' ? '-' : '+'}
                  {transaction.amount} {transaction.currency}
                </TransactionAmount>
                <TransactionStatus status={transaction.status || 'confirmed'}>
                  {transaction.status || 'Confirmed'}
                </TransactionStatus>
              </TransactionRight>
            </TransactionItem>
          ))
        ) : (
          <EmptyState>
            <EmptyIcon>
              <FaHistory />
            </EmptyIcon>
            <h3>No transactions yet</h3>
            <p>Your transaction history will appear here once you start sending and receiving crypto.</p>
          </EmptyState>
        )}
      </TransactionsList>
    </HistoryContainer>
  );
};

export default History;
