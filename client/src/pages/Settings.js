import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useWallet } from '../contexts/WalletContext';
import { FaCog, FaUser, FaShieldAlt, FaDownload, FaTrash, FaPlus } from 'react-icons/fa';
import styled from 'styled-components';

const SettingsContainer = styled.div`
  padding: 30px 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 40px;
`;

const Title = styled.h1`
  color: #333;
  font-size: 2.5rem;
  margin: 0;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 1.1rem;
  margin-top: 10px;
`;

const SettingsGrid = styled.div`
  display: grid;
  gap: 30px;
`;

const SettingsCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
`;

const CardIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(45deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.3rem;
`;

const CardTitle = styled.h2`
  color: #333;
  margin: 0;
  font-size: 1.3rem;
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
`;

const Input = styled.input`
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

const Toggle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const ToggleLabel = styled.div`
  flex: 1;
`;

const ToggleTitle = styled.div`
  font-weight: 500;
  color: #333;
  margin-bottom: 5px;
`;

const ToggleDescription = styled.div`
  font-size: 0.85rem;
  color: #666;
`;

const ToggleSwitch = styled.button`
  width: 50px;
  height: 28px;
  border-radius: 14px;
  border: none;
  background: ${props => props.active ? '#667eea' : '#ddd'};
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &::after {
    content: '';
    position: absolute;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: white;
    top: 3px;
    left: ${props => props.active ? '25px' : '3px'};
    transition: all 0.3s ease;
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
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

const DangerButton = styled(Button)`
  background: linear-gradient(45deg, #ff6b6b, #ee5a24);
  color: white;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const WalletList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const WalletItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.5);
`;

const WalletInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const WalletIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #667eea;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const WalletDetails = styled.div``;

const WalletName = styled.div`
  font-weight: 600;
  color: #333;
`;

const WalletBalance = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const WalletActions = styled.div`
  display: flex;
  gap: 10px;
`;

const SmallButton = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
  }
