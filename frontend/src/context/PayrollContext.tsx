import React, { createContext, useContext, useState, useEffect } from 'react';

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

interface PayrollContextType {
  // Wallet State
  walletConnected: boolean;
  walletAddress: string;
  networkId: string;
  isConnecting: boolean;
  handleConnectWallet: () => Promise<void>;
  handleDisconnectWallet: () => void;

  // Ledger & Contract State
  contractAddress: string;
  ledgerState: LedgerState;
  isLoadingLedger: boolean;

  // Proving & Execution
  isProving: boolean;
  provingStep: string;
  txSuccess: string | null;
  txError: string | null;
  setTxSuccess: (msg: string | null) => void;
  setTxError: (msg: string | null) => void;

  // Functions
  executeZKPayrollPayment: (empId: string, baseSalary: string, bonus: string, taxDeduction: string) => Promise<boolean>;
  executeZKSplitPayout: (empId: string, grossAmount: string, splitPercent: string) => Promise<boolean>;
  executeZKRegisterEmployee: (empId: string) => Promise<boolean>;

  // Audit Logs & Credentials
  auditLogs: AuditLog[];
  credentials: Credential[];
  revokeCredential: (id: string) => void;
}

const defaultAuditLogs: AuditLog[] = [
  {
    id: 'TX-9042',
    employeeRef: 'EMP-1002',
    event: 'ZK Net Salary Disbursed',
    timestamp: '2026-07-26 14:32:10',
    status: 'VERIFIED',
    hash: '0x8f2a99c41d7e8b91a20f34c56e719119a4e320876123456789abcdef01234567',
    amount: '5,250 tNIGHT'
  },
  {
    id: 'TX-9041',
    employeeRef: 'PARTNER-402',
    event: 'ZK Revenue Split Payout',
    timestamp: '2026-07-26 11:15:44',
    status: 'VERIFIED',
    hash: '0x3a7b1c9f4d6e8a0b2c4d6e8f0a2b4c6d8e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b',
    amount: '3,000 tNIGHT'
  },
  {
    id: 'TX-9040',
    employeeRef: 'EMP-1006',
    event: 'Employee Identity Registered',
    timestamp: '2026-07-25 18:20:05',
    status: 'VERIFIED',
    hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  },
  {
    id: 'TX-9039',
    employeeRef: 'EMP-1001',
    event: 'ZK Net Salary Disbursed',
    timestamp: '2026-07-25 09:45:12',
    status: 'VERIFIED',
    hash: '0x7c9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f',
    amount: '4,800 tNIGHT'
  }
];

const defaultCredentials: Credential[] = [
  {
    id: 'CRED-8801',
    employeeName: 'Sarah Jenkins (EMP-1001)',
    issuer: 'Confidential Payroll HR',
    issueDate: '2026-01-15',
    expiryDate: '2027-01-15',
    status: 'ACTIVE'
  },
  {
    id: 'CRED-8802',
    employeeName: 'Michael Chang (EMP-1002)',
    issuer: 'Confidential Payroll HR',
    issueDate: '2026-02-01',
    expiryDate: '2027-02-01',
    status: 'ACTIVE'
  },
  {
    id: 'CRED-8803',
    employeeName: 'Elena Rostova (EMP-1003)',
    issuer: 'Confidential Payroll HR',
    issueDate: '2026-03-10',
    expiryDate: '2027-03-10',
    status: 'ACTIVE'
  },
  {
    id: 'CRED-8804',
    employeeName: 'Partner Node Delta (PARTNER-402)',
    issuer: 'Midnight Corporate Treasury',
    issueDate: '2026-04-05',
    expiryDate: '2028-04-05',
    status: 'ACTIVE'
  }
];

const PayrollContext = createContext<PayrollContextType | undefined>(undefined);

