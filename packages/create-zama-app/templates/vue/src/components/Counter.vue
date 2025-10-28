<template>
  <Card class="w-full max-w-md mx-auto">
    <CardHeader>
      <CardTitle class="flex items-center justify-between">
        🔐 Encrypted Counter
        <Button
          variant="outline"
          size="sm"
          @click="toggleShowValue"
          class="flex items-center space-x-2"
        >
          <EyeOff v-if="showValue" class="h-4 w-4" />
          <Eye v-else class="h-4 w-4" />
          <span>{{ showValue ? 'Hide' : 'Show' }} Value</span>
        </Button>
      </CardTitle>
      <CardDescription>
        Perform encrypted operations on a private counter using FHEVM
      </CardDescription>
    </CardHeader>
    
    <CardContent v-if="!walletStore.provider || !walletStore.userAddress" class="text-center">
      <p class="text-muted-foreground">
        Connect your wallet to interact with the FHEVM encrypted counter
      </p>
    </CardContent>

    <CardContent v-else-if="!fhevmInitialized" class="flex justify-center">
      <div class="flex items-center space-x-2">
        <Loader2 class="h-6 w-6 animate-spin" />
        <span>Initializing FHEVM...</span>
      </div>
    </CardContent>

    <CardContent v-else class="space-y-6">
      <!-- Current Value Display -->
      <div class="text-center">
        <div class="text-sm text-muted-foreground mb-2">Current Value</div>
        <div class="text-3xl font-bold">
          <template v-if="showValue">
            <Loader2 v-if="isLoading && currentValue === null" class="h-8 w-8 animate-spin mx-auto" />
            <span v-else-if="currentValue !== null">{{ currentValue }}</span>
            <span v-else>???</span>
          </template>
          <span v-else>🔒 Hidden</span>
        </div>
      </div>

      <!-- Increment/Decrement Buttons -->
      <div class="flex space-x-2">
        <Button
          @click="handleIncrement"
          :disabled="isLoading"
          class="flex-1 flex items-center justify-center space-x-2"
        >
          <Loader2 v-if="isLoading" class="h-4 w-4 animate-spin" />
          <Plus v-else class="h-4 w-4" />
          <span>Increment</span>
        </Button>
        <Button
          @click="handleDecrement"
          :disabled="isLoading"
          variant="outline"
          class="flex-1 flex items-center justify-center space-x-2"
        >
          <Loader2 v-if="isLoading" class="h-4 w-4 animate-spin" />
          <Minus v-else class="h-4 w-4" />
          <span>Decrement</span>
        </Button>
      </div>

      <!-- Set Value -->
      <div class="space-y-2">
        <label class="text-sm font-medium">Set Encrypted Value</label>
        <div class="flex space-x-2">
          <Input
            v-model="inputValue"
            type="number"
            placeholder="Enter value"
            :disabled="isLoading"
          />
          <Button
            @click="handleSet"
            :disabled="isLoading || !inputValue"
          >
            Set
          </Button>
        </div>
      </div>

      <!-- Compare Value -->
      <div class="space-y-2">
        <label class="text-sm font-medium">Compare with Value</label>
        <div class="flex space-x-2">
          <Input
            v-model="compareValue"
            type="number"
            placeholder="Compare value"
            :disabled="isLoading"
          />
          <Button
            @click="handleCompare"
            :disabled="isLoading || !compareValue"
            variant="outline"
          >
            Compare
          </Button>
        </div>
        <div v-if="compareResult !== null" class="text-sm text-center">
          Result: <span :class="compareResult ? 'text-green-600' : 'text-red-600'">
            {{ compareResult ? 'Equal ✓' : 'Not Equal ✗' }}
          </span>
        </div>
      </div>

      <!-- Reset Button -->
      <Button
        @click="handleReset"
        :disabled="isLoading"
        variant="destructive"
        class="w-full flex items-center justify-center space-x-2"
      >
        <Loader2 v-if="isLoading" class="h-4 w-4 animate-spin" />
        <RotateCcw v-else class="h-4 w-4" />
        <span>Reset Counter</span>
      </Button>

      <!-- Info -->
      <div class="text-xs text-muted-foreground text-center">
        All operations are performed on encrypted data using FHEVM.
        The actual values remain private on the blockchain.
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, toRaw, markRaw } from 'vue'
import { Contract } from 'ethers'
import { useWalletStore } from '@/stores/wallet'
import { initializeFhevm, initializeFhevmWithEthereumProvider, encryptValue, decryptValue } from '@/utils/fhevm'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardDescription from '@/components/ui/CardDescription.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import { 
  Plus, 
  Minus, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Loader2 
} from 'lucide-vue-next'

