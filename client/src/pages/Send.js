import React, { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { FaPaperPlane, FaQrcode, FaExchangeAlt } from 'react-icons/fa';
import styled from 'styled-components';

const SendContainer = styled.div`
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

const SendCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const InputGroup = styled.div``;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px 20px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
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

const AmountInput = styled.div`
  position: relative;
`;

const CurrencyLabel = styled.span`
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  font-weight: 500;
  pointer-events: none;
`;

const BalanceInfo = styled.div`
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
`;

const BalanceLabel = styled.div`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 5px;
`;

const BalanceAmount = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
`;

const TransactionPreview = styled.div`
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
`;

const PreviewTitle = styled.h3`
  color: #333;
  margin-bottom: 15px;
  font-size: 1.1rem;
`;

const PreviewItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  
  &:last-child {
    margin-bottom: 0;
    padding-top: 10px;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    font-weight: 600;
  }
`;

const PreviewLabel = styled.span`
  color: #666;
`;

const PreviewValue = styled.span`
  color: #333;
  font-weight: 500;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 30px;
`;

const Button = styled.button`
  flex: 1;
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

const PrimaryButton = styled(Button)`
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
`;

const SecondaryButton = styled(Button)`
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  border: 1px solid rgba(0, 0, 0, 0.1);
`;

const MaxButton = styled.button`
  background: #667eea;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 0.8rem;
  cursor: pointer;
  margin-left: 10px;
  
  &:hover {
    background: #5a6fd8;
  }
`;

const Send = () => {
  const { wallets, selectedWallet, sendTransaction } = useWallet();
  const [formData, setFormData] = useState({
    toAddress: '',
    amount: '',
    walletId: selectedWallet?._id || '',
    note: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleMaxAmount = () => {
    const wallet = wallets.find(w => w._id === formData.walletId);
    if (wallet) {
      setFormData({
        ...formData,
        amount: (wallet.balance * 0.95).toString(), // Leave some for fees
      });
    }
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await sendTransaction(formData);
    
    if (result.success) {
      setFormData({
        toAddress: '',
        amount: '',
        walletId: selectedWallet?._id || '',
        note: '',
      });
      setShowPreview(false);
    }
    
    setLoading(false);
  };

  const selectedWalletData = wallets.find(w => w._id === formData.walletId);
  const networkFee = 0.001; // Mock network fee

  return (
    <SendContainer>
      <Header>
        <Title>Send Crypto</Title>
        <Subtitle>Send cryptocurrency to any address</Subtitle>
      </Header>

      <SendCard>
        {selectedWalletData && (
          <BalanceInfo>
            <BalanceLabel>Available Balance</BalanceLabel>
            <BalanceAmount>
              {selectedWalletData.balance} {selectedWalletData.currency}
            </BalanceAmount>
          </BalanceInfo>
        )}

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="walletId">From Wallet</Label>
            <Select
              id="walletId"
              name="walletId"
              value={formData.walletId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a wallet</option>
              {wallets.map(wallet => (
                <option key={wallet._id} value={wallet._id}>
                  {wallet.name} ({wallet.currency}) - {wallet.balance} {wallet.currency}
                </option>
              ))}
            </Select>
          </InputGroup>

          <InputGroup>
            <Label htmlFor="toAddress">Recipient Address</Label>
            <Input
              type="text"
              id="toAddress"
              name="toAddress"
              value={formData.toAddress}
              onChange={handleInputChange}
              placeholder="Enter recipient address"
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="amount">
              Amount
              <MaxButton type="button" onClick={handleMaxAmount}>
                MAX
              </MaxButton>
            </Label>
            <AmountInput>
              <Input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.00000001"
                min="0"
                required
              />
              <CurrencyLabel>
                {selectedWalletData?.currency || 'BTC'}
              </CurrencyLabel>
            </AmountInput>
          </InputGroup>

          <InputGroup>
            <Label htmlFor="note">Note (Optional)</Label>
            <Input
              type="text"
              id="note"
              name="note"
              value={formData.note}
              onChange={handleInputChange}
              placeholder="Add a note"
            />
          </InputGroup>

          {showPreview && (
            <TransactionPreview>
              <PreviewTitle>Transaction Preview</PreviewTitle>
              <PreviewItem>
                <PreviewLabel>To:</PreviewLabel>
                <PreviewValue>{formData.toAddress.slice(0, 10)}...{formData.toAddress.slice(-10)}</PreviewValue>
              </PreviewItem>
              <PreviewItem>
                <PreviewLabel>Amount:</PreviewLabel>
                <PreviewValue>{formData.amount} {selectedWalletData?.currency}</PreviewValue>
              </PreviewItem>
              <PreviewItem>
                <PreviewLabel>Network Fee:</PreviewLabel>
                <PreviewValue>{networkFee} {selectedWalletData?.currency}</PreviewValue>
              </PreviewItem>
              <PreviewItem>
                <PreviewLabel>Total:</PreviewLabel>
                <PreviewValue>{(parseFloat(formData.amount) + networkFee).toFixed(8)} {selectedWalletData?.currency}</PreviewValue>
              </PreviewItem>
            </TransactionPreview>
          )}

          <ButtonGroup>
            {!showPreview ? (
              <>
                <SecondaryButton type="button">
                  <FaQrcode />
                  Scan QR
                </SecondaryButton>
                <PrimaryButton type="button" onClick={handlePreview}>
                  <FaExchangeAlt />
                  Preview
                </PrimaryButton>
              </>
            ) : (
              <>
                <SecondaryButton type="button" onClick={() => setShowPreview(false)}>
                  Back
                </SecondaryButton>
                <PrimaryButton type="submit" disabled={loading}>
                  <FaPaperPlane />
                  {loading ? 'Sending...' : 'Send Now'}
                </PrimaryButton>
              </>
            )}
          </ButtonGroup>
        </Form>
      </SendCard>
    </SendContainer>
  );
};

export default Send;
