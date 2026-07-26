import React, { useState } from 'react';
import { usePayroll } from '../context/PayrollContext';
import {
  History,
  Search,
  Filter,
  Copy,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Layers
} from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const { auditLogs } = usePayroll();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEvent, setFilterEvent] = useState('ALL');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.employeeRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.hash.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterEvent === 'ALL' || log.event === filterEvent;

    return matchesSearch && matchesFilter;
  });

  const handleCopy = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="container page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Audit History & Public Ledger Logs</h1>
          <p className="page-subtitle">
            Searchable and verifiable timeline of zero-knowledge disbursements and employee registrations on Midnight blockchain.
          </p>
        </div>
      </div>

      {/* Table Controls / Toolbar */}
      <div className="glass-card table-toolbar" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div className="search-input-wrapper" style={{ flex: 1, minWidth: '280px' }}>
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            className="table-search-input"
            placeholder="Search by Transaction ID, Employee Ref, Event, or Tx Hash..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} color="var(--text-muted)" />
          <select
            className="form-control"
            style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            value={filterEvent}
            onChange={(e) => setFilterEvent(e.target.value)}
          >
            <option value="ALL">All Event Types</option>
            <option value="ZK Net Salary Disbursed">ZK Net Salary Disbursed</option>
            <option value="ZK Revenue Split Payout">ZK Revenue Split Payout</option>
            <option value="Employee Identity Registered">Employee Identity Registered</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table Card */}
      <div className="glass-card table-card">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Employee Reference</th>
              <th>Verification Event</th>
              <th>Timestamp</th>
              <th>Disclosed Payout</th>
              <th>Status</th>
              <th>Commitment / Tx Hash</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No audit log entries found matching your query.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td className="font-mono font-semibold" style={{ color: '#4f46e5' }}>
                    {log.id}
                  </td>
                  <td className="font-mono font-semibold" style={{ color: '#0f172a' }}>
                    {log.employeeRef}
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#334155' }}>{log.event}</span>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{log.timestamp}</td>
                  <td>
                    {log.amount ? (
                      <span className="font-semibold" style={{ color: '#059669' }}>
                        {log.amount}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>N/A</span>
                    )}
                  </td>
                  <td>
                    <span className="status-tag status-verified">VERIFIED</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <code className="font-mono" style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        {log.hash.slice(0, 16)}...{log.hash.slice(-6)}
                      </code>
                      <button
                        className="btn-icon"
                        onClick={() => handleCopy(log.hash)}
                        title="Copy Tx Hash"
                      >
                        {copiedHash === log.hash ? (
                          <CheckCircle2 size={14} color="#059669" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
