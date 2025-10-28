/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_HARDHAT_RPC_URL: string
  readonly VITE_SEPOLIA_RPC_URL: string
  readonly VITE_COUNTER_CONTRACT_ADDRESS: string
  readonly VITE_DEFAULT_NETWORK: string
  readonly VITE_ANALYTICS_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}