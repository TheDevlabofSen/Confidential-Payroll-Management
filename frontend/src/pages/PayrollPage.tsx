import React, { useState } from 'react';
import { usePayroll } from '../context/PayrollContext';
import {
  DollarSign,
  PieChart,
  Users,
  ShieldCheck,
  Zap,
  Eye,
  EyeOff,
  Lock,
  Calculator,
  UserPlus,
  HelpCircle
} from 'lucide-react';

export const PayrollPage: React.FC = () => {
  const {
    walletConnected,
    isProving,
    provingStep,
    ledgerState,
    executeZKPayrollPayment,
    executeZKSplitPayout,
    executeZKRegisterEmployee,
  } = usePayroll();

  const [activeTab, setActiveTab] = useState<'payroll' | 'split' | 'register'>('payroll');

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

  // Derived Computations
  const calculatedNetSalary = Math.max(
    0,
    (Number(baseSalary) || 0) + (Number(bonus) || 0) - (Number(taxDeduction) || 0)
  );

  const calculatedSplitAmount = Math.floor(
    ((Number(grossAmount) || 0) * (Number(splitPercent) || 0)) / 100
  );

  const handlePayrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await executeZKPayrollPayment(payrollEmpId, baseSalary, bonus, taxDeduction);
  };

  const handleSplitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await executeZKSplitPayout(splitEmpId, grossAmount, splitPercent);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await executeZKRegisterEmployee(regEmpId);
  };

  return (
    <div className="container page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Payroll Workspace</h1>
          <p className="page-subtitle">
            Execute zero-knowledge net compensation disbursements, revenue splits, and employee identity commitments.
          </p>
        </div>
      </div>

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
          <UserPlus size={18} /> Register Employee Record
        </button>
      </div>

      {/* Tab 1: ZK Net Salary Payout */}
      {activeTab === 'payroll' && (
        <div className="two-column-grid">
          <div className="glass-card">
            <h2 className="card-section-title">
              <Zap size={20} color="#4f46e5" /> Disburse Confidential Salary
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              The Midnight Compact circuit privately verifies <code className="code-pill">NetSalary = Base + Bonus - Tax</code> using ZK proofs before updating public ledger totals.
            </p>

            <form onSubmit={handlePayrollSubmit}>
              <div className="form-group">
                <label className="form-label">Employee Identifier / Reference Hash</label>
                <input
                  type="text"
                  className="form-control"
                  value={payrollEmpId}
                  onChange={(e) => setPayrollEmpId(e.target.value)}
                  required
                />
              </div>

              <div className="three-column-inputs">
                <div className="form-group">
                  <label className="form-label label-private">
                    <EyeOff size={13} color="#e11d48" /> Base Salary
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
                  <label className="form-label label-private">
                    <EyeOff size={13} color="#e11d48" /> Bonus
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
                  <label className="form-label label-private">
                    <EyeOff size={13} color="#e11d48" /> Tax Deduction
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

              <div className="calculated-result-box">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calculator size={18} color="#4f46e5" />
                  <span style={{ fontWeight: 600, color: '#1e293b' }}>Calculated Public Net Payout:</span>
                </div>
                <span className="net-salary-badge">{calculatedNetSalary.toLocaleString()} tNIGHT</span>
              </div>

              <button
                type="submit"
                disabled={isProving || !walletConnected}
                className="btn btn-primary btn-full"
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
            <h3 className="card-section-title">
              <Eye size={18} color="#0284c7" /> Zero-Knowledge Witness Inspection
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
                <span className="font-semibold text-indigo">Base + Bonus - Tax == NetSalary</span>
              </div>
              <div className="zk-line">
                <span>Public Disclosed Net Payout:</span>
                <span className="zk-public-badge">DISCLOSED ({calculatedNetSalary} tNIGHT)</span>
              </div>
              <div className="zk-line">
                <span>Updated Ledger Total Disbursed:</span>
                <span className="zk-public-badge">
                  {(ledgerState.totalDisbursed + BigInt(calculatedNetSalary)).toString()} tNIGHT
                </span>
              </div>
            </div>

            <div className="info-callout">
              <strong style={{ color: '#1e293b' }}>On-Chain Audit Guarantee:</strong> Block explorers verify that a valid payroll payout took place and total disbursed increased by {calculatedNetSalary}, but cannot observe individual salary components.
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: ZK Revenue Split Payout */}
      {activeTab === 'split' && (
        <div className="two-column-grid">
          <div className="glass-card">
            <h2 className="card-section-title">
              <PieChart size={20} color="#0284c7" /> Confidential Revenue Split
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              Privately prove and execute partner percentage splits using <code className="code-pill bg-cyan-light">ExpectedSplit * 100 == Gross * SplitPercent</code> without publishing split ratios.
            </p>

            <form onSubmit={handleSplitSubmit}>
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

              <div className="two-column-inputs">
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
                  <label className="form-label label-private">
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

              <div className="calculated-result-box">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calculator size={18} color="#0284c7" />
                  <span style={{ fontWeight: 600, color: '#1e293b' }}>Calculated Net Partner Share:</span>
                </div>
                <span className="net-salary-badge bg-cyan-badge">{calculatedSplitAmount.toLocaleString()} tNIGHT</span>
              </div>

              <button
                type="submit"
                disabled={isProving || !walletConnected}
                className="btn btn-primary btn-full"
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
            <h3 className="card-section-title">
              <Lock size={18} color="#4f46e5" /> ZK Revenue Split Verification Math
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
                <span style={{ color: '#0284c7', fontWeight: 600 }}>
                  {calculatedSplitAmount} × 100 == {grossAmount} × {splitPercent}
                </span>
              </div>
            </div>

            <div className="info-callout">
              <strong style={{ color: '#1e293b' }}>Partner Agreement Privacy:</strong> The exact percentage allocation remains zero-knowledge private. Only the final output payment amount is published on the blockchain.
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Register Employee Record */}
      {activeTab === 'register' && (
        <div style={{ maxWidth: '640px', margin: '0 auto' }} className="glass-card">
          <h2 className="card-section-title">
            <Users size={20} color="#059669" /> Register Confidential Employee Identity
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            Create an encrypted identity commitment for a new employee on the Midnight blockchain.
          </p>

          <form onSubmit={handleRegisterSubmit}>
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
              className="btn btn-primary btn-full"
            >
              {isProving ? (
                <>
                  <div className="spinner"></div> {provingStep || 'Registering Identity...'}
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
    </div>
  );
};
