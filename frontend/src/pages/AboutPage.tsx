import React from 'react';
import {
  Info,
  ShieldCheck,
  AlertTriangle,
  Cpu,
  Layers,
  CheckCircle2,
  ExternalLink,
  Code2,
  Box,
  Container,
  Zap
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="container page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">About Confidential Payroll Management</h1>
          <p className="page-subtitle">
            Enterprise zero-knowledge payroll platform designed for Midnight Network Hackathon.
          </p>
        </div>
      </div>

      {/* Overview & Problem Statement Grid */}
      <div className="two-column-grid" style={{ marginBottom: '2rem' }}>
        <div className="glass-card">
          <h2 className="card-section-title">
            <Info size={20} color="#4f46e5" /> Project Overview
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '1rem' }}>
            <strong>Confidential Payroll Management</strong> is a flagship Midnight Network application designed to solve the fundamental conflict between enterprise compensation confidentiality and public blockchain auditability.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.7' }}>
            By leveraging Midnight's dual state model (private witness state and public ledger state) alongside Compact zero-knowledge contracts, companies can disburse net salaries, withhold taxes, and settle partner revenue splits with complete privacy.
          </p>
        </div>

        <div className="glass-card">
          <h2 className="card-section-title">
            <AlertTriangle size={20} color="#e11d48" /> Payroll Privacy Challenges
          </h2>
          <ul className="about-list-items">
            <li>
              <strong>Internal Salary Friction:</strong> Public compensation data leads to workplace dissatisfaction and unauthorized disclosure of performance incentives.
            </li>
            <li>
              <strong>Competitor Poaching:</strong> Transparent salary registers enable competitors to target key technical talent with exact compensation matching.
            </li>
            <li>
              <strong>Regulatory Vulnerability:</strong> Centralized payroll databases represent high-value honeypots for identity theft and data leaks.
            </li>
          </ul>
        </div>
      </div>

      {/* Solution & Tech Stack Grid */}
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <h2 className="card-section-title">
          <ShieldCheck size={22} color="#059669" /> The Midnight Solution
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
          Our solution executes SNARK proof generation directly inside the user's browser / client environment. Only the mathematical proof and public state changes (like total volume disbursed) are broadcast to the Midnight network node.
        </p>

        <div className="architecture-summary-grid">
          <div className="arch-box">
            <h4>1. Private Local Witness</h4>
            <p>Salary inputs, bonus figures, and tax deductions stay on client machine.</p>
          </div>
          <div className="arch-box">
            <h4>2. Zero-Knowledge Circuit</h4>
            <p>Compact compiler compiles ZK circuits into prover key & verifier key pairs.</p>
          </div>
          <div className="arch-box">
            <h4>3. Midnight Ledger Settlement</h4>
            <p>Midnight blockchain nodes verify SNARK proof before accepting ledger updates.</p>
          </div>
        </div>
      </div>

      {/* Tech Stack Display Badges */}
      <div className="glass-card">
        <h2 className="card-section-title">
          <Layers size={22} color="#9333ea" /> Technology Stack
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Built with state-of-the-art zero-knowledge cryptography and modern web frameworks.
        </p>

        <div className="tech-stack-grid">
          <div className="tech-card">
            <div className="tech-icon bg-indigo">
              <ShieldCheck size={24} color="#4f46e5" />
            </div>
            <h4>Midnight Network</h4>
            <p>Privacy-focused blockchain platform with zero-knowledge smart contract support.</p>
          </div>

          <div className="tech-card">
            <div className="tech-icon bg-purple">
              <Code2 size={24} color="#9333ea" />
            </div>
            <h4>Compact Language</h4>
            <p>Midnight domain-specific language for authoring zero-knowledge circuits.</p>
          </div>

          <div className="tech-card">
            <div className="tech-icon bg-blue">
              <Box size={24} color="#2563eb" />
            </div>
            <h4>React 18</h4>
            <p>Modern component framework for fluid, reactive web interfaces.</p>
          </div>

          <div className="tech-card">
            <div className="tech-icon bg-cyan">
              <Zap size={24} color="#0284c7" />
            </div>
            <h4>Vite</h4>
            <p>Next-generation ultra-fast frontend build tooling.</p>
          </div>

          <div className="tech-card">
            <div className="tech-icon bg-emerald">
              <Layers size={24} color="#059669" />
            </div>
            <h4>Tailwind CSS</h4>
            <p>Utility-first design system with sleek light-mode design tokens.</p>
          </div>

          <div className="tech-card">
            <div className="tech-icon bg-rose">
              <Code2 size={24} color="#e11d48" />
            </div>
            <h4>TypeScript</h4>
            <p>Strongly-typed application architecture ensuring runtime safety.</p>
          </div>

          <div className="tech-card">
            <div className="tech-icon bg-indigo">
              <Container size={24} color="#4f46e5" />
            </div>
            <h4>Docker</h4>
            <p>Containerized local proof server & Midnight network node environment.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