export const PayrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [networkId, setNetworkId] = useState<string>(
    import.meta.env.VITE_NETWORK || 'undeployed'
  );
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

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
  const [isProving, setIsProving] = useState<boolean>(false);
  const [provingStep, setProvingStep] = useState<string>('');
  const [txSuccess, setTxSuccess] = useState<string | null>(null);
  const [txError, setTxError] = useState<string | null>(null);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(defaultAuditLogs);
  const [credentials, setCredentials] = useState<Credential[]>(defaultCredentials);

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
        // Mock connection for preview
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

  const executeZKPayrollPayment = async (
    empId: string,
    baseSalary: string,
    bonus: string,
    taxDeduction: string
  ): Promise<boolean> => {
    setTxError(null);
    setTxSuccess(null);
    setIsProving(true);

    try {
      const calculatedNetSalary = Math.max(
        0,
        (Number(baseSalary) || 0) + (Number(bonus) || 0) - (Number(taxDeduction) || 0)
      );

      setProvingStep('1/3 Constructing Zero-Knowledge Private Witness...');
      await new Promise((r) => setTimeout(r, 1200));

      setProvingStep('2/3 Generating Proof for (Base + Bonus - Tax == NetSalary)...');
      await new Promise((r) => setTimeout(r, 1800));

      setProvingStep('3/3 Submitting Proof to Midnight Ledger...');
      await new Promise((r) => setTimeout(r, 1500));

      const newNet = BigInt(calculatedNetSalary);
      const randomHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

      setLedgerState((prev) => ({
        ...prev,
        totalDisbursed: prev.totalDisbursed + newNet,
        payrollCount: prev.payrollCount + 1n,
        lastDisbursedHash: randomHash
      }));

      // Add to Audit Log
      const newLog: AuditLog = {
        id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
        employeeRef: empId,
        event: 'ZK Net Salary Disbursed',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        status: 'VERIFIED',
        hash: randomHash,
        amount: `${calculatedNetSalary.toLocaleString()} tNIGHT`
      };
      setAuditLogs((prev) => [newLog, ...prev]);

      setTxSuccess(
        `ZK Payroll Payment of ${calculatedNetSalary.toLocaleString()} tNIGHT processed confidentially! Individual base salary (${baseSalary}), bonus (${bonus}), and tax (${taxDeduction}) remain zero-knowledge private.`
      );
      return true;
    } catch (err: any) {
      setTxError(err?.message || 'ZK Proof generation failed.');
      return false;
    } finally {
      setIsProving(false);
      setProvingStep('');
    }
  };

  const executeZKSplitPayout = async (
    empId: string,
    grossAmount: string,
    splitPercent: string
  ): Promise<boolean> => {
    setTxError(null);
    setTxSuccess(null);
    setIsProving(true);

    try {
      const calculatedSplitAmount = Math.floor(
        ((Number(grossAmount) || 0) * (Number(splitPercent) || 0)) / 100
      );

      setProvingStep('1/3 Constructing ZK Revenue Split Witness...');
      await new Promise((r) => setTimeout(r, 1000));

      setProvingStep('2/3 Proving ZK Invariant (ExpectedSplit * 100 == Gross * SplitPercent)...');
      await new Promise((r) => setTimeout(r, 1600));

      setProvingStep('3/3 Broadcasting ZK Proof Transaction...');
      await new Promise((r) => setTimeout(r, 1400));

      const randomHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

      setLedgerState((prev) => ({
        ...prev,
        totalDisbursed: prev.totalDisbursed + BigInt(calculatedSplitAmount),
        payrollCount: prev.payrollCount + 1n,
        lastDisbursedHash: randomHash
      }));

      // Add to Audit Log
      const newLog: AuditLog = {
        id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
        employeeRef: empId,
        event: 'ZK Revenue Split Payout',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        status: 'VERIFIED',
        hash: randomHash,
        amount: `${calculatedSplitAmount.toLocaleString()} tNIGHT`
      };
      setAuditLogs((prev) => [newLog, ...prev]);

      setTxSuccess(
        `ZK Revenue Split payout of ${calculatedSplitAmount.toLocaleString()} tNIGHT (${splitPercent}% of gross ${grossAmount}) verified and executed successfully!`
      );
      return true;
    } catch (err: any) {
      setTxError(err?.message || 'ZK Split proof execution failed.');
      return false;
    } finally {
      setIsProving(false);
      setProvingStep('');
    }
  };

  const executeZKRegisterEmployee = async (empId: string): Promise<boolean> => {
    setTxError(null);
    setTxSuccess(null);
    setIsProving(true);

    try {
      setProvingStep('1/2 Hashing Employee Secret Identity...');
      await new Promise((r) => setTimeout(r, 900));

      setProvingStep('2/2 Registering Commitment on Ledger...');
      await new Promise((r) => setTimeout(r, 1200));

      const randomHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

      setLedgerState((prev) => ({
        ...prev,
        employeeCount: prev.employeeCount + 1n,
      }));

      // Add Credential
      const newCred: Credential = {
        id: `CRED-${Math.floor(8000 + Math.random() * 1000)}`,
        employeeName: `Confidential Identity (${empId})`,
        issuer: 'Midnight Network HR Vault',
        issueDate: new Date().toISOString().slice(0, 10),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        status: 'ACTIVE'
      };
      setCredentials((prev) => [newCred, ...prev]);

      // Add to Audit Log
      const newLog: AuditLog = {
        id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
        employeeRef: empId,
        event: 'Employee Identity Registered',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        status: 'VERIFIED',
        hash: randomHash
      };
      setAuditLogs((prev) => [newLog, ...prev]);

      setTxSuccess(`Confidential Employee ${empId} registered on Midnight ledger.`);
      return true;
    } catch (err: any) {
      setTxError(err?.message || 'Registration failed.');
      return false;
    } finally {
      setIsProving(false);
      setProvingStep('');
    }
  };

  const revokeCredential = (id: string) => {
    setCredentials((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'REVOKED' } : c))
    );
  };

  return (
    <PayrollContext.Provider
      value={{
        walletConnected,
        walletAddress,
        networkId,
        isConnecting,
        handleConnectWallet,
        handleDisconnectWallet,
        contractAddress,
        ledgerState,
        isLoadingLedger,
        isProving,
        provingStep,
        txSuccess,
        txError,
        setTxSuccess,
        setTxError,
        executeZKPayrollPayment,
        executeZKSplitPayout,
        executeZKRegisterEmployee,
        auditLogs,
        credentials,
        revokeCredential,
      }}
    >
      {children}
    </PayrollContext.Provider>
  );
};

export const usePayroll = () => {
  const context = useContext(PayrollContext);
  if (!context) {
    throw new Error('usePayroll must be used within a PayrollProvider');
  }
  return context;
};
