import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Zap,
  Lock,
  FileCheck2,
  Users,
  Building,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Layers,
  Database,
  Shield,
  EyeOff,
  Scale,
  Building2,
  FileSpreadsheet
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-badge">
            <ShieldCheck size={16} color="#4f46e5" />
            <span>Next-Generation Privacy on Midnight Network</span>
          </div>

          <h1 className="hero-title">
            Confidential Payroll Management <br className="desktop-only" />
            <span className="gradient-text">Powered by Zero-Knowledge Privacy</span>
          </h1>

          <p className="hero-subheadline">
            Manage sensitive payroll data while preserving employee privacy using Midnight Network smart contracts and Zero-Knowledge verification.
          </p>

          <div className="hero-cta-group">
            <Link to="/payroll" className="btn btn-primary btn-lg">
              Launch Payroll Workspace <ArrowRight size={18} />
            </Link>
            <Link to="/privacy" className="btn btn-secondary btn-lg">
              Learn How It Works
            </Link>
          </div>

          {/* Interactive Hero Visual Cards */}
          <div className="hero-illustration-grid">
            <div className="hero-card hero-card-1">
              <div className="card-header-icon bg-indigo">
                <Users size={20} color="#4f46e5" />
              </div>
              <div className="card-info">
                <h4>Employee Records</h4>
                <p>Secret Identity & Address</p>
                <span className="badge-shielded"><Lock size={12} /> Encrypted Commitment</span>
              </div>
            </div>

            <div className="hero-card hero-card-2">
              <div className="card-header-icon bg-blue">
                <Zap size={20} color="#2563eb" />
              </div>
              <div className="card-info">
                <h4>Payroll Processing</h4>
                <p>Base + Bonus - Tax Math</p>
                <span className="badge-circuit"><Cpu size={12} /> ZK Circuit Validated</span>
              </div>
            </div>

            <div className="hero-card hero-card-3">
              <div className="card-header-icon bg-rose">
                <EyeOff size={20} color="#e11d48" />
              </div>
              <div className="card-info">
                <h4>Confidential Salary Data</h4>
                <p>Salary Amounts & Deductions</p>
                <span className="badge-private"><Shield size={12} /> 100% Zero-Knowledge</span>
              </div>
            </div>

            <div className="hero-card hero-card-4">
              <div className="card-header-icon bg-emerald">
                <CheckCircle2 size={20} color="#059669" />
              </div>
              <div className="card-info">
                <h4>ZK Verification</h4>
                <p>On-Chain SNARK Proofs</p>
                <span className="badge-verified"><CheckCircle2 size={12} /> Ledger Auditor Ready</span>
              </div>
            </div>

            <div className="hero-card hero-card-5">
              <div className="card-header-icon bg-purple">
                <Layers size={20} color="#9333ea" />
              </div>
              <div className="card-info">
                <h4>Midnight Network</h4>
                <p>Compact Smart Contract</p>
                <span className="badge-midnight"><Database size={12} /> Public State Verified</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding bg-light-gradient">
        <div className="container">
          <div className="section-header">
            <span className="section-tagline">Why Choose Confidential Payroll</span>
            <h2 className="section-title">Enterprise-Grade Privacy Features</h2>
            <p className="section-description">
              Built from the ground up for organizations that value data privacy, regulatory compliance, and auditability.
            </p>
          </div>

          <div className="benefits-grid">
            <div className="glass-card feature-card">
              <div className="feature-icon bg-indigo">
                <Lock size={24} color="#4f46e5" />
              </div>
              <h3>Private Payroll Storage</h3>
              <p>
                Keep base salaries, performance bonuses, and withholding rates strictly private within local witness storage.
              </p>
            </div>

            <div className="glass-card feature-card">
              <div className="feature-icon bg-blue">
                <Users size={24} color="#2563eb" />
              </div>
              <h3>Confidential Employee Data</h3>
              <p>
                Employee identities are represented as cryptographic commitments on-chain, eliminating PII leak risks.
              </p>
            </div>

            <div className="glass-card feature-card">
              <div className="feature-icon bg-emerald">
                <ShieldCheck size={24} color="#059669" />
              </div>
              <h3>Zero-Knowledge Verification</h3>
              <p>
                Prove mathematical invariants (`NetSalary = Base + Bonus - Tax`) without revealing the underlying private inputs.
              </p>
            </div>

            <div className="glass-card feature-card">
              <div className="feature-icon bg-purple">
                <Scale size={24} color="#9333ea" />
              </div>
              <h3>Compliance Friendly</h3>
              <p>
                Generate verifiable audit reports for tax authorities and auditors without opening employee payroll registers to third parties.
              </p>
            </div>

            <div className="glass-card feature-card">
              <div className="feature-icon bg-cyan">
                <Shield size={24} color="#0284c7" />
              </div>
              <h3>Secure Access Control</h3>
              <p>
                Granular administrative permissions backed by public key authorization and Lace Wallet signatures.
              </p>
            </div>

            <div className="glass-card feature-card">
              <div className="feature-icon bg-rose">
                <FileCheck2 size={24} color="#e11d48" />
              </div>
              <h3>Blockchain Auditability</h3>
              <p>
                Every disbursement produces an immutable proof transaction logged on Midnight ledger for permanent proof of payment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-tagline">Step-by-step process</span>
            <h2 className="section-title">How Confidential Payroll Works</h2>
            <p className="section-description">
              A 4-step workflow combining local client witness generation with Midnight Network ledger settlement.
            </p>
          </div>

          <div className="workflow-steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <h4>Employee Payroll Input</h4>
              <p>HR inputs base salary, bonuses, and tax withholdings into the local private workspace.</p>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>
              <h4>ZK Verification</h4>
              <p>The client constructs a zero-knowledge witness and executes local SNARK proof generation.</p>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>
              <h4>Compact Contract Validation</h4>
              <p>The Compact smart contract verifies math constraints against public parameters on Midnight.</p>
            </div>

            <div className="step-card">
              <div className="step-number">04</div>
              <h4>Secure Ledger Record</h4>
              <p>Public total disbursed amount updates atomically, while individual salaries stay completely secret.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="section-padding bg-light-gradient">
        <div className="container">
          <div className="section-header">
            <span className="section-tagline">Target Applications</span>
            <h2 className="section-title">Designed for Modern Organizations</h2>
            <p className="section-description">
              Empowering diverse teams with privacy-first financial operations.
            </p>
          </div>

          <div className="use-cases-grid">
            <div className="glass-card use-case-card">
              <Building2 size={28} color="#4f46e5" />
              <h4>Enterprise HR Teams</h4>
              <p>Streamline corporate payroll disbursements while protecting compensation confidentiality from internal leaks.</p>
            </div>

            <div className="glass-card use-case-card">
              <FileSpreadsheet size={28} color="#2563eb" />
              <h4>Payroll Departments</h4>
              <p>Execute monthly net payments and automated partner revenue splits with cryptographic precision.</p>
            </div>

            <div className="glass-card use-case-card">
              <Building size={28} color="#059669" />
              <h4>Payroll Vendors</h4>
              <p>Offer privacy-preserving payroll-as-a-service solutions to multi-national corporate clients.</p>
            </div>

            <div className="glass-card use-case-card">
              <Scale size={28} color="#9333ea" />
              <h4>Compliance Auditors</h4>
              <p>Instantly audit payroll totals and verify tax withholdings without exposing individual employee compensation.</p>
            </div>

            <div className="glass-card use-case-card">
              <ShieldCheck size={28} color="#0284c7" />
              <h4>Government Payroll Systems</h4>
              <p>Safeguard sensitive public sector payroll budgets against surveillance and unauthorized data access.</p>
            </div>

            <div className="glass-card use-case-card">
              <Users size={28} color="#e11d48" />
              <h4>Large Organizations</h4>
              <p>Scale confidential compensation across thousands of remote employees across international boundaries.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-tagline">Technical Architecture</span>
            <h2 className="section-title">Zero-Knowledge Stack</h2>
            <p className="section-description">
              End-to-end integration between React frontend, ZK Prover, Compact Smart Contract, and Midnight Ledger.
            </p>
          </div>

          <div className="architecture-diagram-card glass-card">
            <div className="arch-node arch-frontend">
              <div className="arch-node-title">
                <Cpu size={20} color="#4f46e5" />
                <span>Frontend (React + Vite)</span>
              </div>
              <p>Local Private State & User Workspace</p>
            </div>

            <div className="arch-arrow">↓</div>

            <div className="arch-node arch-zk">
              <div className="arch-node-title">
                <ShieldCheck size={20} color="#059669" />
                <span>ZK Proof Layer</span>
              </div>
              <p>Local Private Witness & Proof Generation</p>
            </div>

            <div className="arch-arrow">↓</div>

            <div className="arch-node arch-compact">
              <div className="arch-node-title">
                <FileCheck2 size={20} color="#9333ea" />
                <span>Compact Contract</span>
              </div>
              <p>On-Chain Circuit State Verification</p>
            </div>

            <div className="arch-arrow">↓</div>

            <div className="arch-node arch-ledger">
              <div className="arch-node-title">
                <Database size={20} color="#0284c7" />
                <span>Midnight Ledger</span>
              </div>
              <p>Immutable Public State & Commitment Hashes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-banner glass-card">
            <h2>Launch Confidential Payroll Workspace</h2>
            <p>
              Experience the power of zero-knowledge privacy for enterprise compensation and revenue splits.
            </p>
            <div className="cta-buttons">
              <Link to="/payroll" className="btn btn-primary btn-lg">
                Go To Payroll Workspace
              </Link>
              <Link to="/dashboard" className="btn btn-secondary btn-lg">
                Go To Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
