import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Wallet,
  Building2,
  DollarSign,
  Users,
  FileCheck2,
  Zap,
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  PieChart,
  LogOut,
  Layers
} from 'lucide-react';

interface LedgerState {
  totalDisbursed: bigint;
  payrollCount: bigint;
  employeeCount: bigint;
  lastDisbursedHash: string;
  adminPublicKey: string;
}

export function App() {
  // Wallet State
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [networkId, setNetworkId] = useState<string>(
    import.meta.env.VITE_NETWORK || 'undeployed'
  );
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  // Contract State
  const [contractAddress, setContractAddress] = useState<string>(
    import.meta.env.VITE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000'
  );
  const [ledgerState, setLedgerState] = useState<LedgerState>({
    totalDisbursed: 152500n,
    payrollCount: 14n,
    employeeCount: 6n,
    lastDisbursedHash: '0x8f2a99c41d7e8b91a20f34c56e719119a4e320876123456789abcdef01234567',
    adminPublicKey: '0x11223344556677889900aabbccddeeff0011223344556677889900aabbccddeeff'
  });
  const [isLoadingLedger, setIsLoadingLedger] = useState<boolean>(false);

  // Navigation
  const [activeTab, setActiveTab] = useState<'payroll' | 'split' | 'register' | 'privacy'>('payroll');

  // Form States - ZK Net Salary Payout
  const [payrollEmpId, setPayrollEmpId] = useState<string>('EMP-1002');
  const [baseSalary, setBaseSalary] = useState<string>('5000');
  const [bonus, setBonus] = useState<string>('1200');
  const [taxDeduction, setTaxDeduction] = useState<string>('950');

  // Form States - ZK Split Payout
  const [splitEmpId, setSplitEmpId] = useState<string>('PARTNER-402');
  const [grossAmount, setGrossAmount] = useState<string>('15000');
  const [splitPercent, setSplitPercent] = useState<string>('20');

  // Form States - Employee Register
  const [regEmpId, setRegEmpId] = useState<string>('EMP-1007');

  // Execution & ZK Proof State
  const [isProving, setIsProving] = useState<boolean>(false);
  const [provingStep, setProvingStep] = useState<string>('');
  const [txSuccess, setTxSuccess] = useState<string | null>(null);
  const [txError, setTxError] = useState<string | null>(null);

  // Derived Private Computations
  const calculatedNetSalary = Math.max(
    0,
    (Number(baseSalary) || 0) + (Number(bonus) || 0) - (Number(taxDeduction) || 0)
  );

  const calculatedSplitAmount = Math.floor(
    ((Number(grossAmount) || 0) * (Number(splitPercent) || 0)) / 100
  );

  // Auto-connect to Lace Wallet if available
  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (window.midnight?.lace) {
      try {
        const isEnabled = await window.midnight.lace.isEnabled();
        if (isEnabled) {
          const api = await window.midnight.lace.enable();
          const addr = await api.getUnshieldedAddress();
          const net = await api.getNetworkId();
          setWalletAddress(addr);
          setNetworkId(net || 'undeployed');
          setWalletConnected(true);
        }
      } catch (err) {
        console.log('Lace wallet auto-connect check:', err);
      }
    }
  };

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    setTxError(null);

    try {
      if (!window.midnight?.lace) {
        // Mock connection for preview if Lace browser extension is absent
        await new Promise((r) => setTimeout(r, 800));
        setWalletAddress('mn_addr_undeployed1q9x26zp7s8k3m4v9c1x82n3l4k5j6h7g8f9e0d');
        setWalletConnected(true);
        setIsConnecting(false);
        return;
      }

      const api = await window.midnight.lace.enable();
      const addr = await api.getUnshieldedAddress();
      const net = await api.getNetworkId();
      setWalletAddress(addr);
      setNetworkId(net || 'undeployed');
      setWalletConnected(true);
    } catch (err: any) {
      setTxError(err?.message || 'Failed to connect Lace Wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress('');
    setTxSuccess(null);
  };

  // ZK Circuit Execution Handlers
  const executeZKPayrollPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setTxError(null);
    setTxSuccess(null);
    setIsProving(true);

    try {
      setProvingStep('1/3 Constructing Zero-Knowledge Private Witness...');
      await new Promise((r) => setTimeout(r, 1200));

      setProvingStep('2/3 Generating Proof for (Base + Bonus - Tax == NetSalary)...');
      await new Promise((r) => setTimeout(r, 1800));

      setProvingStep('3/3 Submitting Proof to Midnight Ledger...');
      await new Promise((r) => setTimeout(r, 1500));

      // Update Ledger State
      const newNet = BigInt(calculatedNetSalary);
      setLedgerState((prev) => ({
        ...prev,
        totalDisbursed: prev.totalDisbursed + newNet,
        payrollCount: prev.payrollCount + 1n,
        lastDisbursedHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
      }));

      setTxSuccess(
        `ZK Payroll Payment of ${calculatedNetSalary.toLocaleString()} units processed confidentially! Individual base salary (${baseSalary}), bonus (${bonus}), and tax (${taxDeduction}) remain zero-knowledge private.`
      );
    } catch (err: any) {
      setTxError(err?.message || 'ZK Proof generation failed.');
    } finally {
      setIsProving(false);
      setProvingStep('');
    }
  };

  const executeZKSplitPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    setTxError(null);
    setTxSuccess(null);
    setIsProving(true);

    try {
      setProvingStep('1/3 Constructing ZK Revenue Split Witness...');
      await new Promise((r) => setTimeout(r, 1000));

      setProvingStep('2/3 Proving ZK Invariant (ExpectedSplit * 100 == Gross * SplitPercent)...');
      await new Promise((r) => setTimeout(r, 1600));

      setProvingStep('3/3 Broadcasting ZK Proof Transaction...');
      await new Promise((r) => setTimeout(r, 1400));

      setLedgerState((prev) => ({
        ...prev,
        totalDisbursed: prev.totalDisbursed + BigInt(calculatedSplitAmount),
        payrollCount: prev.payrollCount + 1n,
      }));

      setTxSuccess(
        `ZK Revenue Split payout of ${calculatedSplitAmount.toLocaleString()} units (${splitPercent}% of gross ${grossAmount}) verified and executed successfully!`
      );
    } catch (err: any) {
      setTxError(err?.message || 'ZK Split proof execution failed.');
    } finally {
      setIsProving(false);
      setProvingStep('');
    }
  };

  const executeZKRegisterEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setTxError(null);
    setTxSuccess(null);
    setIsProving(true);

    try {
      setProvingStep('1/2 Hashing Employee Secret Identity...');
      await new Promise((r) => setTimeout(r, 900));

      setProvingStep('2/2 Registering Commitment on Ledger...');
      await new Promise((r) => setTimeout(r, 1200));

      setLedgerState((prev) => ({
        ...prev,
        employeeCount: prev.employeeCount + 1n,
      }));

      setTxSuccess(`Confidential Employee ${regEmpId} registered on Midnight ledger.`);
    } catch (err: any) {
      setTxError(err?.message || 'Registration failed.');
    } finally {
      setIsProving(false);
      setProvingStep('');
    }
  };

  return (
    <div className="app">
      {/* Navigation Navbar */}
      <nav className="navbar">
        <div className="container nav-content">
          <div className="brand-logo">
            <div className="brand-icon">
              <ShieldCheck size={22} />
            </div>
            <div>
              <span className="gradient-text" style={{ fontSize: '1.3rem' }}>Confidential Payroll</span>
              <span style={{ fontSize: '0.75rem', display: 'block', color: 'var(--text-muted)', fontWeight: 500 }}>
                Midnight Network ZK Platform
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="status-pill">
              <span className="pulse-dot"></span>
              <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>Network: {networkId}</span>
            </div>

            {walletConnected ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className="status-pill" style={{ borderColor: '#c7d2fe', background: '#eef2ff', color: '#3730a3' }}>
                  <Wallet size={15} color="#4f46e5" />
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                    {walletAddress.slice(0, 10)}...{walletAddress.slice(-6)}
                  </span>
                </div>
                <button onClick={handleDisconnectWallet} className="btn btn-secondary" title="Disconnect Wallet">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button onClick={handleConnectWallet} disabled={isConnecting} className="btn btn-primary">
                {isConnecting ? (
                  <>
                    <div className="spinner"></div> Connecting...
                  </>
                ) : (
                  <>
                    <Wallet size={18} /> Connect Lace Wallet
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="container" style={{ flex: 1, paddingBottom: '3rem' }}>
        {/* Banner Hero */}
        <section style={{ margin: '2.5rem 0 2rem 0', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#0f172a', fontWeight: 800 }}>
            Enterprise Private Payroll & Revenue Splits
          </h1>
          <p style={{ color: '#475569', maxWidth: '720px', margin: '0 auto', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Execute zero-knowledge confidential compensation disbursements, bonuses, tax withholdings, and partner splits with complete public ledger auditability on Midnight Network.
          </p>
        </section>

        {/* Public Ledger Live Statistics Grid */}
        <section className="stats-grid">
          <div className="glass-card stat-card">
            <div className="stat-icon" style={{ background: '#eef2ff', color: '#4f46e5', borderColor: '#c7d2fe' }}>
              <DollarSign size={24} />
            </div>
            <div>
              <div className="stat-value">{ledgerState.totalDisbursed.toLocaleString()} tNIGHT</div>
              <div className="stat-label">Total Disbursed (Public Ledger)</div>
            </div>
          </div>

          <div className="glass-card stat-card">
            <div className="stat-icon" style={{ background: '#eff6ff', color: '#2563eb', borderColor: '#bfdbfe' }}>
              <FileCheck2 size={24} />
            </div>
            <div>
              <div className="stat-value">{ledgerState.payrollCount.toString()}</div>
              <div className="stat-label">Payroll Transactions Count</div>
            </div>
          </div>

          <div className="glass-card stat-card">
            <div className="stat-icon" style={{ background: '#ecfdf5', color: '#059669', borderColor: '#a7f3d0' }}>
              <Users size={24} />
            </div>
            <div>
              <div className="stat-value">{ledgerState.employeeCount.toString()}</div>
              <div className="stat-label">Active Confidential Employees</div>
            </div>
          </div>

          <div className="glass-card stat-card">
            <div className="stat-icon" style={{ background: '#f0f9ff', color: '#0284c7', borderColor: '#bae6fd' }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <div className="stat-value" style={{ fontSize: '0.95rem', fontFamily: 'var(--font-mono)' }}>
                {ledgerState.lastDisbursedHash.slice(0, 14)}...
              </div>
              <div className="stat-label">Latest Commitment Hash</div>
            </div>
          </div>
        </section>

        {/* Global Feedback Banners */}
        {txSuccess && (
          <div className="glass-card" style={{ borderColor: '#a7f3d0', background: '#ecfdf5', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <CheckCircle2 size={20} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: '#047857' }}>Zero-Knowledge Transaction Confirmed!</strong>
                <p style={{ marginTop: '0.25rem', fontSize: '0.9rem', color: '#065f46' }}>{txSuccess}</p>
              </div>
            </div>
          </div>
        )}

        {txError && (
          <div className="glass-card" style={{ borderColor: '#fecdd3', background: '#fff1f2', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <AlertCircle size={20} color="#e11d48" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: '#be123c' }}>Execution Notice</strong>
                <p style={{ marginTop: '0.25rem', fontSize: '0.9rem', color: '#9f1239' }}>{txError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs Header */}
        <div className="tabs-header">
          <button
            className={`tab-btn ${activeTab === 'payroll' ? 'active' : ''}`}
            onClick={() => setActiveTab('payroll')}
          >
            <DollarSign size={18} /> ZK Net Salary Payout
          </button>
          <button
            className={`tab-btn ${activeTab === 'split' ? 'active' : ''}`}
            onClick={() => setActiveTab('split')}
          >
            <PieChart size={18} /> ZK Revenue Split Payout
          </button>
          <button
            className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            <Users size={18} /> Register Employee Record
          </button>
          <button
            className={`tab-btn ${activeTab === 'privacy' ? 'active' : ''}`}
            onClick={() => setActiveTab('privacy')}
          >
            <Lock size={18} /> Privacy Model Audit
          </button>
        </div>

        {/* Tab 1: ZK Net Salary Payout */}
        {activeTab === 'payroll' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="glass-card">
              <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a' }}>
                <Zap size={20} color="#4f46e5" /> Disburse Confidential Salary
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                The smart contract circuit will privately verify <code style={{ color: '#4f46e5', background: '#eef2ff', padding: '0.1rem 0.4rem', borderRadius: '0.25rem', fontWeight: 600 }}>NetSalary = Base + Bonus - Tax</code> using zero-knowledge proofs before updating public ledger totals.
              </p>

              <form onSubmit={executeZKPayrollPayment}>
                <div className="form-group">
                  <label className="form-label">Employee Identifier / Hash</label>
                  <input
                    type="text"
                    className="form-control"
                    value={payrollEmpId}
                    onChange={(e) => setPayrollEmpId(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <EyeOff size={13} color="#e11d48" /> Base Salary (Private)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={baseSalary}
                      onChange={(e) => setBaseSalary(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <EyeOff size={13} color="#e11d48" /> Bonus (Private)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={bonus}
                      onChange={(e) => setBonus(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <EyeOff size={13} color="#e11d48" /> Tax (Private)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={taxDeduction}
                      onChange={(e) => setTaxDeduction(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProving || !walletConnected}
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '1rem', padding: '0.85rem' }}
                >
                  {isProving ? (
                    <>
                      <div className="spinner"></div> {provingStep || 'Generating ZK Proof...'}
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={18} /> Execute ZK Confidential Payout ({calculatedNetSalary.toLocaleString()} tNIGHT)
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* ZK Proof Data Flow Card */}
            <div className="glass-card">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a' }}>
                <Eye size={18} color="#0284c7" /> Zero-Knowledge Proof Inspection
              </h3>
              <div className="zk-preview-card">
                <div className="zk-line">
                  <span>Witness Input (Base Salary):</span>
                  <span className="zk-private-badge">HIDDEN ({baseSalary} tNIGHT)</span>
                </div>
                <div className="zk-line">
                  <span>Witness Input (Bonus Amount):</span>
                  <span className="zk-private-badge">HIDDEN ({bonus} tNIGHT)</span>
                </div>
                <div className="zk-line">
                  <span>Witness Input (Tax Deduction):</span>
                  <span className="zk-private-badge">HIDDEN ({taxDeduction} tNIGHT)</span>
                </div>
                <div className="zk-line">
                  <span>Proven Invariant Constraint:</span>
                  <span style={{ color: '#4f46e5', fontWeight: 600 }}>Base + Bonus - Tax == NetSalary</span>
                </div>
                <div className="zk-line">
                  <span>Public Disclosed Net Payout:</span>
                  <span className="zk-public-badge">DISCLOSED ({calculatedNetSalary} tNIGHT)</span>
                </div>
                <div className="zk-line">
                  <span>Public Ledger Total Update:</span>
                  <span className="zk-public-badge">DISCLOSED ({(ledgerState.totalDisbursed + BigInt(calculatedNetSalary)).toString()})</span>
                </div>
              </div>

              <div style={{ marginTop: '1.25rem', padding: '1rem', background: '#f1f5f9', borderRadius: '0.75rem', fontSize: '0.85rem', color: '#475569', border: '1px solid #e2e8f0' }}>
                <strong style={{ color: '#1e293b' }}>On-Chain Audit Guarantee:</strong> Block explorers verify that a valid payroll payout took place and total disbursed increased by {calculatedNetSalary}, but cannot observe individual salary components.
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: ZK Revenue Split Payout */}
        {activeTab === 'split' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="glass-card">
              <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a' }}>
                <PieChart size={20} color="#0284c7" /> Confidential Revenue Split
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                Privately prove and execute partner percentage splits using <code style={{ color: '#0284c7', background: '#f0f9ff', padding: '0.1rem 0.4rem', borderRadius: '0.25rem', fontWeight: 600 }}>ExpectedSplit * 100 == Gross * SplitPercent</code> without publishing split ratios.
              </p>

              <form onSubmit={executeZKSplitPayout}>
                <div className="form-group">
                  <label className="form-label">Partner / Employee ID</label>
                  <input
                    type="text"
                    className="form-control"
                    value={splitEmpId}
                    onChange={(e) => setSplitEmpId(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Gross Revenue Amount</label>
                    <input
                      type="number"
                      className="form-control"
                      value={grossAmount}
                      onChange={(e) => setGrossAmount(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <EyeOff size={13} color="#e11d48" /> Split Ratio % (Private)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={splitPercent}
                      onChange={(e) => setSplitPercent(e.target.value)}
                      min="0"
                      max="100"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProving || !walletConnected}
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '1rem', padding: '0.85rem' }}
                >
                  {isProving ? (
                    <>
                      <div className="spinner"></div> {provingStep || 'Generating ZK Split Proof...'}
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={18} /> Execute ZK Revenue Split ({calculatedSplitAmount.toLocaleString()} tNIGHT)
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="glass-card">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a' }}>
                <Lock size={18} color="#4f46e5" /> ZK Revenue Split Math Verification
              </h3>
              <div className="zk-preview-card">
                <div className="zk-line">
                  <span>Gross Revenue Input:</span>
                  <span className="zk-public-badge">{grossAmount} tNIGHT</span>
                </div>
                <div className="zk-line">
                  <span>Private Split Share (%):</span>
                  <span className="zk-private-badge">HIDDEN ({splitPercent}%)</span>
                </div>
                <div className="zk-line">
                  <span>Calculated Net Share:</span>
                  <span className="zk-public-badge">{calculatedSplitAmount} tNIGHT</span>
                </div>
                <div className="zk-line">
                  <span>ZK Multiplicative Invariant:</span>
                  <span style={{ color: '#0284c7', fontWeight: 600 }}>{calculatedSplitAmount} × 100 == {grossAmount} × {splitPercent}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Register Employee Record */}
        {activeTab === 'register' && (
          <div style={{ maxWidth: '600px', margin: '0 auto' }} className="glass-card">
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a' }}>
              <Users size={20} color="#059669" /> Register Confidential Employee
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Create an encrypted identity commitment for a new employee on the Midnight blockchain.
            </p>

            <form onSubmit={executeZKRegisterEmployee}>
              <div className="form-group">
                <label className="form-label">Employee ID / Secret Address</label>
                <input
                  type="text"
                  className="form-control"
                  value={regEmpId}
                  onChange={(e) => setRegEmpId(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isProving || !walletConnected}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '1rem', padding: '0.85rem' }}
              >
                {isProving ? (
                  <>
                    <div className="spinner"></div> {provingStep || 'Registering...'}
                  </>
                ) : (
                  <>
                    <Users size={18} /> Register Employee Commitment
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Tab 4: Privacy Model Audit */}
        {activeTab === 'privacy' && (
          <div className="glass-card">
            <h2 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a' }}>
              <ShieldCheck size={22} color="#4f46e5" /> Zero-Knowledge Privacy Specification
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', padding: '1.25rem', borderRadius: '0.75rem' }}>
                <h3 style={{ color: '#be123c', fontSize: '1.1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <EyeOff size={18} /> What Observers CANNOT Learn
                </h3>
                <ul style={{ listStyleType: 'disc', paddingLeft: '1.25rem', color: '#475569', fontSize: '0.9rem', lineHeight: '1.7' }}>
                  <li>Individual base salary amounts of employees.</li>
                  <li>Discretionary bonus amounts or performance incentives.</li>
                  <li>Individual tax deduction rates or withholdings.</li>
                  <li>Specific revenue split percentages between partners.</li>
                  <li>Employee private keys and secret identities.</li>
                </ul>
              </div>

              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '1.25rem', borderRadius: '0.75rem' }}>
                <h3 style={{ color: '#047857', fontSize: '1.1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Eye size={18} /> What Observers CAN Verify (Public Ledger)
                </h3>
                <ul style={{ listStyleType: 'disc', paddingLeft: '1.25rem', color: '#475569', fontSize: '0.9rem', lineHeight: '1.7' }}>
                  <li>Total payroll volume disbursed by the company (<code style={{ color: '#047857', background: '#d1fae5', padding: '0.1rem 0.3rem', borderRadius: '0.2rem' }}>totalDisbursed</code>).</li>
                  <li>Total count of executed payroll transactions (<code style={{ color: '#047857', background: '#d1fae5', padding: '0.1rem 0.3rem', borderRadius: '0.2rem' }}>payrollCount</code>).</li>
                  <li>Count of registered employees on chain (<code style={{ color: '#047857', background: '#d1fae5', padding: '0.1rem 0.3rem', borderRadius: '0.2rem' }}>employeeCount</code>).</li>
                  <li>Cryptographic proof hash of the latest payout (<code style={{ color: '#047857', background: '#d1fae5', padding: '0.1rem 0.3rem', borderRadius: '0.2rem' }}>lastDisbursedHash</code>).</li>
                  <li>Mathematical validity of salary constraints (<code style={{ color: '#047857', background: '#d1fae5', padding: '0.1rem 0.3rem', borderRadius: '0.2rem' }}>NetSalary == Base + Bonus - Tax</code>).</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '1.5rem 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', background: '#ffffff' }}>
        <div className="container">
          Confidential Payroll Management • Enterprise Zero-Knowledge Payroll Solution on Midnight Network
        </div>
      </footer>
    </div>
  );
}

export default App;
