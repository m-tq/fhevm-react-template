import { BrowserProvider, Eip1193Provider } from 'ethers';
import { createFhevmInstance } from '@fhevm-sdk';

// Network configurations
export const NETWORKS = {
  hardhat: {
    name: 'Hardhat Local',
    chainId: '0x7a69', // 31337
    rpcUrl: 'http://localhost:8545',
    blockExplorer: 'http://localhost:8545',
  },
  sepolia: {
    name: 'Sepolia Testnet',
    chainId: '0xaa36a7', // 11155111
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
    blockExplorer: 'https://sepolia.etherscan.io',
  },
} as const;

export type NetworkName = keyof typeof NETWORKS;

let fhevmInstance: any = null;

/**
 * Initialize FHEVM instance
 */
export async function initializeFhevm(provider: BrowserProvider): Promise<void> {
  try {
    if (!provider) {
      throw new Error('Provider is required');
    }

    // Create abort controller for the instance creation
    const abortController = new AbortController();
    
    // Resolve EIP-1193 provider robustly
    const eip1193Provider: Eip1193Provider = (() => {
      const maybeEip = provider as unknown as Eip1193Provider;
      if (maybeEip && typeof (maybeEip as any).request === 'function') {
        return maybeEip;
      }
      const underlying = (provider as any).provider as Eip1193Provider | undefined;
      if (underlying && typeof (underlying as any).request === 'function') {
        return underlying;
      }
      throw new Error('Invalid provider: missing EIP-1193 request method');
    })();

    // Create FHEVM instance using EIP-1193 provider (window.ethereum compatible)
    fhevmInstance = await createFhevmInstance({
      provider: eip1193Provider,
      signal: abortController.signal,
    });
    
    console.log('FHEVM initialized successfully');
  } catch (error) {
    console.error('Failed to initialize FHEVM:', error);
    throw error;
  }
}

/**
 * Initialize FHEVM instance directly from window.ethereum (fallback)
 */
export async function initializeFhevmWithEthereumProvider(): Promise<void> {
  try {
    if (fhevmInstance) return;

    if (!window.ethereum) {
      throw new Error('window.ethereum is not available');
    }

    const abortController = new AbortController();

    fhevmInstance = await createFhevmInstance({
      provider: window.ethereum,
      signal: abortController.signal,
    });

    console.log('FHEVM initialized successfully via window.ethereum');
  } catch (error) {
    console.error('Failed to initialize FHEVM (window.ethereum):', error);
    throw error;
  }
}
/**
 * Get the current FHEVM instance
 */
export function getFhevmInstance() {
  if (!fhevmInstance) {
    throw new Error('FHEVM not initialized. Call initializeFhevm first.');
  }
  return fhevmInstance;
}

/**
 * Encrypt a value using FHEVM
 */
export async function encryptValue(value: number): Promise<Uint8Array> {
  const instance = getFhevmInstance();
  
  try {
    // Encrypt the value as euint32
    const encrypted = instance.encrypt32(value);
    return encrypted;
  } catch (error) {
    console.error('Failed to encrypt value:', error);
    throw error;
  }
}

/**
 * Decrypt a value using FHEVM
 */
export async function decryptValue(
  encryptedData: string | Uint8Array,
  userAddress: string
): Promise<number> {
  const instance = getFhevmInstance();
  
  try {
    // Convert string to Uint8Array if needed
    const data = typeof encryptedData === 'string' 
      ? new Uint8Array(Buffer.from(encryptedData.slice(2), 'hex'))
      : encryptedData;
    
    // Decrypt the value
    const decrypted = await instance.decrypt(data, userAddress);
    return Number(decrypted);
  } catch (error) {
    console.error('Failed to decrypt value:', error);
    throw error;
  }
}

/**
 * Detect current network
 */
export async function detectNetwork(provider: BrowserProvider): Promise<NetworkName | null> {
  try {
    const network = await provider.getNetwork();
    const chainId = `0x${network.chainId.toString(16)}`;
    
    for (const [name, config] of Object.entries(NETWORKS)) {
      if (config.chainId === chainId) {
        return name as NetworkName;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Failed to detect network:', error);
    return null;
  }
}

/**
 * Switch to a specific network
 */
export async function switchNetwork(chainId: string): Promise<void> {
  if (!window.ethereum) {
    throw new Error('MetaMask not found');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }],
    });
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      const network = Object.values(NETWORKS).find(n => n.chainId === chainId);
      if (network) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId,
            chainName: network.name,
            rpcUrls: [network.rpcUrl],
            blockExplorerUrls: [network.blockExplorer],
          }],
        });
      }
    } else {
      throw switchError;
    }
  }
}

/**
 * Format encrypted value for display
 */
export function formatEncryptedValue(value: Uint8Array): string {
  return `0x${Array.from(value).map(b => b.toString(16).padStart(2, '0')).join('')}`;
}

/**
 * Validate if a value is properly encrypted
 */
export function isValidEncryptedValue(value: any): boolean {
  return value instanceof Uint8Array && value.length > 0;
}

// Type declarations for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
    };
  }
}