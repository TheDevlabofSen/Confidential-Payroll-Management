export interface LaceWallet {
  name: string;
  apiVersion: string;
  icon: string;
  enable: () => Promise<LaceWalletApi>;
  isEnabled: () => Promise<boolean>;
}

export interface LaceWalletApi {
  getUnshieldedAddress: () => Promise<string>;
  getShieldedAddress: () => Promise<string>;
  getNetworkId: () => Promise<string>;
  submitTx: (tx: any) => Promise<string>;
}

declare global {
  interface Window {
    midnight?: {
      lace?: LaceWallet;
    };
  }
}
