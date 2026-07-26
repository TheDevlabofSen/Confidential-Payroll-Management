import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Wallet,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  DollarSign,
  UserCheck,
  Award,
  History,
  Lock,
  Info,
  Home
} from 'lucide-react';
import { usePayroll } from '../context/PayrollContext';

export const Header: React.FC = () => {
  const {
    walletConnected,
    walletAddress,
    networkId,
    isConnecting,
    handleConnectWallet,
    handleDisconnectWallet
  } = usePayroll();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/payroll', label: 'Payroll', icon: DollarSign },
    { to: '/verify', label: 'Verify', icon: UserCheck },
    { to: '/credentials', label: 'Credentials', icon: Award },
    { to: '/history', label: 'History', icon: History },
    { to: '/privacy', label: 'Privacy', icon: Lock },
    { to: '/about', label: 'About', icon: Info },
  ];

  return (
    <header className="navbar">
      <div className="container nav-content">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
          <div className="brand-icon">
            <ShieldCheck size={22} />
          </div>
          <div>
            <span className="gradient-text" style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              Confidential Payroll
            </span>
            <span style={{ fontSize: '0.7rem', display: 'block', color: 'var(--text-muted)', fontWeight: 600 }}>
              Midnight Network ZK Platform
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }: { isActive: boolean }) => `nav-item ${isActive ? 'active' : ''}`}
                end={link.to === '/'}
              >
                <Icon size={16} />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Right Section: Status Pill & Wallet */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="status-pill desktop-only">
            <span className="pulse-dot"></span>
            <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>
              Network: {networkId}
            </span>
          </div>

          {walletConnected ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className="status-pill wallet-pill">
                <Wallet size={15} color="#4f46e5" />
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                  {walletAddress.slice(0, 8)}...{walletAddress.slice(-4)}
                </span>
              </div>
              <button
                onClick={handleDisconnectWallet}
                className="btn btn-secondary icon-only-btn"
                title="Disconnect Wallet"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleConnectWallet}
              disabled={isConnecting}
              className="btn btn-primary"
            >
              {isConnecting ? (
                <>
                  <div className="spinner"></div> Connecting...
                </>
              ) : (
                <>
                  <Wallet size={16} /> Connect Lace Wallet
                </>
              )}
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Out Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div className="brand-logo">
                <div className="brand-icon">
                  <ShieldCheck size={20} />
                </div>
                <span className="gradient-text" style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                  Confidential Payroll
                </span>
              </div>
              <button className="icon-only-btn" onClick={() => setMobileMenuOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="drawer-network-status">
              <span className="pulse-dot"></span>
              <span>Midnight Network: {networkId}</span>
            </div>

            <nav className="mobile-nav-list">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }: { isActive: boolean }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
                    end={link.to === '/'}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon size={18} />
                    <span>{link.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};
