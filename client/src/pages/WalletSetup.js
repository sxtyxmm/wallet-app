import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { FaWallet, FaBitcoin, FaEthereum } from 'react-icons/fa';
import styled from 'styled-components';

const SetupContainer = styled.div`
  padding: 30px 20px;
  max-width: 800px;
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

const SetupCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  gap: 20px;
`;

const Step = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.active ? '#667eea' : '#ddd'};
  color: ${props => props.active ? 'white' : '#666'};
  font-weight: 600;
  transition: all 0.3s ease;
`;

const StepContent = styled.div`
  margin-bottom: 30px;
`;

const StepTitle = styled.h3`
  color: #333;
  margin-bottom: 20px;
  font-size: 1.3rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
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
  padding: 12px 16px;
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

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const CurrencyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
`;

const CurrencyCard = styled.div`
  border: 2px solid ${props => props.selected ? '#667eea' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 10px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.selected ? 'rgba(102, 126, 234, 0.1)' : 'rgba(255, 255, 255, 0.8)'};
  
  &:hover {
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.1);
  }
`;

const CurrencyIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 10px;
  color: ${props => props.color || '#667eea'};
`;

const CurrencyName = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
`;

const CurrencyCode = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
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

const currencies = [
  { code: 'BTC', name: 'Bitcoin', icon: <FaBitcoin />, color: '#f7931a' },
  { code: 'ETH', name: 'Ethereum', icon: <FaEthereum />, color: '#627eea' },
  { code: 'LTC', name: 'Litecoin', icon: <FaWallet />, color: '#bfbbbb' },
  { code: 'BCH', name: 'Bitcoin Cash', icon: <FaBitcoin />, color: '#8dc351' },
];

const WalletSetup = () => {
  const navigate = useNavigate();
  const { createWallet } = useWallet();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    currency: '',
    type: 'hot', // hot or cold
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCurrencySelect = (currency) => {
    setFormData({
      ...formData,
      currency: currency.code,
    });
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await createWallet(formData);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <StepContent>
            <StepTitle>Choose Your Cryptocurrency</StepTitle>
            <CurrencyGrid>
              {currencies.map((currency) => (
                <CurrencyCard
                  key={currency.code}
                  selected={formData.currency === currency.code}
                  onClick={() => handleCurrencySelect(currency)}
                >
                  <CurrencyIcon color={currency.color}>
                    {currency.icon}
                  </CurrencyIcon>
                  <CurrencyName>{currency.name}</CurrencyName>
                  <CurrencyCode>{currency.code}</CurrencyCode>
                </CurrencyCard>
              ))}
            </CurrencyGrid>
          </StepContent>
        );
      
      case 2:
        return (
          <StepContent>
            <StepTitle>Wallet Details</StepTitle>
            <Form>
              <InputGroup>
                <Label htmlFor="name">Wallet Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter wallet name"
                  required
                />
              </InputGroup>
              
              <InputGroup>
                <Label htmlFor="type">Wallet Type</Label>
                <Select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="hot">Hot Wallet (Online)</option>
                  <option value="cold">Cold Wallet (Offline)</option>
                </Select>
              </InputGroup>
            </Form>
          </StepContent>
        );
      
      case 3:
        return (
          <StepContent>
            <StepTitle>Review & Create</StepTitle>
            <div style={{ marginBottom: '20px' }}>
              <p><strong>Currency:</strong> {formData.currency}</p>
              <p><strong>Name:</strong> {formData.name}</p>
              <p><strong>Type:</strong> {formData.type === 'hot' ? 'Hot Wallet' : 'Cold Wallet'}</p>
            </div>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>
              Your wallet will be created with a unique address and private key. 
              Make sure to backup your recovery phrase securely.
            </p>
          </StepContent>
        );
      
      default:
        return null;
    }
  };

  return (
    <SetupContainer>
      <Header>
        <Title>Create Your First Wallet</Title>
        <Subtitle>Set up your cryptocurrency wallet in just a few steps</Subtitle>
      </Header>

      <SetupCard>
        <StepIndicator>
          {[1, 2, 3].map((num) => (
            <Step key={num} active={num <= step}>
              {num}
            </Step>
          ))}
        </StepIndicator>

        {renderStep()}

        <ButtonGroup>
          {step > 1 && (
            <SecondaryButton type="button" onClick={handleBack}>
              Back
            </SecondaryButton>
          )}
          
          {step < 3 ? (
            <PrimaryButton 
              type="button" 
              onClick={handleNext}
              disabled={
                (step === 1 && !formData.currency) ||
                (step === 2 && (!formData.name || !formData.type))
              }
            >
              Next
            </PrimaryButton>
          ) : (
            <PrimaryButton onClick={handleSubmit} disabled={loading}>
              {loading ? 'Creating...' : 'Create Wallet'}
            </PrimaryButton>
          )}
        </ButtonGroup>
      </SetupCard>
    </SetupContainer>
  );
};

export default WalletSetup;
