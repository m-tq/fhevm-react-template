# Zama FHEVM React App

A modern React application demonstrating Fully Homomorphic Encryption (FHE) capabilities using Zama's FHEVM protocol.

## Features

- 🔐 **Privacy-Preserving Smart Contracts**: Interact with encrypted data on-chain
- 🎨 **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- 🌙 **Dark/Light Theme**: Toggle between themes with system preference support
- 👛 **Wallet Integration**: Connect with MetaMask and other Web3 wallets
- 🔗 **Multi-Network Support**: Works with Hardhat local and Sepolia testnet
- ⚡ **Type-Safe**: Full TypeScript support with generated contract types

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- MetaMask or compatible Web3 wallet
- Access to Hardhat local network or Sepolia testnet

### Installation

```bash
# Install dependencies
npm install

# Generate contract ABIs (if contracts are deployed)
npm run generate-abi

# Start development server
npm run dev
```

### Deployment

```bash
# Deploy contracts to local Hardhat network
npm run deploy

# Deploy to Sepolia testnet
npm run deploy -- --network sepolia

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── navbar.tsx      # Navigation with wallet connection
│   ├── counter.tsx     # FHEVM counter demo
│   └── theme-provider.tsx
├── lib/                # Utility libraries
│   ├── utils.ts        # shadcn/ui utilities
│   └── fhevm.ts        # FHEVM integration
├── generated/          # Auto-generated contract types
├── App.tsx             # Main application
└── main.tsx            # Entry point

contracts/              # Solidity contracts
scripts/                # Deployment and utility scripts
```

## FHEVM Integration

This template demonstrates key FHEVM concepts:

### Encrypted Operations
```typescript
// Encrypt a value before sending to contract
const encryptedValue = await encryptValue(42);
await contract.set(encryptedValue);

// Decrypt a value received from contract
const encryptedResult = await contract.get();
const decryptedValue = await decryptValue(encryptedResult, userAddress);
```

### Smart Contract Example
```solidity
// contracts/Counter.sol
import "@fhevm/solidity/contracts/FHE.sol";

contract Counter is Ownable {
    euint32 private counter;
    
    function increment() external {
        counter = FHE.add(counter, FHE.asEuint32(1));
    }
    
    function get() external view returns (bytes memory) {
        return FHE.decrypt(counter);
    }
}
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run generate-abi` - Generate TypeScript contract types
- `npm run deploy` - Deploy contracts to configured network

## Network Configuration

### Hardhat Local
- Chain ID: 31337
- RPC URL: http://localhost:8545
- Accounts: Pre-funded development accounts

### Sepolia Testnet
- Chain ID: 11155111
- RPC URL: https://sepolia.infura.io/v3/YOUR_KEY
- Faucet: https://sepoliafaucet.com/

## Environment Variables

Create a `.env.local` file:

```env
VITE_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
VITE_PRIVATE_KEY=your_private_key_for_deployment
```

## Learn More

- [Zama FHEVM Documentation](https://docs.zama.ai/protocol/fhevm/)
- [FHEVM Examples](https://docs.zama.ai/protocol/examples/)
- [Solidity Library](https://docs.zama.ai/protocol/solidity/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- [Discord Community](https://discord.gg/zama)
- [GitHub Issues](https://github.com/zama-ai/fhevm-template/issues)
- [Documentation](https://docs.zama.ai/)