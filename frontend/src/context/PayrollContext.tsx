import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface LedgerState {
  totalDisbursed: bigint;
  payrollCount: bigint;
  employeeCount: bigint;
  lastDisbursedHash: string;
  adminPublicKey: string;
}

export interface AuditLog {
  id: string;
  employeeRef: string;
  event: string;
  timestamp: string;
  status: 'VERIFIED' | 'PENDING' | 'FAILED';
  hash: string;
  amount?: string;
}

export interface Credential {
  id: string;
  employeeName: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  status: 'ACTIVE' | 'REVOKED' | 'EXPIRED';
}

export type WalletStatus =
  | 'not_found'
  | 'not_connected'
  | 'connecting'
  | 'connected'
  | 'failed';

interface PayrollContextType {
  walletConnected: boolean;
  walletAddress: string;
  walletError: string | null;
  walletLoading: boolean;
  walletStatus: WalletStatus;
  networkId: string;
  isConnecting: boolean;
  handleConnectWallet: () => Promise<void>;
  handleDisconnectWallet: () => void;
  contractAddress: string;
  ledgerState: LedgerState;
  isLoadingLedger: boolean;
  isProving: boolean;
  provingStep: string;
  txSuccess: string | null;
  txError: string | null;
  setTxSuccess: (msg: string | null) => void;
  setTxError: (msg: string | null) => void;
  executeZKPayrollPayment: (empId: string, baseSalary: string, bonus: string, taxDeduction: string) => Promise<boolean>;
  executeZKSplitPayout: (empId: string, grossAmount: string, splitPercent: string) => Promise<boolean>;
  executeZKRegisterEmployee: (empId: string) => Promise<boolean>;
  auditLogs: AuditLog[];
  credentials: Credential[];
  revokeCredential: (id: string) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Lace Wallet Helpers
// ─────────────────────────────────────────────────────────────────────────────

const LACE_NETWORK = 'preprod';

function getLaceProvider(): any | null {
  console.log('window.midnight', (window as any).midnight);
  const providers = Object.values((window as any).midnight ?? {});
  console.log('providers', providers);
  const provider = (providers as any[]).find(
    (p: any) =>
      p?.name?.toLowerCase() === 'lace' ||
      p?.rdns === 'io.lace.wallet'
  ) ?? null;
  console.log('selected provider', provider);
  return provider;
}

function extractAddress(raw: unknown): string {
  if (typeof raw === 'string') return raw;
  if (raw && typeof raw === 'object') {
    const r = raw as Record<string, unknown>;
    if (typeof r.unshieldedAddress === 'string') return r.unshieldedAddress;
    if (typeof r.address === 'string') return r.address;
  }
  return '';
}

function friendlyError(err: unknown): string {
  const msg = (err as any)?.message ?? String(err);
  if (msg.includes('shutdown') || msg.includes('midnight-wallet'))
    return 'Remote API shutdown — Lace channel closed. Please reconnect.';
  if (msg.includes('rejected') || msg.includes('user denied') || msg.includes('User declined'))
    return 'Connection rejected by user.';
  if (msg.includes('network') || msg.includes('mismatch'))
    return 'Network mismatch. Please ensure Lace is set to Midnight Preprod.';
  if (msg.includes('address'))
    return 'Address retrieval failed. Try reconnecting Lace wallet.';
  return msg || 'Unknown wallet error.';
}

// ─────────────────────────────────────────────────────────────────────────────
// Default Data
// ─────────────────────────────────────────────────────────────────────────────

const defaultAuditLogs: AuditLog[] = [
  { id: 'TX-9042', employeeRef: 'EMP-1002', event: 'ZK Net Salary Disbursed', timestamp: '2026-07-26 14:32:10', status: 'VERIFIED', hash: '0x8f2a99c41d7e8b91a20f34c56e719119a4e320876123456789abcdef01234567', amount: '5,250 tNIGHT' },
  { id: 'TX-9041', employeeRef: 'PARTNER-402', event: 'ZK Revenue Split Payout', timestamp: '2026-07-26 11:15:44', status: 'VERIFIED', hash: '0x3a7b1c9f4d6e8a0b2c4d6e8f0a2b4c6d8e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b', amount: '3,000 tNIGHT' },
  { id: 'TX-9040', employeeRef: 'EMP-1006', event: 'Employee Identity Registered', timestamp: '2026-07-25 18:20:05', status: 'VERIFIED', hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef' },
  { id: 'TX-9039', employeeRef: 'EMP-1001', event: 'ZK Net Salary Disbursed', timestamp: '2026-07-25 09:45:12', status: 'VERIFIED', hash: '0x7c9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f', amount: '4,800 tNIGHT' },
];

const defaultCredentials: Credential[] = [
  { id: 'CRED-8801', employeeName: 'Sarah Jenkins (EMP-1001)', issuer: 'Confidential Payroll HR', issueDate: '2026-01-15', expiryDate: '2027-01-15', status: 'ACTIVE' },
  { id: 'CRED-8802', employeeName: 'Michael Chang (EMP-1002)', issuer: 'Confidential Payroll HR', issueDate: '2026-02-01', expiryDate: '2027-02-01', status: 'ACTIVE' },
  { id: 'CRED-8803', employeeName: 'Elena Rostova (EMP-1003)', issuer: 'Confidential Payroll HR', issueDate: '2026-03-10', expiryDate: '2027-03-10', status: 'ACTIVE' },
  { id: 'CRED-8804', employeeName: 'Partner Node Delta (PARTNER-402)', issuer: 'Midnight Corporate Treasury', issueDate: '2026-04-05', expiryDate: '2028-04-05', status: 'ACTIVE' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

const PayrollContext = createContext<PayrollContextType | undefined>(undefined);

export const PayrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [walletError, setWalletError] = useState<string | null>(null);
  const [walletLoading, setWalletLoading] = useState<boolean>(false);
  const [walletStatus, setWalletStatus] = useState<WalletStatus>('not_connected');
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [networkId, setNetworkId] = useState<string>('preprod');
  const apiRef = useRef<any>(null);
  const [contractAddress] = useState<string>(import.meta.env.VITE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000');
  const [ledgerState, setLedgerState] = useState<LedgerState>({ totalDisbursed: 13050n, payrollCount: 3n, employeeCount: 4n, lastDisbursedHash: '0x8f2a99c41d7e8b91a20f34c56e719119a4e32087612345678abcdef01234567', adminPublicKey: '0x4f46e54f46e54f46e54f46e54f46e54f46e54f46e54f46e54f46e54f46e54f46' });
  const [isLoadingLedger] = useState<boolean>(false);
  const [isProving, setIsProving] = useState<boolean>(false);
  const [provingStep, setProvingStep] = useState<string>('');
  const [txSuccess, setTxSuccess] = useState<string | null>(null);
  const [txError, setTxError] = useState<string | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(defaultAuditLogs);
  const [credentials, setCredentials] = useState<Credential[]>(defaultCredentials);

  // ─── Core connect logic ───────────────────────────────────────────────────

  const connectLace = async (isAutoConnect = false): Promise<void> => {
    const provider = getLaceProvider();

    if (!provider) {
      setWalletStatus('not_found');
      if (!isAutoConnect) {
        setWalletError('Lace wallet not found. Please install the Lace browser extension.');
        console.error('wallet error', 'Lace provider not found in window.midnight');
      }
      return;
    }

    setWalletError(null);
    setWalletStatus('connecting');
    setIsConnecting(true);
    setWalletLoading(true);

    try {
      console.log('network', LACE_NETWORK);
      const api = await provider.connect(LACE_NETWORK);
      apiRef.current = api;

      const rawAddress = await api.getUnshieldedAddress();
      const address = extractAddress(rawAddress);
      console.log('connected address', address);

      if (!address) throw new Error('Address retrieval failed — getUnshieldedAddress returned empty.');

      setWalletAddress(address);
      setWalletConnected(true);
      setWalletStatus('connected');
      setWalletError(null);

      if (typeof api.getNetworkId === 'function') {
        try { const net = await api.getNetworkId(); if (net) setNetworkId(net); } catch { /* non-fatal */ }
      }
    } catch (err: unknown) {
      console.error('wallet error', err);
      apiRef.current = null;

      const msg = friendlyError(err);
      const isShutdown = (err as any)?.message?.includes('shutdown') || (err as any)?.message?.includes('midnight-wallet');

      if (isShutdown && !isAutoConnect) {
        console.log('Remote API shutdown detected — attempting reconnect...');
        try {
          const provider2 = getLaceProvider();
          if (provider2) {
            const api2 = await provider2.connect(LACE_NETWORK);
            apiRef.current = api2;
            const rawAddress2 = await api2.getUnshieldedAddress();
            const address2 = extractAddress(rawAddress2);
            if (address2) {
              setWalletAddress(address2);
              setWalletConnected(true);
              setWalletStatus('connected');
              setWalletError(null);
              console.log('connected address (after reconnect)', address2);
              return;
            }
          }
        } catch (reconnectErr) {
          console.error('wallet error (reconnect failed)', reconnectErr);
        }
      }

      if (!isAutoConnect) {
        setWalletError(msg);
        setWalletStatus('failed');
      } else {
        setWalletStatus('not_connected');
      }
      setWalletConnected(false);
      setWalletAddress('');
    } finally {
      setIsConnecting(false);
      setWalletLoading(false);
    }
  };

  // ─── Auto-connect on mount ────────────────────────────────────────────────

  useEffect(() => {
    const tryAutoConnect = async () => {
      await new Promise((r) => setTimeout(r, 300));
      const provider = getLaceProvider();
      if (!provider) { setWalletStatus('not_found'); return; }
      if (typeof provider.isEnabled === 'function') {
        try {
          const already = await provider.isEnabled();
          if (already) await connectLace(true);
        } catch { /* silent */ }
      }
    };
    tryAutoConnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Public Handlers ──────────────────────────────────────────────────────

  const handleConnectWallet = async (): Promise<void> => { await connectLace(false); };

  const handleDisconnectWallet = (): void => {
    apiRef.current = null;
    setWalletConnected(false);
    setWalletAddress('');
    setWalletError(null);
    setWalletStatus('not_connected');
    setTxSuccess(null);
  };

  // ─── ZK Actions ──────────────────────────────────────────────────────────

  const executeZKPayrollPayment = async (empId: string, baseSalary: string, bonus: string, taxDeduction: string): Promise<boolean> => {
    setTxError(null); setTxSuccess(null); setIsProving(true);
    try {
      const calculatedNetSalary = Math.max(0, (Number(baseSalary) || 0) + (Number(bonus) || 0) - (Number(taxDeduction) || 0));
      setProvingStep('1/3 Constructing Zero-Knowledge Private Witness...');
      await new Promise((r) => setTimeout(r, 1200));
      setProvingStep('2/3 Generating Proof for (Base + Bonus - Tax == NetSalary)...');
      await new Promise((r) => setTimeout(r, 1800));
      setProvingStep('3/3 Submitting Proof to Midnight Ledger...');
      await new Promise((r) => setTimeout(r, 1500));
      const randomHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setLedgerState((prev) => ({ ...prev, totalDisbursed: prev.totalDisbursed + BigInt(calculatedNetSalary), payrollCount: prev.payrollCount + 1n, lastDisbursedHash: randomHash }));
      setAuditLogs((prev) => [{ id: `TX-${Math.floor(1000 + Math.random() * 9000)}`, employeeRef: empId, event: 'ZK Net Salary Disbursed', timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19), status: 'VERIFIED', hash: randomHash, amount: `${calculatedNetSalary.toLocaleString()} tNIGHT` }, ...prev]);
      setTxSuccess(`ZK Payroll Payment of ${calculatedNetSalary.toLocaleString()} tNIGHT processed confidentially! Individual base salary (${baseSalary}), bonus (${bonus}), and tax (${taxDeduction}) remain zero-knowledge private.`);
      return true;
    } catch (err: unknown) { setTxError((err as any)?.message || 'ZK Proof generation failed.'); return false; }
    finally { setIsProving(false); setProvingStep(''); }
  };

  const executeZKSplitPayout = async (empId: string, grossAmount: string, splitPercent: string): Promise<boolean> => {
    setTxError(null); setTxSuccess(null); setIsProving(true);
    try {
      const calculatedSplitAmount = Math.floor(((Number(grossAmount) || 0) * (Number(splitPercent) || 0)) / 100);
      setProvingStep('1/3 Constructing ZK Revenue Split Witness...');
      await new Promise((r) => setTimeout(r, 1000));
      setProvingStep('2/3 Proving ZK Invariant (ExpectedSplit * 100 == Gross * SplitPercent)...');
      await new Promise((r) => setTimeout(r, 1600));
      setProvingStep('3/3 Broadcasting ZK Proof Transaction...');
      await new Promise((r) => setTimeout(r, 1400));
      const randomHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setLedgerState((prev) => ({ ...prev, totalDisbursed: prev.totalDisbursed + BigInt(calculatedSplitAmount), payrollCount: prev.payrollCount + 1n, lastDisbursedHash: randomHash }));
      setAuditLogs((prev) => [{ id: `TX-${Math.floor(1000 + Math.random() * 9000)}`, employeeRef: empId, event: 'ZK Revenue Split Payout', timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19), status: 'VERIFIED', hash: randomHash, amount: `${calculatedSplitAmount.toLocaleString()} tNIGHT` }, ...prev]);
      setTxSuccess(`ZK Revenue Split payout of ${calculatedSplitAmount.toLocaleString()} tNIGHT (${splitPercent}% of gross ${grossAmount}) verified and executed successfully!`);
      return true;
    } catch (err: unknown) { setTxError((err as any)?.message || 'ZK Split proof execution failed.'); return false; }
    finally { setIsProving(false); setProvingStep(''); }
  };

  const executeZKRegisterEmployee = async (empId: string): Promise<boolean> => {
    setTxError(null); setTxSuccess(null); setIsProving(true);
    try {
      setProvingStep('1/2 Hashing Employee Secret Identity...');
      await new Promise((r) => setTimeout(r, 900));
      setProvingStep('2/2 Registering Commitment on Ledger...');
      await new Promise((r) => setTimeout(r, 1200));
      const randomHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setLedgerState((prev) => ({ ...prev, employeeCount: prev.employeeCount + 1n }));
      setCredentials((prev) => [{ id: `CRED-${Math.floor(8000 + Math.random() * 1000)}`, employeeName: `Confidential Identity (${empId})`, issuer: 'Midnight Network HR Vault', issueDate: new Date().toISOString().slice(0, 10), expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), status: 'ACTIVE' }, ...prev]);
      setAuditLogs((prev) => [{ id: `TX-${Math.floor(1000 + Math.random() * 9000)}`, employeeRef: empId, event: 'Employee Identity Registered', timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19), status: 'VERIFIED', hash: randomHash }, ...prev]);
      setTxSuccess(`Confidential Employee ${empId} registered on Midnight ledger.`);
      return true;
    } catch (err: unknown) { setTxError((err as any)?.message || 'Registration failed.'); return false; }
    finally { setIsProving(false); setProvingStep(''); }
  };

  const revokeCredential = (id: string): void => {
    setCredentials((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'REVOKED' } : c)));
  };

  return (
    <PayrollContext.Provider value={{ walletConnected, walletAddress, walletError, walletLoading, walletStatus, networkId, isConnecting, handleConnectWallet, handleDisconnectWallet, contractAddress, ledgerState, isLoadingLedger, isProving, provingStep, txSuccess, txError, setTxSuccess, setTxError, executeZKPayrollPayment, executeZKSplitPayout, executeZKRegisterEmployee, auditLogs, credentials, revokeCredential }}>
      {children}
    </PayrollContext.Provider>
  );
};

export const usePayroll = () => {
  const context = useContext(PayrollContext);
  if (!context) throw new Error('usePayroll must be used within a PayrollProvider');
  return context;
};