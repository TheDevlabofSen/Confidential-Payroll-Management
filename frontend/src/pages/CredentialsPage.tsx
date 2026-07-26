import React, { useState } from 'react';
import { usePayroll, Credential } from '../context/PayrollContext';
import {
  Award,
  ShieldCheck,
  Eye,
  Download,
  Trash2,
  Lock,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  X,
  Copy
} from 'lucide-react';

export const CredentialsPage: React.FC = () => {
  const { credentials, revokeCredential } = usePayroll();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCred, setSelectedCred] = useState<Credential | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredCreds = credentials.filter(
    (c) =>
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.issuer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = (cred: Credential) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(cred, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${cred.id}_credential.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="container page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Credential Vault</h1>
          <p className="page-subtitle">
            Manage verifiable zero-knowledge credentials issued for employee identities and employment verification.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-card table-toolbar" style={{ marginBottom: '1.5rem' }}>
        <div className="search-input-wrapper">
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            className="table-search-input"
            placeholder="Search credentials by ID, employee name, or issuer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          Showing {filteredCreds.length} of {credentials.length} Credentials
        </div>
      </div>

      {/* Table Card */}
      <div className="glass-card table-card">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Credential ID</th>
              <th>Employee Name / Reference</th>
              <th>Issuer Authority</th>
              <th>Issue Date</th>
              <th>Expiry Date</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCreds.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No credentials found matching your search.
                </td>
              </tr>
            ) : (
              filteredCreds.map((cred) => (
                <tr key={cred.id}>
                  <td className="font-mono font-semibold" style={{ color: '#4f46e5' }}>
                    {cred.id}
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>{cred.employeeName}</span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{cred.issuer}</td>
                  <td style={{ fontSize: '0.875rem' }}>{cred.issueDate}</td>
                  <td style={{ fontSize: '0.875rem' }}>{cred.expiryDate}</td>
                  <td>
                    <span
                      className={`status-tag ${
                        cred.status === 'ACTIVE'
                          ? 'status-verified'
                          : cred.status === 'REVOKED'
                          ? 'status-revoked'
                          : 'status-pending'
                      }`}
                    >
                      {cred.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button
                        className="btn-icon-action"
                        onClick={() => setSelectedCred(cred)}
                        title="View Credential Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="btn-icon-action"
                        onClick={() => handleExport(cred)}
                        title="Export JSON Credential"
                      >
                        <Download size={16} />
                      </button>
                      {cred.status === 'ACTIVE' && (
                        <button
                          className="btn-icon-action danger"
                          onClick={() => revokeCredential(cred.id)}
                          title="Revoke Credential"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Credential Details Modal */}
      {selectedCred && (
        <div className="modal-overlay" onClick={() => setSelectedCred(null)}>
          <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={22} color="#4f46e5" />
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>
                  Verifiable Credential Inspection
                </h3>
              </div>
              <button className="icon-only-btn" onClick={() => setSelectedCred(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body" style={{ marginTop: '1rem' }}>
              <div className="credential-spec-card">
                <div className="spec-row">
                  <span className="spec-label">Credential ID:</span>
                  <span className="font-mono font-semibold" style={{ color: '#4f46e5' }}>
                    {selectedCred.id}
                  </span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Subject Name:</span>
                  <span className="font-semibold">{selectedCred.employeeName}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Issuing Authority:</span>
                  <span>{selectedCred.issuer}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Issue Date:</span>
                  <span>{selectedCred.issueDate}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Expiry Date:</span>
                  <span>{selectedCred.expiryDate}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Privacy Guarantee:</span>
                  <span className="badge-shielded">
                    <Lock size={12} /> Confidential Salary Values Hidden
                  </span>
                </div>
              </div>

              <div className="info-callout" style={{ marginTop: '1.25rem' }}>
                <ShieldCheck size={16} color="#059669" />
                <span>
                  This credential is cryptographically anchored to Midnight Network zero-knowledge proof state. Verifiers can validate employment without seeing confidential salary amounts.
                </span>
              </div>
            </div>

            <div className="modal-footer" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button className="btn btn-secondary" onClick={() => handleExport(selectedCred)}>
                <Download size={16} /> Export Credential JSON
              </button>
              <button className="btn btn-primary" onClick={() => setSelectedCred(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
