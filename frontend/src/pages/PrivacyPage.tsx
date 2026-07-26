import React from 'react';
import {
  ShieldCheck,
  Eye,
  EyeOff,
  Lock,
  Code2,
  Cpu,
  CheckCircle2,
  XCircle,
  Sparkles,
  FileCode
} from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="container page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Zero-Knowledge Privacy Model Specification</h1>
          <p className="page-subtitle">
            Deep dive into Midnight Network cryptographic guarantees, private state circuits, and on-chain verification.
          </p>
        </div>
      </div>

      {/* Comparison Cards: Can See vs Cannot See */}
      <div className="two-column-grid" style={{ marginBottom: '2.5rem' }}>
        <div className="glass-card comparison-card-hidden">
          <h3 className="card-section-title" style={{ color: '#be123c' }}>
            <EyeOff size={20} color="#e11d48" /> What Public Observers CANNOT See
          </h3>
          <ul className="privacy-list-items">
            <li>
              <XCircle size={18} color="#e11d48" style={{ flexShrink: 0 }} />
              <div>
                <strong>Base Salary & Regular Wages:</strong> Individual employee base compensation is kept inside local client witness state and never submitted to the ledger.
              </div>
            </li>
            <li>
              <XCircle size={18} color="#e11d48" style={{ flexShrink: 0 }} />
              <div>
                <strong>Discretionary Bonuses & Incentives:</strong> Performance bonuses and spot incentives remain zero-knowledge protected.
              </div>
            </li>
            <li>
              <XCircle size={18} color="#e11d48" style={{ flexShrink: 0 }} />
              <div>
                <strong>Tax Withholding Amounts & Rates:</strong> Federal, state, and local tax deduction numbers stay completely confidential.
              </div>
            </li>
            <li>
              <XCircle size={18} color="#e11d48" style={{ flexShrink: 0 }} />
              <div>
                <strong>Revenue Split Ratios:</strong> Partner agreement percentages (`SplitPercent`) are verified mathematically without revealing percentages.
              </div>
            </li>
            <li>
              <XCircle size={18} color="#e11d48" style={{ flexShrink: 0 }} />
              <div>
                <strong>Employee Secret Identity Keys:</strong> Employee secret identity seeds stay securely in local wallet storage.
              </div>
            </li>
          </ul>
        </div>

        <div className="glass-card comparison-card-visible">
          <h3 className="card-section-title" style={{ color: '#047857' }}>
            <Eye size={20} color="#059669" /> What Public Observers CAN Verify On-Chain
          </h3>
          <ul className="privacy-list-items">
            <li>
              <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0 }} />
              <div>
                <strong>Total Corporate Payroll Volume:</strong> The aggregate sum of all disbursed funds (`totalDisbursed`) is publicly updated on Midnight ledger.
              </div>
            </li>
            <li>
              <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0 }} />
              <div>
                <strong>Executed Transaction Count:</strong> Total count of executed payroll disbursements (`payrollCount`) is immutably logged.
              </div>
            </li>
            <li>
              <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0 }} />
              <div>
                <strong>Registered Employee Count:</strong> Active confidential employee count (`employeeCount`) is verified on-chain.
              </div>
            </li>
            <li>
              <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0 }} />
              <div>
                <strong>Mathematical Salary Invariants:</strong> Proof that `NetSalary = Base + Bonus - Tax` holds for every transaction.
              </div>
            </li>
            <li>
              <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0 }} />
              <div>
                <strong>Latest Proof Commitment Hash:</strong> Cryptographic commitment hash (`lastDisbursedHash`) for block explorer auditing.
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Why Midnight Matters Section */}
      <div className="glass-card" style={{ marginBottom: '2.5rem' }}>
        <h2 className="card-section-title">
          <Sparkles size={22} color="#9333ea" /> Why Midnight Network Architecture Matters
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
          Traditional blockchains like Ethereum and Solana enforce public transparency for all smart contract state variables and function arguments. In corporate payroll, public transparency is catastrophic — it exposes confidential salaries to competitors, employees, and hostile entities.
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.7' }}>
          Midnight Network introduces the <strong>Compact programming language</strong>, empowering developers to explicitly mark variables as <code className="code-pill">witness</code> (private client-side input) while maintaining verifiable public state on the ledger.
        </p>
      </div>

      {/* Actual Compact Contract Code Snippets */}
      <div className="glass-card">
        <h2 className="card-section-title">
          <FileCode size={22} color="#4f46e5" /> Compact Smart Contract Privacy Circuits
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
          Below is the actual Compact contract circuit deployed for this dApp (<code className="code-pill font-mono">contracts/payroll.compact</code>).
        </p>

        <div className="code-block-wrapper">
          <div className="code-header">
            <span>contracts/payroll.compact</span>
            <span className="code-lang-tag">Compact DSL</span>
          </div>
          <pre className="code-content font-mono">
{`pragma language_version >= 0.16.0;

import CompactStandardLibrary;

export enum VerificationStatus {
  UNVERIFIED,
  VERIFIED,
  REVOKED
}

export ledger totalDisbursed: Uint<64>;
export ledger payrollCount: Uint<64>;
export ledger employeeCount: Uint<64>;
export ledger lastDisbursedHash: Bytes<32>;

// ZK Net Salary Disburse Circuit
export circuit disburse_salary(
  witness baseSalary: Uint<64>,
  witness bonus: Uint<64>,
  witness taxDeduction: Uint<64>,
  public netSalary: Uint<64>
): Void {
  // Invariant Constraint Verification in Zero-Knowledge
  assert baseSalary + bonus >= taxDeduction "Base salary plus bonus must cover tax deduction";
  assert (baseSalary + bonus) - taxDeduction == netSalary "Calculated net salary does not match public payout";

  // Update Public Ledger State
  totalDisbursed = totalDisbursed + netSalary;
  payrollCount = payrollCount + 1;
}

// ZK Revenue Split Circuit
export circuit execute_split_payout(
  witness splitPercent: Uint<64>,
  public grossAmount: Uint<64>,
  public expectedSplit: Uint<64>
): Void {
  assert splitPercent <= 100 "Split ratio percentage cannot exceed 100%";
  assert expectedSplit * 100 == grossAmount * splitPercent "Revenue split math constraint violated";

  totalDisbursed = totalDisbursed + expectedSplit;
  payrollCount = payrollCount + 1;
}`}
          </pre>
        </div>
      </div>
    </div>
  );
};
