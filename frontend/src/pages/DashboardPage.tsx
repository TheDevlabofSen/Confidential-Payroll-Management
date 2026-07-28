import React from 'react';
import { Link } from 'react-router-dom';
import { usePayroll } from '../context/PayrollContext';
import {
  DollarSign,
  Users,
  Award,
  TrendingUp,
  ShieldCheck,
  Server,
  Cpu,
  ArrowRight,
  ExternalLink,
  Copy,
  CheckCircle2,
  Clock,
  Zap,
  Lock,
  FileText,
  AlertCircle,
  WifiOff,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { ledgerState, networkId, contractAddress, auditLogs, credentials, walletConnected, walletStatus, walletAddress } = usePayroll();
  const [copiedHash, setCopiedHash] = React.useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const activeCredsCount = credentials.filter((c) => c.status === 'ACTIVE').length;

  return (
    <div className="container page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Executive Dashboard</h1>
          <p className="page-subtitle">
            Real-time telemetry, zero-knowledge verification stats, and network node status.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/payroll" className="btn btn-primary">
            <Zap size={16} /> Execute Payroll
          </Link>
          <Link to="/verify" className="btn btn-secondary">
            <ShieldCheck size={16} /> Verify Employee
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid">
        <div className="glass-card stat-card">
          <div className="stat-icon bg-indigo">
            <DollarSign size={24} color="#4f46e5" />
          </div>
          <div>
            <div className="stat-value">{ledgerState.totalDisbursed.toLocaleString()} tNIGHT</div>
            <div className="stat-label">Total Disbursed (Public Ledger)</div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon bg-blue">
            <FileText size={24} color="#2563eb" />
          </div>
          <div>
            <div className="stat-value">{ledgerState.payrollCount.toString()}</div>
            <div className="stat-label">Total Payroll Records</div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon bg-emerald">
            <Users size={24} color="#059669" />
          </div>
          <div>
            <div className="stat-value">{ledgerState.employeeCount.toString()}</div>
            <div className="stat-label">Verified Employees</div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon bg-purple">
            <Award size={24} color="#9333ea" />
          </div>
          <div>
            <div className="stat-value">{activeCredsCount}</div>
            <div className="stat-label">Active Credentials</div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon bg-cyan">
            <TrendingUp size={24} color="#0284c7" />
          </div>
          <div>
            <div className="stat-value">100.0%</div>
            <div className="stat-label">Verification Success Rate</div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Network & Infrastructure Status Widget */}
        <div className="glass-card">
          <h2 className="card-section-title">
            <Server size={20} color="#4f46e5" /> Network & Infrastructure Status
          </h2>
          <div className="network-status-list">
            <div className="status-item">
              <div className="status-info">
                <span className="status-label">Midnight Network</span>
                <span className="status-sub">Chain ID: {networkId}</span>
              </div>
              <span className="status-badge status-online">
                <span className="pulse-dot"></span> Active
              </span>
            </div>

            <div className="status-item">
              <div className="status-info">
                <span className="status-label">Compact Smart Contract</span>
                <span className="status-sub font-mono">
                  {contractAddress.slice(0, 12)}...{contractAddress.slice(-6)}
                </span>
              </div>
              <span className="status-badge status-online">
                <span className="pulse-dot"></span> Deployed
              </span>
            </div>

            <div className="status-item">
              <div className="status-info">
                <span className="status-label">Local Proof Server</span>
                <span className="status-sub">http://localhost:6300</span>
              </div>
              <span className="status-badge status-online">
                <span className="pulse-dot"></span> Ready
              </span>
            </div>

            <div className="status-item">
              <div className="status-info">
                <span className="status-label">Lace Wallet Bridge</span>
                <span className="status-sub">
                  {walletStatus === 'connected' && walletAddress
                    ? walletAddress.slice(0, 10) + '...' + walletAddress.slice(-6)
                    : 'dApp Browser Connector'}
                </span>
              </div>
              {walletStatus === 'connected' ? (
                <span className="status-badge status-online">
                  <span className="pulse-dot"></span> Connected
                </span>
              ) : walletStatus === 'not_found' ? (
                <span className="status-badge" style={{ background: 'rgba(239,68,68,0.08)', color: '#b91c1c', borderColor: '#fca5a5' }}>
                  <WifiOff size={11} /> Not Found
                </span>
              ) : walletStatus === 'failed' ? (
                <span className="status-badge" style={{ background: 'rgba(239,68,68,0.08)', color: '#b91c1c', borderColor: '#fca5a5' }}>
                  <AlertCircle size={11} /> Failed
                </span>
              ) : walletStatus === 'connecting' ? (
                <span className="status-badge" style={{ background: 'rgba(245,158,11,0.08)', color: '#92400e', borderColor: '#fcd34d' }}>
                  Connecting...
                </span>
              ) : (
                <span className="status-badge" style={{ background: 'rgba(100,116,139,0.08)', color: '#475569', borderColor: '#cbd5e1' }}>
                  Not Connected
                </span>
              )}
            </div>
          </div>

          {/* Latest Commitment Hash Card */}
          <div className="latest-hash-box">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Latest Ledger Commitment Hash</span>
              <button
                className="btn-text"
                onClick={() => handleCopy(ledgerState.lastDisbursedHash)}
                style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              >
                {copiedHash === ledgerState.lastDisbursedHash ? <CheckCircle2 size={12} color="#059669" /> : <Copy size={12} />}
                {copiedHash === ledgerState.lastDisbursedHash ? 'Copied' : 'Copy'}
              </button>
            </div>
            <code className="font-mono" style={{ fontSize: '0.85rem', color: '#3730a3', wordBreak: 'break-all' }}>
              {ledgerState.lastDisbursedHash}
            </code>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="glass-card">
          <h2 className="card-section-title">
            <Zap size={20} color="#0284c7" /> Quick Workspace Actions
          </h2>
          <div className="quick-actions-grid">
            <Link to="/payroll" className="quick-action-btn">
              <div className="quick-action-icon bg-indigo">
                <DollarSign size={20} color="#4f46e5" />
              </div>
              <div>
                <h4>Manage Payroll</h4>
                <p>Process net salaries & revenue splits</p>
              </div>
              <ArrowRight size={16} color="#94a3b8" />
            </Link>

            <Link to="/verify" className="quick-action-btn">
              <div className="quick-action-icon bg-blue">
                <ShieldCheck size={20} color="#2563eb" />
              </div>
              <div>
                <h4>Verify Employee</h4>
                <p>5-step ZK proof verification wizard</p>
              </div>
              <ArrowRight size={16} color="#94a3b8" />
            </Link>

            <Link to="/credentials" className="quick-action-btn">
              <div className="quick-action-icon bg-purple">
                <Award size={20} color="#9333ea" />
              </div>
              <div>
                <h4>Credential Vault</h4>
                <p>Manage confidential employee credentials</p>
              </div>
              <ArrowRight size={16} color="#94a3b8" />
            </Link>

            <Link to="/history" className="quick-action-btn">
              <div className="quick-action-icon bg-emerald">
                <Clock size={20} color="#059669" />
              </div>
              <div>
                <h4>View Audit Logs</h4>
                <p>Search & export immutable ledger logs</p>
              </div>
              <ArrowRight size={16} color="#94a3b8" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="glass-card" style={{ marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 className="card-section-title" style={{ margin: 0 }}>
            <Clock size={20} color="#9333ea" /> Recent Zero-Knowledge Activity Timeline
          </h2>
          <Link to="/history" className="btn-link" style={{ fontSize: '0.875rem' }}>
            View Full Audit History â†’
          </Link>
        </div>

        <div className="activity-timeline">
          {auditLogs.slice(0, 5).map((log) => (
            <div key={log.id} className="timeline-item">
              <div className="timeline-badge bg-emerald">
                <CheckCircle2 size={16} color="#059669" />
              </div>
              <div className="timeline-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>{log.event}</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{log.timestamp}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.35rem', fontSize: '0.85rem' }}>
                  <span>Ref: <strong className="font-mono">{log.employeeRef}</strong></span>
                  {log.amount && <span>Amount: <strong style={{ color: '#4f46e5' }}>{log.amount}</strong></span>}
                  <span className="status-tag status-verified">VERIFIED</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>Tx Hash:</span>
                  <code className="font-mono">{log.hash.slice(0, 24)}...</code>
                  <button className="btn-icon" onClick={() => handleCopy(log.hash)} title="Copy Hash">
                    <Copy size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
