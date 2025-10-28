import { createFhevmInstance, FhevmInstance } from '@fhevm-sdk';
import { BrowserProvider, Eip1193Provider } from 'ethers';
import { ensureRelayerSDK } from './relayerSDK';

export type NetworkName = "sepolia" | "localhost";

let fhevmInstance: any = null;

export const initializeFhevm = async (
  provider: BrowserProvider,
  network: NetworkName = "sepolia"
) => {
  try {
    if (fhevmInstance) {
      return fhevmInstance;
    }

    console.log("Initializing FHEVM...");
    
    // Extract the underlying Eip1193Provider from BrowserProvider
    const eip1193Provider = provider.provider;
    
    fhevmInstance = await createFhevmInstance({
      provider: eip1193Provider,
      mockChains: network === "localhost" ? { 31337: "http://localhost:8545" } : undefined,
      signal: new AbortController().signal,
    });

    console.log("FHEVM initialized successfully");
    return fhevmInstance;
  } catch (error) {
    console.error("Failed to initialize FHEVM:", error);
    throw error;
  }
};

export const initializeFhevmWithEthereumProvider = async (
  network: NetworkName = "sepolia"
) => {
  try {
    if (fhevmInstance) {
      return fhevmInstance;
    }

    console.log("Ensuring RelayerSDK is loaded...");
    await ensureRelayerSDK();

    console.log("Initializing FHEVM with window.ethereum...");
    
    if (!window.ethereum) {
      throw new Error("window.ethereum is not available");
    }
    
    fhevmInstance = await createFhevmInstance({
      provider: window.ethereum,
      mockChains: network === "localhost" ? { 31337: "http://localhost:8545" } : undefined,
      signal: new AbortController().signal,
    });

    console.log("FHEVM initialized successfully");
    return fhevmInstance;
  } catch (error) {
    console.error("Failed to initialize FHEVM:", error);
    throw error;
  }
};

export const getFhevmInstance = () => {
  if (!fhevmInstance) {
    throw new Error("FHEVM not initialized. Call initializeFhevm first.");
  }
  return fhevmInstance;
};

// Encryption utilities
export async function encryptValue(value: number | bigint): Promise<Uint8Array> {
  const instance = getFhevmInstance();
  
  try {
    // Use encrypt32 for 32-bit integers
    const encrypted = instance.encrypt32(Number(value));
    return encrypted;
  } catch (error) {
    console.error('Failed to encrypt value:', error);
    throw error;
  }
}

// Decryption utilities
export async function decryptValue(
  encryptedValue: string | Uint8Array,
  userAddress: string
): Promise<number> {
  const instance = getFhevmInstance();
  
  try {
    // Convert string to Uint8Array if needed
    const data = typeof encryptedValue === 'string' 
      ? new Uint8Array(Buffer.from(encryptedValue.slice(2), 'hex'))
      : encryptedValue;
    
    // Decrypt the value
    const decrypted = await instance.decrypt(data, userAddress);
    return Number(decrypted);
  } catch (error) {
    console.error('Failed to decrypt value:', error);
    throw error;
  }
}

// Network detection and switching
export async function detectNetwork(provider: BrowserProvider): Promise<NetworkName> {
  try {
    const network = await provider.getNetwork();
    const chainId = Number(network.chainId);
    
    switch (chainId) {
      case 31337:
        return 'hardhat';
      case 11155111:
        return 'sepolia';
      default:
        throw new Error(`Unsupported network: ${chainId}`);
    }
  } catch (error) {
    console.error('Failed to detect network:', error);
    throw error;
  }
}

export async function switchNetwork(chainId: number) {
  if (!window.ethereum) {
    throw new Error('MetaMask not detected');
  }
  
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
  } catch (error: any) {
    // If the network doesn't exist, add it
    if (error.code === 4902) {
      const networkConfig = Object.values(NETWORKS).find(n => n.chainId === chainId);
      if (networkConfig) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: `0x${chainId.toString(16)}`,
            chainName: networkConfig.name,
            rpcUrls: [networkConfig.rpcUrl],
          }],
        });
      }
    } else {
      throw error;
    }
  }
}

// Contract interaction helpers
export function formatEncryptedValue(encryptedValue: string): string {
  // Format encrypted value for display
  return `${encryptedValue.slice(0, 10)}...${encryptedValue.slice(-10)}`;
}

export function isValidEncryptedValue(value: string): boolean {
  // Basic validation for encrypted values
  return typeof value === 'string' && value.length > 0;
}