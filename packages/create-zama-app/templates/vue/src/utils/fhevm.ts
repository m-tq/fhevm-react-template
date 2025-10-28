import { BrowserProvider } from 'ethers';
import type { Eip1193Provider } from 'ethers';
import { createFhevmInstance } from '@fhevm-sdk';
import type { FhevmInstance } from '@fhevm-sdk';

// Network configurations
export const NETWORKS = {
  hardhat: {
    chainId: 31337,
    name: 'Hardhat Local',
    rpcUrl: 'http://localhost:8545',
    currency: 'ETH'
  },
  sepolia: {
    chainId: 11155111,
    name: 'Sepolia',
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
    currency: 'SepoliaETH'
  }
};

// Global FHEVM instance
let fhevmInstance: FhevmInstance | null = null;

// Type declarations for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
      isMetaMask?: boolean;
    };
  }
}

/**
 * Initialize FHEVM instance
 */
export async function initializeFhevm(provider: BrowserProvider): Promise<void> {
  try {
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
      if (typeof window !== 'undefined' && (window as any).ethereum && typeof (window as any).ethereum.request === 'function') {
        return (window as any).ethereum as Eip1193Provider;
      }
      throw new Error('Invalid provider: missing EIP-1193 request method');
    })();

    // Detect chain id via EIP-1193 first, fallback to BrowserProvider
    let chainId: number;
    try {
      const hexChainId = await (eip1193Provider as any).request({ method: 'eth_chainId' });
      chainId = parseInt(hexChainId, 16);
    } catch {
      const network = await new BrowserProvider(eip1193Provider as any).getNetwork();
      chainId = Number(network.chainId);
    }

    // Create FHEVM instance using EIP-1193 provider
    fhevmInstance = await createFhevmInstance({
      provider: eip1193Provider,
      signal: abortController.signal,
      mockChains: {
        [chainId]: NETWORKS.hardhat.rpcUrl, // Use hardhat for local development
      },
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
      provider: window.ethereum as unknown as Eip1193Provider,
      signal: abortController.signal,
      mockChains: {
        [NETWORKS.hardhat.chainId]: NETWORKS.hardhat.rpcUrl,
      },
    });

    console.log('FHEVM initialized successfully via window.ethereum');
  } catch (error) {
    console.error('Failed to initialize FHEVM (window.ethereum):', error);
    throw error;
  }
}

/**
 * Get FHEVM instance
 */
export function getFhevmInstance(): FhevmInstance {
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
  return instance.encrypt32(value);
}

/**
 * Decrypt a value using FHEVM
 */
export async function decryptValue(encryptedValue: string, userAddress: string): Promise<number> {
  const instance = getFhevmInstance();
  
  // This is a simplified decryption - in practice, you'd need to handle
  // the decryption process according to FHEVM specifications
  try {
    // Convert hex string to Uint8Array if needed
    const bytes = typeof encryptedValue === 'string' 
      ? new Uint8Array(Buffer.from(encryptedValue.replace('0x', ''), 'hex'))
      : encryptedValue;
    
    // Decrypt the value (this is a mock implementation)
    // In real FHEVM, decryption requires proper key management
    return instance.decrypt(bytes, userAddress);
  } catch (error) {
    console.error('Decryption failed:', error);
    throw error;
  }
}

/**
 * Get public key for the network (mock implementation)
 */
async function getPublicKey(chainId: number): Promise<string> {
  // This is a mock implementation
  // In practice, you'd fetch the public key from the FHEVM network
  const mockPublicKeys: Record<number, string> = {
    31337: '0x1234567890abcdef', // Hardhat
    11155111: '0xabcdef1234567890' // Sepolia
  };
  
  return mockPublicKeys[chainId] || mockPublicKeys[31337];
}

/**
 * Detect current network
 */
export async function detectNetwork(provider: BrowserProvider): Promise<keyof typeof NETWORKS | null> {
  try {
    const network = await provider.getNetwork();
    const chainId = Number(network.chainId);
    
    for (const [key, config] of Object.entries(NETWORKS)) {
      if (config.chainId === chainId) {
        return key as keyof typeof NETWORKS;
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
export async function switchNetwork(networkKey: keyof typeof NETWORKS): Promise<boolean> {
  if (!window.ethereum) {
    throw new Error('MetaMask not found');
  }

  const network = NETWORKS[networkKey];
  
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${network.chainId.toString(16)}` }],
    });
    return true;
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${network.chainId.toString(16)}`,
              chainName: network.name,
              rpcUrls: [network.rpcUrl],
              nativeCurrency: {
                name: network.currency,
                symbol: network.currency,
                decimals: 18,
              },
            },
          ],
        });
        return true;
      } catch (addError) {
        console.error('Failed to add network:', addError);
        return false;
      }
    }
    console.error('Failed to switch network:', switchError);
    return false;
  }
}

/**
 * Format encrypted value for display
 */
export function formatEncryptedValue(value: Uint8Array): string {
  return `0x${Array.from(value).map(b => b.toString(16).padStart(2, '0')).join('')}`;
}

/**
 * Validate encrypted value
 */
export function isValidEncryptedValue(value: any): boolean {
  return value instanceof Uint8Array && value.length > 0;
}