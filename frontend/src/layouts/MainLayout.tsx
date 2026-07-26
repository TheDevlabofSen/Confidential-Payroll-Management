import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { usePayroll } from '../context/PayrollContext';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export const MainLayout: React.FC = () => {
  const { txSuccess, txError, setTxSuccess, setTxError } = usePayroll();

  return (
    <div className="app-wrapper">
      <Header />

      {/* Global Feedback Banners */}
      <div className="container" style={{ paddingTop: '1.25rem' }}>
        {txSuccess && (
          <div className="glass-card banner-success">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flex: 1 }}>
                <CheckCircle2 size={20} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: '#047857' }}>Zero-Knowledge Transaction Confirmed!</strong>
                  <p style={{ marginTop: '0.25rem', fontSize: '0.9rem', color: '#065f46' }}>{txSuccess}</p>
                </div>
              </div>
              <button className="icon-only-btn" onClick={() => setTxSuccess(null)}>
                <X size={16} color="#047857" />
              </button>
            </div>
          </div>
        )}

        {txError && (
          <div className="glass-card banner-error">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flex: 1 }}>
                <AlertCircle size={20} color="#e11d48" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: '#be123c' }}>Execution Notice</strong>
                  <p style={{ marginTop: '0.25rem', fontSize: '0.9rem', color: '#9f1239' }}>{txError}</p>
                </div>
              </div>
              <button className="icon-only-btn" onClick={() => setTxError(null)}>
                <X size={16} color="#be123c" />
              </button>
            </div>
          </div>
        )}
      </div>

      <main className="main-content">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};
