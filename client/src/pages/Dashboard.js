import React, { useEffect, useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { FaWallet, FaArrowUp, FaArrowDown, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import styled from 'styled-components';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashboardContainer = styled.div`
  padding: 30px 20px;
  max-width: 1200px;
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
    text-align: center;
  }
`;

const PageTitle = styled.h1`
  color: #333;
  font-size: 2.5rem;
  margin: 0;
`;

const WalletSelector = styled.select`
  padding: 12px 16px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 30px 50px rgba(0, 0, 0, 0.15);
  }
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const StatTitle = styled.h3`
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
  margin: 0;
`;

const StatIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  background: ${props => props.color || '#667eea'};
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
`;

const StatChange = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  color: ${props => props.positive ? '#00b894' : '#ff6b6b'};
  font-size: 0.9rem;
  font-weight: 500;
`;

const BalanceCard = styled(StatCard)`
  grid-column: span 2;
  
  @media (max-width: 768px) {
    grid-column: span 1;
  }
`;

const BalanceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const BalanceTitle = styled.h2`
  color: #333;
  margin: 0;
`;

const BalanceToggle = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    color: #333;
    background: rgba(0, 0, 0, 0.05);
  }
`;

const BalanceAmount = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
`;

const BalanceUSD = styled.div`
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 20px;
`;

const QuickActions = styled.div`
  display: flex;
  gap: 15px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }
`;

const SendButton = styled(ActionButton)`
  background: linear-gradient(45deg, #ff6b6b, #ee5a24);
  color: white;
`;

const ReceiveButton = styled(ActionButton)`
  background: linear-gradient(45deg, #00b894, #00a085);
  color: white;
`;

const ChartContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 30px;
`;

const ChartTitle = styled.h3`
  color: #333;
  margin-bottom: 20px;
  font-size: 1.2rem;
`;

const RecentTransactions = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const TransactionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  
  &:last-child {
    border-bottom: none;
  }
`;

const TransactionDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const TransactionIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background: ${props => props.type === 'sent' ? '#ff6b6b' : '#00b894'};
`;

const TransactionInfo = styled.div``;

const TransactionType = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
`;

const TransactionDate = styled.div`
  font-size: 0.85rem;
  color: #666;
`;

const TransactionAmount = styled.div`
  font-weight: 600;
  color: ${props => props.type === 'sent' ? '#ff6b6b' : '#00b894'};
`;

const Dashboard = () => {
  const { wallets, selectedWallet, setSelectedWallet, fetchWallets, transactions, fetchTransactions } = useWallet();
  const [showBalance, setShowBalance] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      await fetchWallets();
      setLoading(false);
    };
    loadData();
  }, [fetchWallets]);

  useEffect(() => {
    if (selectedWallet) {
      fetchTransactions(selectedWallet._id);
    }
  }, [selectedWallet, fetchTransactions]);

  const handleWalletChange = (e) => {
    const walletId = e.target.value;
    const wallet = wallets.find(w => w._id === walletId);
    setSelectedWallet(wallet);
  };

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Portfolio Value',
        data: [12000, 15000, 13000, 18000, 16000, 20000],
        fill: false,
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          },
        },
      },
    },
  };

  if (loading) {
    return (
      <DashboardContainer>
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Header>
        <PageTitle>Dashboard</PageTitle>
        {wallets.length > 0 && (
          <WalletSelector value={selectedWallet?._id || ''} onChange={handleWalletChange}>
            {wallets.map(wallet => (
              <option key={wallet._id} value={wallet._id}>
                {wallet.name} ({wallet.currency})
              </option>
            ))}
          </WalletSelector>
        )}
      </Header>

      <StatsGrid>
        <BalanceCard>
          <BalanceHeader>
            <BalanceTitle>Total Balance</BalanceTitle>
            <BalanceToggle onClick={() => setShowBalance(!showBalance)}>
              {showBalance ? <FaEyeSlash /> : <FaEye />}
            </BalanceToggle>
          </BalanceHeader>
          <BalanceAmount>
            {showBalance ? `${selectedWallet?.balance || 0} ${selectedWallet?.currency || 'BTC'}` : '••••••••'}
          </BalanceAmount>
          <BalanceUSD>
            {showBalance ? `≈ $${((selectedWallet?.balance || 0) * 45000).toLocaleString()}` : '••••••••'}
          </BalanceUSD>
          <QuickActions>
            <SendButton>
              <FaArrowUp />
              Send
            </SendButton>
            <ReceiveButton>
              <FaArrowDown />
              Receive
            </ReceiveButton>
          </QuickActions>
        </BalanceCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Active Wallets</StatTitle>
            <StatIcon color="#667eea">
              <FaWallet />
            </StatIcon>
          </StatHeader>
          <StatValue>{wallets.length}</StatValue>
          <StatChange positive>
            <FaArrowUp />
            +1 this month
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Total Transactions</StatTitle>
            <StatIcon color="#00b894">
              <FaArrowUp />
            </StatIcon>
          </StatHeader>
          <StatValue>{transactions.length}</StatValue>
          <StatChange positive>
            <FaArrowUp />
            +12 this week
          </StatChange>
        </StatCard>
      </StatsGrid>

      <ChartContainer>
        <ChartTitle>Portfolio Performance</ChartTitle>
        <Line data={chartData} options={chartOptions} />
      </ChartContainer>

      <RecentTransactions>
        <ChartTitle>Recent Transactions</ChartTitle>
        {transactions.length > 0 ? (
          transactions.slice(0, 5).map((transaction, index) => (
            <TransactionItem key={index}>
              <TransactionDetails>
                <TransactionIcon type={transaction.type}>
                  {transaction.type === 'sent' ? <FaArrowUp /> : <FaArrowDown />}
                </TransactionIcon>
                <TransactionInfo>
                  <TransactionType>
                    {transaction.type === 'sent' ? 'Sent' : 'Received'} {transaction.currency}
                  </TransactionType>
                  <TransactionDate>
                    {new Date(transaction.date).toLocaleDateString()}
                  </TransactionDate>
                </TransactionInfo>
              </TransactionDetails>
              <TransactionAmount type={transaction.type}>
                {transaction.type === 'sent' ? '-' : '+'}
                {transaction.amount} {transaction.currency}
              </TransactionAmount>
            </TransactionItem>
          ))
        ) : (
          <p style={{ color: '#666', textAlign: 'center' }}>No transactions yet</p>
        )}
      </RecentTransactions>
    </DashboardContainer>
  );
};

export default Dashboard;
