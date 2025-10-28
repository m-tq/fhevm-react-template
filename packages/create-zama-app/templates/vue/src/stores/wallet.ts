import { defineStore } from 'pinia'
import { ref, computed, markRaw } from 'vue'
import { BrowserProvider } from 'ethers'
import { detectNetwork, switchNetwork, NETWORKS } from '@/utils/fhevm'

export const useWalletStore = defineStore('wallet', () => {
  // State
  const provider = ref<BrowserProvider | null>(null)
  const userAddress = ref<string>('')
  const currentNetwork = ref<keyof typeof NETWORKS | null>(null)
  const isConnecting = ref(false)
  const isConnected = computed(() => !!provider.value && !!userAddress.value)

  // Actions
  async function connectWallet(): Promise<boolean> {
    if (!window.ethereum) {
      alert('Please install MetaMask to use this application')
      return false
    }

    try {
      isConnecting.value = true
      
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })

      if (accounts.length === 0) {
        throw new Error('No accounts found')
      }

      // Create provider and get user address
      const newProvider = markRaw(new BrowserProvider(window.ethereum))
      const signer = await newProvider.getSigner()
      const address = await signer.getAddress()

      // Update state
      provider.value = newProvider
      userAddress.value = address
      currentNetwork.value = await detectNetwork(newProvider)

      // Listen for account changes
      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)

      console.log('Wallet connected:', address)
      return true
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      return false
    } finally {
      isConnecting.value = false
    }
  }

  function disconnectWallet(): void {
    // Remove event listeners
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      window.ethereum.removeListener('chainChanged', handleChainChanged)
    }

    // Reset state
    provider.value = null
    userAddress.value = ''
    currentNetwork.value = null

    console.log('Wallet disconnected')
  }

  async function switchToNetwork(networkKey: keyof typeof NETWORKS): Promise<boolean> {
    const success = await switchNetwork(networkKey)
    if (success && provider.value) {
      currentNetwork.value = await detectNetwork(provider.value)
    }
    return success
  }

  // Event handlers
  async function handleAccountsChanged(accounts: string[]): Promise<void> {
    if (accounts.length === 0) {
      disconnectWallet()
    } else if (accounts[0] !== userAddress.value) {
      userAddress.value = accounts[0]
      console.log('Account changed:', accounts[0])
    }
  }

  async function handleChainChanged(): Promise<void> {
    if (provider.value) {
      currentNetwork.value = await detectNetwork(provider.value)
      console.log('Network changed:', currentNetwork.value)
    }
  }

  // Initialize - check if already connected
  async function initialize(): Promise<void> {
    if (!window.ethereum) return

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_accounts'
      })

      if (accounts.length > 0) {
        const newProvider = markRaw(new BrowserProvider(window.ethereum))
        provider.value = newProvider
        userAddress.value = accounts[0]
        currentNetwork.value = await detectNetwork(newProvider)

        // Listen for changes
        window.ethereum.on('accountsChanged', handleAccountsChanged)
        window.ethereum.on('chainChanged', handleChainChanged)
      }
    } catch (error) {
      console.error('Failed to initialize wallet:', error)
    }
  }

  return {
    // State
    provider: computed(() => provider.value),
    userAddress: computed(() => userAddress.value),
    currentNetwork: computed(() => currentNetwork.value),
    isConnecting: computed(() => isConnecting.value),
    isConnected,
    
    // Actions
    connectWallet,
    disconnectWallet,
    switchToNetwork,
    initialize
  }
})