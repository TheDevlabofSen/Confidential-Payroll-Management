import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ShieldCheck, Wallet, LogOut, Menu, X, LayoutDashboard, DollarSign, UserCheck, Award, History, Lock, Info, Home, Copy, CheckCircle2, AlertCircle, WifiOff, Loader2 } from 'lucide-react';
import { usePayroll } from '../context/PayrollContext';

export const Header: React.FC = () => {
  const { walletConnected, walletAddress, walletError, walletStatus, isConnecting, networkId, handleConnectWallet, handleDisconnectWallet } = usePayroll();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const handleCopyAddress = async () => {
    if (!walletAddress) return;
    try { await navigator.clipboard.writeText(walletAddress); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* ignore */ }
  };

  const renderWalletSection = () => {
    if (walletStatus === 'not_found') {
      return (
        <div className="status-pill" style={{ background: 'rgba(239,68,68,0.08)', borderColor: '#ef4444', color: '#ef4444' }} title="Lace wallet extension not found">
          <WifiOff size={14} />
          <span style={{ fontWeight: 600, fontSize: '0.8rem' }}>Wallet Not Found</span>
        </div>
      );
    }
    if (walletStatus === 'connecting' || isConnecting) {
      return (
        <button className="btn btn-primary" disabled>
          <Loader2 size={15} className="spin-icon" />
          <span>Connecting...</span>
        </button>
      );
    }
    if (walletStatus === 'connected' && walletConnected && walletAddress) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div className="status-pill wallet-pill" title={walletAddress} style={{ background: 'rgba(5,150,105,0.08)', borderColor: '#059669', color: '#065f46', maxWidth: '200px' }}>
            <CheckCircle2 size={13} color="#059669" />
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '0.78rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {walletAddress.length > 20 ? `${walletAddress.slice(0, 10)}...${walletAddress.slice(-6)}` : walletAddress}
            </span>
            <button onClick={handleCopyAddress} title="Copy full address" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', display: 'flex', alignItems: 'center', color: copied ? '#059669' : '#94a3b8' }}>
              {copied ? <CheckCircle2 size={12} color="#059669" /> : <Copy size={12} />}
            </button>
          </div>
          <button onClick={handleDisconnectWallet} className="btn btn-secondary icon-only-btn" title="Disconnect Wallet"><LogOut size={16} /></button>
        </div>
      );
    }
    if (walletStatus === 'failed') {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div className="status-pill" style={{ background: 'rgba(239,68,68,0.08)', borderColor: '#ef4444', color: '#b91c1c', maxWidth: '220px' }} title={walletError ?? 'Connection failed'}>
            <AlertCircle size={13} color="#ef4444" />
            <span style={{ fontWeight: 600, fontSize: '0.78rem' }}>Failed To Connect</span>
          </div>
          <button onClick={handleConnectWallet} className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>Retry</button>
        </div>
      );
    }
    return (
      <button onClick={handleConnectWallet} disabled={isConnecting} className="btn btn-primary">
        <Wallet size={16} /> Connect Lace Wallet
      </button>
    );
  };

  return (
    <header className="navbar">
      <div className="container nav-content">
        <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
          <div className="brand-icon"><ShieldCheck size={22} /></div>
          <div>
            <span className="gradient-text" style={{ fontSize: '1.25rem', fontWeight: 800 }}>Confidential Payroll</span>
            <span style={{ fontSize: '0.7rem', display: 'block', color: 'var(--text-muted)', fontWeight: 600 }}>Midnight Network ZK Platform</span>
          </div>
        </Link>
        <nav className="desktop-nav">
          {navLinks.map((link) => { const Icon = link.icon; return (<NavLink key={link.to} to={link.to} className={({ isActive }: { isActive: boolean }) => `nav-item ${isActive ? 'active' : ''}`} end={link.to === '/'}><Icon size={16} /><span>{link.label}</span></NavLink>); })}
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {walletStatus === 'connected' && (
            <div className="status-pill desktop-only">
              <span className="pulse-dot" />
              <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{networkId}</span>
            </div>
          )}
          {renderWalletSection()}
          {walletStatus === 'failed' && walletError && (
            <span className="desktop-only" style={{ fontSize: '0.72rem', color: '#b91c1c', maxWidth: '160px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={walletError}>{walletError}</span>
          )}
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle navigation">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div className="brand-logo"><div className="brand-icon"><ShieldCheck size={20} /></div><span className="gradient-text" style={{ fontSize: '1.1rem', fontWeight: 800 }}>Confidential Payroll</span></div>
              <button className="icon-only-btn" onClick={() => setMobileMenuOpen(false)}><X size={20} /></button>
            </div>
            <div className="drawer-network-status">
              {walletStatus === 'connected' ? (<><CheckCircle2 size={13} color="#059669" /><span>Connected · {networkId}</span></>) : walletStatus === 'not_found' ? (<><WifiOff size={13} color="#ef4444" /><span style={{ color: '#ef4444' }}>Wallet Not Found</span></>) : walletStatus === 'failed' ? (<><AlertCircle size={13} color="#ef4444" /><span style={{ color: '#ef4444' }}>Failed To Connect</span></>) : (<><span className="pulse-dot" /><span>Midnight Network: {networkId}</span></>)}
            </div>
            {walletStatus === 'connected' && walletAddress && (
              <div style={{ padding: '0.6rem 1rem', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: '#065f46', background: 'rgba(5,150,105,0.06)', borderBottom: '1px solid rgba(5,150,105,0.1)', wordBreak: 'break-all' }}>{walletAddress}</div>
            )}
            {walletStatus !== 'connected' && walletStatus !== 'not_found' && (
              <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)' }}>
                <button onClick={() => { handleConnectWallet(); setMobileMenuOpen(false); }} disabled={isConnecting} className="btn btn-primary" style={{ width: '100%' }}>
                  {isConnecting ? (<><Loader2 size={15} className="spin-icon" /> Connecting...</>) : (<><Wallet size={16} /> Connect Lace Wallet</>)}
                </button>
              </div>
            )}
            <nav className="mobile-nav-list">
              {navLinks.map((link) => { const Icon = link.icon; return (<NavLink key={link.to} to={link.to} className={({ isActive }: { isActive: boolean }) => `mobile-nav-item ${isActive ? 'active' : ''}`} end={link.to === '/'} onClick={() => setMobileMenuOpen(false)}><Icon size={18} /><span>{link.label}</span></NavLink>); })}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};