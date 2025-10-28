<template>
  <nav class="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div class="container mx-auto px-4">
      <div class="flex h-16 items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center space-x-4">
          <h1 class="text-xl font-bold">FHEVM Vue</h1>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-4">
          <!-- Network Selector -->
          <div v-if="walletStore.isConnected" class="flex items-center space-x-2">
            <span class="text-sm text-muted-foreground">Network:</span>
            <select
              :value="walletStore.currentNetwork || ''"
              @change="handleNetworkChange"
              class="text-sm border rounded px-2 py-1 bg-background"
            >
              <option value="hardhat">Hardhat Local</option>
              <option value="sepolia">Sepolia</option>
            </select>
          </div>

          <!-- Wallet Info -->
          <div v-if="walletStore.isConnected" class="flex items-center space-x-2">
            <div class="text-sm">
              <div class="font-medium">{{ formatAddress(walletStore.userAddress) }}</div>
              <div class="text-muted-foreground">
                {{ NETWORKS[walletStore.currentNetwork || 'hardhat']?.name }}
              </div>
            </div>
          </div>

          <!-- Connect/Disconnect Button -->
          <Button
            v-if="!walletStore.isConnected"
            @click="walletStore.connectWallet"
            :disabled="walletStore.isConnecting"
            class="flex items-center space-x-2"
          >
            <Wallet class="h-4 w-4" />
            <span>{{ walletStore.isConnecting ? 'Connecting...' : 'Connect Wallet' }}</span>
          </Button>

          <Button
            v-else
            @click="walletStore.disconnectWallet"
            variant="outline"
            class="flex items-center space-x-2"
          >
            <LogOut class="h-4 w-4" />
            <span>Disconnect</span>
          </Button>

          <!-- Theme Toggle -->
          <Button
            @click="themeStore.toggleTheme"
            variant="ghost"
            size="icon"
            class="flex items-center justify-center"
          >
            <Sun v-if="themeStore.isDark" class="h-4 w-4" />
            <Moon v-else class="h-4 w-4" />
          </Button>

          <!-- Documentation Link -->
          <Button
            as="a"
            href="https://docs.zama.ai/fhevm"
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            class="flex items-center space-x-2"
          >
            <ExternalLink class="h-4 w-4" />
            <span>Docs</span>
          </Button>
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden">
          <Button
            @click="mobileMenuOpen = !mobileMenuOpen"
            variant="ghost"
            size="icon"
          >
            <Menu class="h-4 w-4" />
          </Button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="md:hidden border-t py-4 space-y-4">
        <!-- Wallet Connection -->
        <div v-if="!walletStore.isConnected">
          <Button
            @click="handleMobileConnect"
            :disabled="walletStore.isConnecting"
            class="w-full flex items-center justify-center space-x-2"
          >
            <Wallet class="h-4 w-4" />
            <span>{{ walletStore.isConnecting ? 'Connecting...' : 'Connect Wallet' }}</span>
          </Button>
        </div>

        <div v-else class="space-y-4">
          <!-- Wallet Info -->
          <div class="text-center">
            <div class="font-medium">{{ formatAddress(walletStore.userAddress) }}</div>
            <div class="text-sm text-muted-foreground">
              {{ NETWORKS[walletStore.currentNetwork || 'hardhat']?.name }}
            </div>
          </div>

          <!-- Network Selector -->
          <div>
            <label class="block text-sm font-medium mb-2">Network:</label>
            <select
              :value="walletStore.currentNetwork || ''"
              @change="handleNetworkChange"
              class="w-full border rounded px-3 py-2 bg-background"
            >
              <option value="hardhat">Hardhat Local</option>
              <option value="sepolia">Sepolia</option>
            </select>
          </div>

          <!-- Disconnect Button -->
          <Button
            @click="handleMobileDisconnect"
            variant="outline"
            class="w-full flex items-center justify-center space-x-2"
          >
            <LogOut class="h-4 w-4" />
            <span>Disconnect</span>
          </Button>
        </div>

        <!-- Theme Toggle -->
        <Button
          @click="themeStore.toggleTheme"
          variant="ghost"
          class="w-full flex items-center justify-center space-x-2"
        >
          <Sun v-if="themeStore.isDark" class="h-4 w-4" />
          <Moon v-else class="h-4 w-4" />
          <span>{{ themeStore.isDark ? 'Light Mode' : 'Dark Mode' }}</span>
        </Button>

        <!-- Documentation Link -->
        <Button
          as="a"
          href="https://docs.zama.ai/fhevm"
          target="_blank"
          rel="noopener noreferrer"
          variant="outline"
          class="w-full flex items-center justify-center space-x-2"
        >
          <ExternalLink class="h-4 w-4" />
          <span>Documentation</span>
        </Button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useWalletStore } from '@/stores/wallet'
import { useThemeStore } from '@/stores/theme'
import { NETWORKS } from '@/utils/fhevm'
import Button from '@/components/ui/Button.vue'
import { 
  Wallet, 
  LogOut, 
  Sun, 
  Moon, 
  ExternalLink, 
  Menu 
} from 'lucide-vue-next'

const walletStore = useWalletStore()
const themeStore = useThemeStore()
const mobileMenuOpen = ref(false)

function formatAddress(address: string): string {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

async function handleNetworkChange(event: Event): Promise<void> {
  const target = event.target as HTMLSelectElement
  const networkKey = target.value as keyof typeof NETWORKS
  
  if (networkKey && walletStore.currentNetwork !== networkKey) {
    const success = await walletStore.switchToNetwork(networkKey)
    if (!success) {
      // Reset select to current network if switch failed
      target.value = walletStore.currentNetwork || 'hardhat'
    }
  }
}

async function handleMobileConnect(): Promise<void> {
  await walletStore.connectWallet()
  mobileMenuOpen.value = false
}

function handleMobileDisconnect(): void {
  walletStore.disconnectWallet()
  mobileMenuOpen.value = false
}
</script>