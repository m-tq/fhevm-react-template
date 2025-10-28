# FHEVM Vue Template

A modern Vue.js template for building privacy-preserving decentralized applications using Fully Homomorphic Encryption Virtual Machine (FHEVM).

## Features

- 🔐 **Privacy-Preserving Smart Contracts**: Build dApps with encrypted state and computations
- 🎨 **Modern UI Components**: Beautiful, accessible components with Tailwind CSS
- 🌙 **Dark/Light Theme**: Built-in theme switching with system preference detection
- 💰 **Wallet Integration**: Seamless connection with MetaMask and other Web3 wallets
- 🌐 **Multi-Network Support**: Easy switching between Hardhat local network and Sepolia testnet
- 📱 **Responsive Design**: Mobile-first design that works on all devices
- ⚡ **Vue 3 + TypeScript**: Modern development with Composition API and full type safety
- 🛠 **Developer Experience**: Hot reload, ESLint, and comprehensive tooling

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- MetaMask or another Web3 wallet
- Git

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo>
   cd fhevm-vue-template
   pnpm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   VITE_HARDHAT_RPC_URL=http://localhost:8545
   VITE_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
   VITE_COUNTER_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
   VITE_DEFAULT_NETWORK=hardhat
   ```

3. **Generate contract ABIs:**
   ```bash
   pnpm generate-abi
   ```

4. **Deploy contracts (for local development):**
   ```bash
   # Start Hardhat node in another terminal
   pnpm hardhat:node
   
   # Deploy to local network
   pnpm deploy:hardhat
   ```

5. **Start the development server:**
   ```bash
   pnpm dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
src/
├── components/           # Vue components
│   ├── ui/              # Reusable UI components
│   ├── Counter.vue      # FHEVM counter demo
│   └── Navbar.vue       # Navigation component
├── stores/              # Pinia stores
│   ├── wallet.ts        # Wallet connection state
│   └── theme.ts         # Theme management
├── utils/               # Utility functions
│   ├── cn.ts           # Class name utility
│   └── fhevm.ts        # FHEVM integration
├── App.vue             # Main application component
├── main.ts             # Application entry point
├── style.css           # Global styles
└── env.d.ts            # TypeScript declarations

contracts/              # Smart contracts
scripts/               # Deployment scripts
public/                # Static assets
```

## FHEVM Integration

This template demonstrates FHEVM capabilities through an encrypted counter contract:

### Example Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { initializeFhevm, encryptValue, decryptValue } from '@/utils/fhevm'
import { useWalletStore } from '@/stores/wallet'

const walletStore = useWalletStore()
const encryptedValue = ref<string>('')

// Initialize FHEVM
await initializeFhevm(walletStore.provider)

// Encrypt a value
const encrypted = await encryptValue(42)

// Use in contract call
const tx = await contract.setValue(encrypted)
await tx.wait()

// Decrypt result
const result = await contract.getValue()
const decrypted = await decryptValue(result, walletStore.userAddress)
</script>
```

### Key FHEVM Features

- **Encrypted State**: All sensitive data is encrypted on-chain
- **Private Computations**: Perform operations without revealing data
- **Access Control**: Only authorized users can decrypt results
- **Gas Optimization**: Efficient FHE operations

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript checks
- `pnpm generate-abi` - Generate contract ABIs
- `pnpm deploy:hardhat` - Deploy to Hardhat network
- `pnpm deploy:sepolia` - Deploy to Sepolia testnet

## Network Configuration

### Hardhat Local Network
- **Chain ID**: 31337
- **RPC URL**: http://localhost:8545
- **Currency**: ETH

### Sepolia Testnet
- **Chain ID**: 11155111
- **RPC URL**: https://sepolia.infura.io/v3/YOUR_INFURA_KEY
- **Currency**: SepoliaETH
- **Faucet**: [Sepolia Faucet](https://sepoliafaucet.com/)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_HARDHAT_RPC_URL` | Hardhat network RPC URL | `http://localhost:8545` |
| `VITE_SEPOLIA_RPC_URL` | Sepolia testnet RPC URL | Required for testnet |
| `VITE_COUNTER_CONTRACT_ADDRESS` | Deployed counter contract address | Required |
| `VITE_DEFAULT_NETWORK` | Default network to connect to | `hardhat` |
| `VITE_ANALYTICS_ID` | Analytics tracking ID | Optional |

## Resources

### FHEVM
- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [FHEVM GitHub](https://github.com/zama-ai/fhevm)
- [Zama Community Discord](https://discord.gg/fhe-org)

### Vue.js
- [Vue.js Documentation](https://vuejs.org/)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Pinia State Management](https://pinia.vuejs.org/)

### UI & Styling
- [Tailwind CSS](https://tailwindcss.com/)
- [Headless UI](https://headlessui.com/)
- [Lucide Icons](https://lucide.dev/)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
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