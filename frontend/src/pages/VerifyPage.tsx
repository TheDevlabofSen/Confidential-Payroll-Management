import React, { useState } from 'react';
import { usePayroll } from '../context/PayrollContext';
import {
  ShieldCheck,
  UserCheck,
  Sliders,
  Cpu,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Copy,
  Lock,
  EyeOff
} from 'lucide-react';

export const VerifyPage: React.FC = () => {
  const { walletConnected } = usePayroll();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedEmp, setSelectedEmp] = useState<string>('EMP-1002');
  const [minTenureMonths, setMinTenureMonths] = useState<string>('12');
  const [minSalaryThreshold, setMinSalaryThreshold] = useState<string>('4000');
  const [taxComplianceVerified, setTaxComplianceVerified] = useState<boolean>(true);

  // Verification Simulation State
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verifyProgressMsg, setVerifyProgressMsg] = useState<string>('');
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    proofHash: string;
    timestamp: string;
    details: string;
  } | null>(null);

  const [copiedHash, setCopiedHash] = useState<boolean>(false);

  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleRunVerification = async () => {
    setIsVerifying(true);
    setVerifyProgressMsg('Step 1/3: Reading encrypted employee identity commitment...');
    await new Promise((r) => setTimeout(r, 1000));

    setVerifyProgressMsg('Step 2/3: Constructing ZK Range Proof (Salary >= Threshold & Tax Active)...');
    await new Promise((r) => setTimeout(r, 1600));

    setVerifyProgressMsg('Step 3/3: Submitting proof to Midnight Compact smart contract...');
    await new Promise((r) => setTimeout(r, 1400));

    setIsVerifying(false);
    setVerificationResult({
      success: true,
      proofHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      details: `Employee ${selectedEmp} cryptographically proven to meet minimum salary threshold (${minSalaryThreshold} tNIGHT/mo) and ${minTenureMonths} months tenure without disclosing exact compensation figures.`
    });
    setCurrentStep(5);
  };

  const resetWizard = () => {
    setCurrentStep(1);
    setVerificationResult(null);
  };

  const copyProofHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="container page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Employee Verification Wizard</h1>
          <p className="page-subtitle">
            Generate and validate zero-knowledge credentials for employee income, tenure, and compliance without opening private records.
          </p>
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div className="stepper-bar glass-card">
        <div className={`step-item ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
          <div className="step-circle">1</div>
          <span className="step-label">Employee Selection</span>
        </div>
        <div className="step-line"></div>

        <div className={`step-item ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
          <div className="step-circle">2</div>
          <span className="step-label">Criteria Definition</span>
        </div>
        <div className="step-line"></div>

        <div className={`step-item ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
          <div className="step-circle">3</div>
          <span className="step-label">Generate ZK Proof</span>
        </div>
        <div className="step-line"></div>

        <div className={`step-item ${currentStep >= 4 ? 'active' : ''} ${currentStep > 4 ? 'completed' : ''}`}>
          <div className="step-circle">4</div>
          <span className="step-label">Contract Validation</span>
        </div>
        <div className="step-line"></div>

        <div className={`step-item ${currentStep === 5 ? 'active completed' : ''}`}>
          <div className="step-circle">5</div>
          <span className="step-label">Verification Result</span>
        </div>
      </div>

      {/* Wizard Step Body */}
      <div className="wizard-card-body glass-card">
        {/* STEP 1: Employee Selection */}
        {currentStep === 1 && (
          <div className="wizard-step-content">
            <h2 className="card-section-title">
              <UserCheck size={20} color="#4f46e5" /> Step 1: Select Employee Reference
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Choose an active employee commitment hash or identity reference from the company payroll ledger.
            </p>

            <div className="form-group">
              <label className="form-label">Employee Identity Reference</label>
              <select
                className="form-control"
                value={selectedEmp}
                onChange={(e) => setSelectedEmp(e.target.value)}
              >
                <option value="EMP-1001">Sarah Jenkins (EMP-1001)</option>
                <option value="EMP-1002">Michael Chang (EMP-1002)</option>
                <option value="EMP-1003">Elena Rostova (EMP-1003)</option>
                <option value="EMP-1006">David Kim (EMP-1006)</option>
                <option value="PARTNER-402">Partner Node Delta (PARTNER-402)</option>
              </select>
            </div>

            <div className="info-callout">
              <Lock size={16} color="#4f46e5" />
              <span>
                <strong>Privacy Guaranteed:</strong> Selecting an employee only queries their encrypted commitment hash on Midnight ledger. No raw salary or identity data leaves the client.
              </span>
            </div>

            <div className="wizard-actions">
              <div></div>
              <button className="btn btn-primary" onClick={handleNextStep}>
                Next: Verification Criteria <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Verification Criteria */}
        {currentStep === 2 && (
          <div className="wizard-step-content">
            <h2 className="card-section-title">
              <Sliders size={20} color="#2563eb" /> Step 2: Define Verification Criteria
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Specify range constraints and compliance checks that the zero-knowledge circuit will verify.
            </p>

            <div className="two-column-inputs">
              <div className="form-group">
                <label className="form-label">Minimum Monthly Salary Threshold (tNIGHT)</label>
                <input
                  type="number"
                  className="form-control"
                  value={minSalaryThreshold}
                  onChange={(e) => setMinSalaryThreshold(e.target.value)}
                  placeholder="e.g. 4000"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Minimum Service Tenure (Months)</label>
                <input
                  type="number"
                  className="form-control"
                  value={minTenureMonths}
                  onChange={(e) => setMinTenureMonths(e.target.value)}
                  placeholder="e.g. 12"
                />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={taxComplianceVerified}
                  onChange={(e) => setTaxComplianceVerified(e.target.checked)}
                />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Verify Tax Deduction Compliance (`TaxWithheld &gt; 0`)</span>
              </label>
            </div>

            <div className="wizard-actions">
              <button className="btn btn-secondary" onClick={handlePrevStep}>
                <ArrowLeft size={16} /> Back
              </button>
              <button className="btn btn-primary" onClick={handleNextStep}>
                Next: Generate ZK Proof <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Generate ZK Proof */}
        {currentStep === 3 && (
          <div className="wizard-step-content">
            <h2 className="card-section-title">
              <Cpu size={20} color="#059669" /> Step 3: Construct Zero-Knowledge Proof
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Review the mathematical constraints before launching local SNARK witness construction.
            </p>

            <div className="zk-preview-card" style={{ marginBottom: '1.5rem' }}>
              <div className="zk-line">
                <span>Target Employee Reference:</span>
                <span className="font-mono font-semibold">{selectedEmp}</span>
              </div>
              <div className="zk-line">
                <span>Salary Range Constraint:</span>
                <span className="zk-private-badge">Base Salary ≥ {minSalaryThreshold} tNIGHT (Private)</span>
              </div>
              <div className="zk-line">
                <span>Tenure Constraint:</span>
                <span className="zk-private-badge">Service Tenure ≥ {minTenureMonths} Months</span>
              </div>
              <div className="zk-line">
                <span>Tax Invariant:</span>
                <span className="zk-private-badge">Tax Status == {taxComplianceVerified ? 'COMPLIANT' : 'N/A'}</span>
              </div>
            </div>

            <div className="wizard-actions">
              <button className="btn btn-secondary" onClick={handlePrevStep}>
                <ArrowLeft size={16} /> Back
              </button>
              <button className="btn btn-primary" onClick={handleNextStep}>
                Next: Contract Validation <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Contract Validation */}
        {currentStep === 4 && (
          <div className="wizard-step-content" style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <h2 className="card-section-title" style={{ justifyContent: 'center' }}>
              <FileCheck size={20} color="#9333ea" /> Step 4: Validate Proof On Midnight Smart Contract
            </h2>

            {isVerifying ? (
              <div style={{ margin: '2rem 0' }}>
                <div className="spinner-large" style={{ margin: '0 auto 1.5rem auto' }}></div>
                <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>{verifyProgressMsg}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Executing local SNARK prover...</p>
              </div>
            ) : (
              <div style={{ margin: '1.5rem 0' }}>
                <p style={{ color: 'var(--text-muted)', maxWidth: '540px', margin: '0 auto 1.5rem auto', lineHeight: '1.6' }}>
                  Click below to trigger the Midnight Compact contract circuit validation and submit proof to the ledger.
                </p>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={handleRunVerification}
                >
                  <ShieldCheck size={20} /> Execute ZK Verification Contract
                </button>
              </div>
            )}

            <div className="wizard-actions" style={{ marginTop: '2rem' }}>
              <button className="btn btn-secondary" onClick={handlePrevStep} disabled={isVerifying}>
                <ArrowLeft size={16} /> Back
              </button>
              <div></div>
            </div>
          </div>
        )}

        {/* STEP 5: Verification Result */}
        {currentStep === 5 && verificationResult && (
          <div className="wizard-step-content">
            <div className="verification-success-card">
              <div className="success-icon-wrapper">
                <CheckCircle2 size={48} color="#059669" />
              </div>
              <h2 style={{ fontSize: '1.5rem', color: '#047857', marginTop: '0.5rem', marginBottom: '0.5rem', fontWeight: 800 }}>
                Zero-Knowledge Verification Passed!
              </h2>
              <p style={{ color: '#065f46', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto 1.5rem auto', lineHeight: '1.6' }}>
                {verificationResult.details}
              </p>

              <div className="result-details-grid glass-card">
                <div className="detail-item">
                  <span className="detail-label">Status</span>
                  <span className="status-tag status-verified">VERIFIED & COMPLIANT</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Timestamp</span>
                  <span className="font-mono">{verificationResult.timestamp}</span>
                </div>
                <div className="detail-item" style={{ gridColumn: 'span 2' }}>
                  <span className="detail-label">Immutable Proof Hash</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <code className="font-mono text-indigo" style={{ wordBreak: 'break-all', fontSize: '0.85rem' }}>
                      {verificationResult.proofHash}
                    </code>
                    <button
                      className="btn-icon"
                      onClick={() => copyProofHash(verificationResult.proofHash)}
                      title="Copy Proof Hash"
                    >
                      {copiedHash ? <CheckCircle2 size={16} color="#059669" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
                <button className="btn btn-primary" onClick={resetWizard}>
                  <RotateCcw size={16} /> Verify Another Employee
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
