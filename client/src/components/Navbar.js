import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaWallet, FaHome, FaPaperPlane, FaDownload, FaHistory, FaCog, FaSignOutAlt } from 'react-icons/fa';
import styled from 'styled-components';

const NavbarContainer = styled.nav`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
`;

const NavbarContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 30px;
  align-items: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: ${props => props.active ? '#667eea' : '#666'};
  font-weight: ${props => props.active ? '600' : '500'};
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    color: #667eea;
    background: rgba(102, 126, 234, 0.1);
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const UserInfo = styled.div`
  text-align: right;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const UserName = styled.div`
  font-weight: 600;
  color: #333;
`;

const UserEmail = styled.div`
  font-size: 0.85rem;
  color: #666;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #666;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    color: #ff6b6b;
    background: rgba(255, 107, 107, 0.1);
  }
`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <NavbarContainer>
      <NavbarContent>
        <Logo>
          <FaWallet />
          CryptoWallet
        </Logo>
        
        <NavLinks>
          <NavLink to="/dashboard" active={isActive('/dashboard')}>
            <FaHome />
            Dashboard
          </NavLink>
          <NavLink to="/send" active={isActive('/send')}>
            <FaPaperPlane />
            Send
          </NavLink>
          <NavLink to="/receive" active={isActive('/receive')}>
            <FaDownload />
            Receive
          </NavLink>
          <NavLink to="/history" active={isActive('/history')}>
            <FaHistory />
            History
          </NavLink>
          <NavLink to="/settings" active={isActive('/settings')}>
            <FaCog />
            Settings
          </NavLink>
        </NavLinks>
        
        <UserSection>
          <UserInfo>
            <UserName>{user?.name}</UserName>
            <UserEmail>{user?.email}</UserEmail>
          </UserInfo>
          <LogoutButton onClick={logout} title="Logout">
            <FaSignOutAlt />
          </LogoutButton>
        </UserSection>
      </NavbarContent>
    </NavbarContainer>
  );
};

export default Navbar;