`;

const Settings = () => {
  const { user, logout } = useAuth();
  const { wallets } = useWallet();
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
  });
  
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    biometricEnabled: false,
    notificationsEnabled: true,
    autoLockEnabled: true,
    autoLockTime: '5',
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [loading, setLoading] = useState(false);

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSecurityToggle = (setting) => {
    setSecuritySettings({
      ...securitySettings,
      [setting]: !securitySettings[setting],
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert('Profile updated successfully!');
    }, 1000);
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      alert('Password changed successfully!');
    }, 1000);
  };

  const handleExportWallet = (walletId) => {
    // Simulate wallet export
    alert('Wallet backup file downloaded!');
  };

  const handleDeleteWallet = (walletId) => {
    if (window.confirm('Are you sure you want to delete this wallet? This action cannot be undone.')) {
      alert('Wallet deleted successfully!');
    }
  };

  return (
    <SettingsContainer>
      <Header>
        <Title>Settings</Title>
        <Subtitle>Manage your account and wallet preferences</Subtitle>
      </Header>

      <SettingsGrid>
        {/* Profile Settings */}
        <SettingsCard>
          <CardHeader>
            <CardIcon>
              <FaUser />
            </CardIcon>
            <CardTitle>Profile Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <FormGroup>
              <Label htmlFor="name">Full Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                placeholder="Enter your full name"
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="email">Email Address</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={profileData.email}
                onChange={handleProfileChange}
                placeholder="Enter your email"
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                value={profileData.phone}
                onChange={handleProfileChange}
                placeholder="Enter your phone number"
              />
            </FormGroup>
            <ButtonGroup>
              <PrimaryButton onClick={handleSaveProfile} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </PrimaryButton>
            </ButtonGroup>
          </CardContent>
        </SettingsCard>

        {/* Security Settings */}
        <SettingsCard>
          <CardHeader>
            <CardIcon>
              <FaShieldAlt />
            </CardIcon>
            <CardTitle>Security Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <Toggle>
              <ToggleLabel>
                <ToggleTitle>Two-Factor Authentication</ToggleTitle>
                <ToggleDescription>Add an extra layer of security to your account</ToggleDescription>
              </ToggleLabel>
              <ToggleSwitch
                active={securitySettings.twoFactorEnabled}
                onClick={() => handleSecurityToggle('twoFactorEnabled')}
              />
            </Toggle>
            
            <Toggle>
              <ToggleLabel>
                <ToggleTitle>Biometric Authentication</ToggleTitle>
                <ToggleDescription>Use fingerprint or face recognition</ToggleDescription>
              </ToggleLabel>
              <ToggleSwitch
                active={securitySettings.biometricEnabled}
                onClick={() => handleSecurityToggle('biometricEnabled')}
              />
            </Toggle>
            
            <Toggle>
              <ToggleLabel>
                <ToggleTitle>Push Notifications</ToggleTitle>
                <ToggleDescription>Receive notifications for transactions</ToggleDescription>
              </ToggleLabel>
              <ToggleSwitch
                active={securitySettings.notificationsEnabled}
                onClick={() => handleSecurityToggle('notificationsEnabled')}
              />
            </Toggle>
            
            <Toggle>
              <ToggleLabel>
                <ToggleTitle>Auto-Lock</ToggleTitle>
                <ToggleDescription>Automatically lock the app after inactivity</ToggleDescription>
              </ToggleLabel>
              <ToggleSwitch
                active={securitySettings.autoLockEnabled}
                onClick={() => handleSecurityToggle('autoLockEnabled')}
              />
            </Toggle>
            
            {securitySettings.autoLockEnabled && (
              <FormGroup>
                <Label htmlFor="autoLockTime">Auto-Lock Time</Label>
                <Select
                  id="autoLockTime"
                  value={securitySettings.autoLockTime}
                  onChange={(e) => setSecuritySettings({
                    ...securitySettings,
                    autoLockTime: e.target.value
                  })}
                >
                  <option value="1">1 minute</option>
                  <option value="5">5 minutes</option>
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                </Select>
              </FormGroup>
            )}
          </CardContent>
        </SettingsCard>

        {/* Change Password */}
        <SettingsCard>
          <CardHeader>
            <CardIcon>
              <FaShieldAlt />
            </CardIcon>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent>
            <FormGroup>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Enter current password"
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter new password"
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
              />
            </FormGroup>
            <ButtonGroup>
              <PrimaryButton onClick={handleChangePassword} disabled={loading}>
                {loading ? 'Changing...' : 'Change Password'}
              </PrimaryButton>
            </ButtonGroup>
          </CardContent>
        </SettingsCard>

        {/* Wallet Management */}
        <SettingsCard>
          <CardHeader>
            <CardIcon>
              <FaCog />
            </CardIcon>
            <CardTitle>Wallet Management</CardTitle>
          </CardHeader>
          <CardContent>
            <WalletList>
              {wallets.map((wallet) => (
                <WalletItem key={wallet._id}>
                  <WalletInfo>
                    <WalletIcon>
                      {wallet.currency}
                    </WalletIcon>
                    <WalletDetails>
                      <WalletName>{wallet.name}</WalletName>
                      <WalletBalance>
                        {wallet.balance} {wallet.currency}
                      </WalletBalance>
                    </WalletDetails>
                  </WalletInfo>
                  <WalletActions>
                    <SmallButton
                      onClick={() => handleExportWallet(wallet._id)}
                      style={{ background: '#667eea', color: 'white' }}
                    >
                      <FaDownload />
                    </SmallButton>
                    <SmallButton
                      onClick={() => handleDeleteWallet(wallet._id)}
                      style={{ background: '#ff6b6b', color: 'white' }}
                    >
                      <FaTrash />
                    </SmallButton>
                  </WalletActions>
                </WalletItem>
              ))}
            </WalletList>
            <ButtonGroup>
              <SecondaryButton>
                <FaPlus />
                Add New Wallet
              </SecondaryButton>
            </ButtonGroup>
          </CardContent>
        </SettingsCard>

        {/* Account Actions */}
        <SettingsCard>
          <CardHeader>
            <CardIcon>
              <FaShieldAlt />
            </CardIcon>
            <CardTitle>Account Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <ButtonGroup>
              <SecondaryButton>
                <FaDownload />
                Export All Data
              </SecondaryButton>
              <DangerButton onClick={logout}>
                Sign Out
              </DangerButton>
            </ButtonGroup>
          </CardContent>
        </SettingsCard>
      </SettingsGrid>
    </SettingsContainer>
  );
};

export default Settings;
