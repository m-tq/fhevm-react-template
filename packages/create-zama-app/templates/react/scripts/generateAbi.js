import fs from 'fs';
import path from 'path';

/**
 * Generate TypeScript ABI files from contract artifacts
 * This script creates type-safe contract interfaces for frontend interaction
 */

// Mock ABI for Counter contract
// In a real setup, this would be generated from actual contract compilation
const COUNTER_ABI = [
  {
    "type": "constructor",
    "inputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "increment",
    "inputs": [
      {
        "name": "encryptedAmount",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function", 
    "name": "decrement",
    "inputs": [
      {
        "name": "encryptedAmount",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setCounter", 
    "inputs": [
      {
        "name": "encryptedValue",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getCounter",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isGreaterThan",
    "inputs": [
      {
        "name": "encryptedThreshold", 
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes", 
        "internalType": "bytes"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "reset",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "CounterIncremented",
    "inputs": [
      {
        "name": "user",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "CounterDecremented", 
    "inputs": [
      {
        "name": "user",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "CounterSet",
    "inputs": [
      {
        "name": "user",
        "type": "address", 
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  }
];

function generateTypeScriptABI() {
  const abiContent = `// Auto-generated ABI file
// Do not edit manually - regenerate using 'npm run generate-abi'

export const COUNTER_ABI = ${JSON.stringify(COUNTER_ABI, null, 2)} as const;

export type CounterABI = typeof COUNTER_ABI;

// Contract addresses by network
export const CONTRACT_ADDRESSES = {
  hardhat: '0x5FbDB2315678afecb367f032d93F642f64180aa3', // Default Hardhat address
  sepolia: '', // Will be filled after deployment
} as const;

// Network configuration
export const NETWORKS = {
  hardhat: {
    chainId: 31337,
    name: 'Hardhat Local',
    rpcUrl: 'http://localhost:8545',
  },
  sepolia: {
    chainId: 11155111,
    name: 'Sepolia Testnet', 
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
  },
} as const;

export type NetworkName = keyof typeof NETWORKS;
`;

  return abiContent;
}

function generateContractTypes() {
  const typesContent = `// Auto-generated contract types
// Do not edit manually - regenerate using 'npm run generate-abi'

import type { Contract, ContractTransactionResponse } from 'ethers';

export interface CounterContract extends Contract {
  increment(encryptedAmount: string): Promise<ContractTransactionResponse>;
  decrement(encryptedAmount: string): Promise<ContractTransactionResponse>;
  setCounter(encryptedValue: string): Promise<ContractTransactionResponse>;
  getCounter(): Promise<string>;
  isGreaterThan(encryptedThreshold: string): Promise<string>;
  reset(): Promise<ContractTransactionResponse>;
}

export interface CounterEvents {
  CounterIncremented: {
    user: string;
  };
  CounterDecremented: {
    user: string;
  };
  CounterSet: {
    user: string;
  };
}
`;

  return typesContent;
}

async function generateABI() {
  try {
    console.log('🔧 Generating ABI files...');

    // Create generated directory
    const generatedDir = path.join(process.cwd(), 'src', 'generated');
    if (!fs.existsSync(generatedDir)) {
      fs.mkdirSync(generatedDir, { recursive: true });
    }

    // Generate ABI file
    const abiContent = generateTypeScriptABI();
    fs.writeFileSync(path.join(generatedDir, 'contracts.ts'), abiContent);

    // Generate types file
    const typesContent = generateContractTypes();
    fs.writeFileSync(path.join(generatedDir, 'types.ts'), typesContent);

    // Generate index file
    const indexContent = `// Auto-generated exports
export * from './contracts';
export * from './types';
`;
    fs.writeFileSync(path.join(generatedDir, 'index.ts'), indexContent);

    console.log('✅ ABI files generated successfully!');
    console.log('📁 Files created:');
    console.log('   - src/generated/contracts.ts');
    console.log('   - src/generated/types.ts');
    console.log('   - src/generated/index.ts');

  } catch (error) {
    console.error('❌ ABI generation failed:', error.message);
    process.exit(1);
  }
}

// Run the generator
generateABI();