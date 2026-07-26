import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Github, ExternalLink, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <div className="brand-logo" style={{ marginBottom: '0.75rem' }}>
            <div className="brand-icon">
              <ShieldCheck size={20} />
            </div>
            <span className="gradient-text" style={{ fontSize: '1.2rem', fontWeight: 800 }}>
              Confidential Payroll
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '320px', lineHeight: '1.6' }}>
            Enterprise Zero-Knowledge Payroll Management platform preserving salary privacy using Midnight Network smart contracts.
          </p>
        </div>

        <div className="footer-links-grid">
          <div className="footer-column">
            <h4>Product</h4>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/payroll">Payroll Workspace</Link>
            <Link to="/verify">Verification Wizard</Link>
            <Link to="/credentials">Credential Vault</Link>
            <Link to="/history">Audit History</Link>
          </div>

          <div className="footer-column">
            <h4>Resources</h4>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Github size={14} /> GitHub Repository <ExternalLink size={12} />
            </a>
            <a href="https://midnight.network" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              Midnight Docs <ExternalLink size={12} />
            </a>
            <Link to="/privacy">Privacy Model Specification</Link>
            <Link to="/about">About System Architecture</Link>
          </div>

          <div className="footer-column">
            <h4>Technology</h4>
            <span className="tech-badge-item">Midnight Network</span>
            <span className="tech-badge-item">Compact ZK Language</span>
            <span className="tech-badge-item">React + TypeScript</span>
            <span className="tech-badge-item">Vite + Tailwind CSS</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            Built for <strong>Midnight Hackathon</strong> — Confidential Payroll Management
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            © {new Date().getFullYear()} Confidential Payroll dApp. All ZK proofs processed locally.
          </div>
        </div>
      </div>
    </footer>
  );
};
