import React, { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { FaDownload, FaCopy, FaQrcode, FaCheck } from 'react-icons/fa';
import QRCode from 'qrcode.react';
import styled from 'styled-components';

const ReceiveContainer = styled.div`
  padding: 30px 20px;
  max-width: 600px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  color: #333;
  font-size: 2.5rem;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 1.1rem;
`;

const ReceiveCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const WalletSelector = styled.div`
  margin-bottom: 30px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
`;

const Select = styled.select`
  width: 100%;
  padding: 15px 20px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const QRContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const AddressSection = styled.div`
  margin-bottom: 30px;
`;

const AddressLabel = styled.div`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 10px;
  text-align: center;
`;

const AddressContainer = styled.div`
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const AddressText = styled.div`
  flex: 1;
  font-family: monospace;
  font-size: 0.9rem;
  color: #333;
  word-break: break-all;
`;

const CopyButton = styled.button`
  background: ${props => props.copied ? '#00b894' : '#667eea'};
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 5px;
  
  &:hover {
    background: ${props => props.copied ? '#00a085' : '#5a6fd8'};
  }
`;

const Warning = styled.div`
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.3);
  color: #856404;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
  font-size: 0.9rem;
`;

const InfoSection = styled.div`
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
`;

const InfoTitle = styled.h3`
  color: #333;
  margin-bottom: 10px;
  font-size: 1.1rem;
`;

const InfoList = styled.ul`
  color: #666;
  font-size: 0.9rem;
  margin: 0;
  padding-left: 20px;
`;

const InfoItem = styled.li`
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 15px 24px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const Receive = () => {
  const { wallets, selectedWallet, setSelectedWallet, generateAddress } = useWallet();
  const [currentAddress, setCurrentAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (selectedWallet) {
      // Use existing address or generate new one
      setCurrentAddress(selectedWallet.address || '1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T');
    }
  }, [selectedWallet]);

  const handleWalletChange = (e) => {
    const walletId = e.target.value;
    const wallet = wallets.find(w => w._id === walletId);
    setSelectedWallet(wallet);
  };

  const handleCopyAddress = async () => {
    if (currentAddress) {
      try {
        await navigator.clipboard.writeText(currentAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy address:', err);
      }
    }
  };

  const handleGenerateNewAddress = async () => {
    if (!selectedWallet) return;
    
    setLoading(true);
    try {
      const newAddress = await generateAddress(selectedWallet._id);
      setCurrentAddress(newAddress);
    } catch (error) {
      console.error('Failed to generate address:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReceiveContainer>
      <Header>
        <Title>Receive Crypto</Title>
        <Subtitle>Share your address to receive cryptocurrency</Subtitle>
      </Header>

      <ReceiveCard>
        <WalletSelector>
          <Label htmlFor="wallet">Select Wallet</Label>
          <Select
            id="wallet"
            value={selectedWallet?._id || ''}
            onChange={handleWalletChange}
          >
            <option value="">Choose a wallet</option>
            {wallets.map(wallet => (
              <option key={wallet._id} value={wallet._id}>
                {wallet.name} ({wallet.currency})
              </option>
            ))}
          </Select>
        </WalletSelector>

        {selectedWallet && currentAddress && (
          <>
            <QRContainer>
              <QRCode
                value={currentAddress}
                size={200}
                level="M"
                includeMargin
                renderAs="svg"
              />
            </QRContainer>

            <AddressSection>
              <AddressLabel>Your {selectedWallet.currency} Address</AddressLabel>
              <AddressContainer>
                <AddressText>{currentAddress}</AddressText>
                <CopyButton copied={copied} onClick={handleCopyAddress}>
                  {copied ? <FaCheck /> : <FaCopy />}
                  {copied ? 'Copied!' : 'Copy'}
                </CopyButton>
              </AddressContainer>
            </AddressSection>

            <Warning>
              <strong>Important:</strong> Only send {selectedWallet.currency} to this address. 
              Sending other cryptocurrencies may result in permanent loss of funds.
            </Warning>

            <InfoSection>
              <InfoTitle>How to receive {selectedWallet.currency}</InfoTitle>
              <InfoList>
                <InfoItem>Share this address with the sender</InfoItem>
                <InfoItem>Or let them scan the QR code</InfoItem>
                <InfoItem>Transactions typically confirm within 10-60 minutes</InfoItem>
                <InfoItem>You'll receive a notification when funds arrive</InfoItem>
              </InfoList>
            </InfoSection>

            <Button onClick={handleGenerateNewAddress} disabled={loading}>
              <FaQrcode />
              {loading ? 'Generating...' : 'Generate New Address'}
            </Button>
          </>
        )}

        {!selectedWallet && (
          <div style={{ textAlign: 'center', color: '#666', padding: '40px 0' }}>
            <FaDownload style={{ fontSize: '3rem', marginBottom: '20px', opacity: 0.5 }} />
            <p>Select a wallet to view your receiving address</p>
          </div>
        )}
      </ReceiveCard>
    </ReceiveContainer>
  );
};

export default Receive;
