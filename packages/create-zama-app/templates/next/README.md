# FHEVM Next.js Template

A modern Next.js template for building privacy-preserving decentralized applications using FHEVM (Fully Homomorphic Encryption Virtual Machine).

## Features

- 🔐 **Privacy-Preserving Smart Contracts**: Build dApps that compute on encrypted data
- 🎨 **Modern UI**: Beautiful interface built with shadcn/ui and Tailwind CSS
- 🌙 **Dark/Light Theme**: Seamless theme switching with next-themes
- 🔗 **Wallet Integration**: Connect with MetaMask and other Web3 wallets
- 🌐 **Multi-Network Support**: Works with Hardhat local network and Sepolia testnet
- ⚡ **TypeScript**: Full type safety throughout the application
- 📱 **Responsive Design**: Mobile-first responsive design
- 🚀 **Next.js 14**: Built with the latest Next.js features including App Router

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- MetaMask or another Web3 wallet
- Git

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo>
   cd fhevm-nextjs-template
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Update the environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_HARDHAT_RPC_URL=http://localhost:8545
   NEXT_PUBLIC_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
   NEXT_PUBLIC_COUNTER_CONTRACT_ADDRESS=0x...
   ```

3. **Generate contract ABIs:**
   ```bash
   npm run generate:abi
   ```

4. **Deploy contracts (for local development):**
   ```bash
   npm run deploy:local
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles with CSS variables
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page component
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── counter.tsx       # FHEVM counter demo component
│   ├── navbar.tsx        # Navigation with wallet connection
│   └── theme-provider.tsx # Theme context provider
├── lib/                  # Utility libraries
│   ├── fhevm.ts         # FHEVM integration utilities
│   └── utils.ts         # General utility functions
├── contracts/           # Smart contracts
│   └── Counter.sol      # Example encrypted counter contract
├── scripts/            # Deployment and utility scripts
│   └── deploy.ts       # Contract deployment script
└── public/             # Static assets
```

## FHEVM Integration

This template demonstrates FHEVM capabilities through an encrypted counter contract:

### Key Features

- **Encrypted State**: Counter value is stored encrypted on-chain
- **Private Operations**: Increment, decrement, and set operations on encrypted data
- **Secure Comparisons**: Compare encrypted values without revealing them
- **Selective Decryption**: Users can choose to decrypt and view their data

### Example Usage

```typescript
import { initializeFhevm, encryptValue, decryptValue } from '@/lib/fhevm';

// Initialize FHEVM
await initializeFhevm(provider);

// Encrypt a value
const encryptedValue = await encryptValue(42);

// Interact with contract
const tx = await contract.set(encryptedValue);
await tx.wait();

// Decrypt result
const encryptedResult = await contract.get();
const decryptedValue = await decryptValue(encryptedResult, userAddress);
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run generate:abi` - Generate TypeScript ABIs from contracts
- `npm run deploy:local` - Deploy contracts to local Hardhat network
- `npm run deploy:sepolia` - Deploy contracts to Sepolia testnet

## Network Configuration

### Hardhat Local Network
- **RPC URL**: http://localhost:8545
- **Chain ID**: 31337
- **Currency**: ETH

### Sepolia Testnet
- **RPC URL**: https://sepolia.infura.io/v3/YOUR_INFURA_KEY
- **Chain ID**: 11155111
- **Currency**: SepoliaETH

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_HARDHAT_RPC_URL` | Hardhat local network RPC URL | Yes |
| `NEXT_PUBLIC_SEPOLIA_RPC_URL` | Sepolia testnet RPC URL | Yes |
| `NEXT_PUBLIC_COUNTER_CONTRACT_ADDRESS` | Deployed counter contract address | Yes |
| `NEXT_PUBLIC_DEFAULT_NETWORK` | Default network (hardhat/sepolia) | No |

## Learn More

### FHEVM Resources
- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [FHEVM GitHub](https://github.com/zama-ai/fhevm)
- [Zama Community Discord](https://discord.gg/fhe-org)

### Next.js Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Next.js GitHub](https://github.com/vercel/next.js/)

### UI Components
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📖 [Documentation](https://docs.zama.ai/fhevm)
- 💬 [Discord Community](https://discord.gg/fhe-org)
- 🐛 [Issue Tracker](https://github.com/zama-ai/fhevm/issues)
- 📧 [Contact Support](mailto:support@zama.ai)

---

Built with ❤️ by the Zama team