// Mock contract ABI - replace with actual generated ABI
const COUNTER_ABI = [
  "function increment() external",
  "function decrement() external", 
  "function set(bytes calldata encryptedValue) external",
  "function get() external view returns (bytes memory)",
  "function compare(bytes calldata encryptedValue) external view returns (bytes memory)",
  "function reset() external",
  "event CounterChanged(address indexed user)"
]

// Mock contract address - replace with actual deployed address
const COUNTER_ADDRESS = "0x1234567890123456789012345678901234567890"

const walletStore = useWalletStore()

// State
const contract = ref<Contract | null>(null)
const currentValue = ref<number | null>(null)
const inputValue = ref<string>('')
const compareValue = ref<string>('')
const compareResult = ref<boolean | null>(null)
const isLoading = ref(false)
const showValue = ref(false)
const fhevmInitialized = ref(false)

// Watch for wallet changes
watch([() => walletStore.provider, () => walletStore.userAddress], async () => {
  if (walletStore.provider && walletStore.userAddress) {
    await initializeContract()
    await initializeFhevmInstance()
  }
}, { immediate: true })

async function initializeContract(): Promise<void> {
  if (!walletStore.provider) return

  try {
    const providerRaw = toRaw(walletStore.provider) as any
    const signer = await providerRaw.getSigner()
    contract.value = markRaw(new Contract(COUNTER_ADDRESS, COUNTER_ABI, signer))
  } catch (error) {
    console.error('Failed to initialize contract:', error)
  }
}

async function initializeFhevmInstance(): Promise<void> {
  if (!walletStore.provider) return

  try {
    isLoading.value = true
    // Prefer using window.ethereum directly to ensure EIP-1193 provider
    await initializeFhevmWithEthereumProvider()
    fhevmInitialized.value = true
  } catch (error) {
    console.error('Failed to initialize FHEVM:', error)
  } finally {
    isLoading.value = false
  }
}

async function handleIncrement(): Promise<void> {
  if (!contract.value) return

  try {
    isLoading.value = true
    const tx = await contract.value.increment()
    await tx.wait()
    
    // Refresh the current value
    await getCurrentValue()
  } catch (error) {
    console.error('Failed to increment:', error)
  } finally {
    isLoading.value = false
  }
}

async function handleDecrement(): Promise<void> {
  if (!contract.value) return

  try {
    isLoading.value = true
    const tx = await contract.value.decrement()
    await tx.wait()
    
    // Refresh the current value
    await getCurrentValue()
  } catch (error) {
    console.error('Failed to decrement:', error)
  } finally {
    isLoading.value = false
  }
}

async function handleSet(): Promise<void> {
  if (!contract.value || !inputValue.value) return

  try {
    isLoading.value = true
    const value = parseInt(inputValue.value)
    const encryptedValue = await encryptValue(value)
    
    const tx = await contract.value.set(encryptedValue)
    await tx.wait()
    
    inputValue.value = ''
    await getCurrentValue()
  } catch (error) {
    console.error('Failed to set value:', error)
  } finally {
    isLoading.value = false
  }
}

async function handleReset(): Promise<void> {
  if (!contract.value) return

  try {
    isLoading.value = true
    const tx = await contract.value.reset()
    await tx.wait()
    
    currentValue.value = 0
    compareResult.value = null
  } catch (error) {
    console.error('Failed to reset:', error)
  } finally {
    isLoading.value = false
  }
}

async function getCurrentValue(): Promise<void> {
  if (!contract.value || !showValue.value) return

  try {
    isLoading.value = true
    const encryptedResult = await contract.value.get()
    const decryptedValue = await decryptValue(encryptedResult, walletStore.userAddress)
    currentValue.value = decryptedValue
  } catch (error) {
    console.error('Failed to get current value:', error)
  } finally {
    isLoading.value = false
  }
}

async function handleCompare(): Promise<void> {
  if (!contract.value || !compareValue.value) return

  try {
    isLoading.value = true
    const value = parseInt(compareValue.value)
    const encryptedValue = await encryptValue(value)
    
    const encryptedResult = await contract.value.compare(encryptedValue)
    const decryptedResult = await decryptValue(encryptedResult, walletStore.userAddress)
    compareResult.value = Boolean(decryptedResult)
    compareValue.value = ''
  } catch (error) {
    console.error('Failed to compare:', error)
  } finally {
    isLoading.value = false
  }
}

async function toggleShowValue(): Promise<void> {
  showValue.value = !showValue.value
  if (showValue.value) {
    await getCurrentValue()
  } else {
    currentValue.value = null
  }
}
</script>