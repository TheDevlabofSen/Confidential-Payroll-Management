// Midnight Lace Wallet Type Definitions
// Provider uses connect("preprod"), NOT enable()

export interface MidnightProvider {
  name: string;
  rdns?: string;
  apiVersion?: string;
  icon?: string;
  connect: (network: string) => Promise<MidnightWalletApi>;
  isEnabled?: () => Promise<boolean>;
}

export interface MidnightWalletApi {
  getUnshieldedAddress: () => Promise<string | { unshieldedAddress?: string; address?: string }>;
  getShieldedAddress?: () => Promise<string>;
  getNetworkId?: () => Promise<string>;
  submitTx?: (tx: unknown) => Promise<string>;
}

declare global {
  interface Window {
    midnight?: Record<string, MidnightProvider>;
  }
}