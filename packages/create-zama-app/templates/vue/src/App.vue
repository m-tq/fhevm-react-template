<template>
  <div class="min-h-screen bg-background text-foreground">
    <!-- Navigation -->
    <Navbar />

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <!-- Hero Section -->
      <section class="text-center py-16">
        <h1 class="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          FHEVM Vue Template
        </h1>
        <p class="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Build privacy-preserving dApps with Fully Homomorphic Encryption on the blockchain
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            v-if="!walletStore.userAddress"
            @click="walletStore.connectWallet"
            size="lg"
            class="flex items-center space-x-2"
          >
            <Wallet class="h-5 w-5" />
            <span>Connect Wallet</span>
          </Button>
          <Button
            variant="outline"
            size="lg"
            class="flex items-center space-x-2"
            @click="openDocumentation"
          >
            <ExternalLink class="h-5 w-5" />
            <span>View Documentation</span>
          </Button>
        </div>
      </section>

      <!-- Wallet Connection Prompt -->
      <section v-if="!walletStore.userAddress" class="py-16">
        <Card class="max-w-md mx-auto text-center">
          <CardHeader>
            <CardTitle class="flex items-center justify-center space-x-2">
              <Wallet class="h-6 w-6" />
              <span>Connect Your Wallet</span>
            </CardTitle>
            <CardDescription>
              Connect your wallet to start interacting with FHEVM smart contracts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              @click="walletStore.connectWallet"
              class="w-full flex items-center justify-center space-x-2"
            >
              <Wallet class="h-5 w-5" />
              <span>Connect Wallet</span>
            </Button>
          </CardContent>
        </Card>
      </section>

      <!-- FHEVM Counter Demo -->
      <section v-else class="py-16">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold mb-4">🔐 Encrypted Counter Demo</h2>
          <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the power of Fully Homomorphic Encryption with this interactive counter.
            All operations are performed on encrypted data while maintaining complete privacy.
          </p>
        </div>
        <Counter />
      </section>

      <!-- Features Grid -->
      <section class="py-16">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold mb-4">Why Choose FHEVM?</h2>
          <p class="text-lg text-muted-foreground">
            Build the next generation of privacy-preserving applications
          </p>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card class="text-center">
            <CardHeader>
              <Shield class="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <CardTitle>Privacy First</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Perform computations on encrypted data without revealing sensitive information
              </CardDescription>
            </CardContent>
          </Card>

          <Card class="text-center">
            <CardHeader>
              <Zap class="h-12 w-12 mx-auto mb-4 text-yellow-600" />
              <CardTitle>High Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Optimized FHE operations with minimal gas costs and fast execution times
              </CardDescription>
            </CardContent>
          </Card>

          <Card class="text-center">
            <CardHeader>
              <Code class="h-12 w-12 mx-auto mb-4 text-green-600" />
              <CardTitle>Developer Friendly</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Easy-to-use APIs and comprehensive tooling for seamless development
              </CardDescription>
            </CardContent>
          </Card>

          <Card class="text-center">
            <CardHeader>
              <Globe class="h-12 w-12 mx-auto mb-4 text-purple-600" />
              <CardTitle>Multi-Network</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Deploy on multiple networks with built-in support for testnet and mainnet
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      <!-- Resources Section -->
      <section class="py-16">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold mb-4">Resources & Documentation</h2>
          <p class="text-lg text-muted-foreground">
            Everything you need to get started with FHEVM development
          </p>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card class="hover:shadow-lg transition-shadow cursor-pointer" @click="openLink('https://docs.zama.ai/fhevm')">
            <CardHeader>
              <BookOpen class="h-8 w-8 mb-2 text-blue-600" />
              <CardTitle class="text-lg">FHEVM Docs</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Complete documentation for FHEVM development
              </CardDescription>
            </CardContent>
          </Card>

          <Card class="hover:shadow-lg transition-shadow cursor-pointer" @click="openLink('https://github.com/zama-ai/fhevm')">
            <CardHeader>
              <Github class="h-8 w-8 mb-2 text-gray-600" />
              <CardTitle class="text-lg">GitHub</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Source code, examples, and community contributions
              </CardDescription>
            </CardContent>
          </Card>

          <Card class="hover:shadow-lg transition-shadow cursor-pointer" @click="openLink('https://docs.zama.ai/fhevm/tutorials')">
            <CardHeader>
              <GraduationCap class="h-8 w-8 mb-2 text-green-600" />
              <CardTitle class="text-lg">Tutorials</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Step-by-step guides and practical examples
              </CardDescription>
            </CardContent>
          </Card>

          <Card class="hover:shadow-lg transition-shadow cursor-pointer" @click="openLink('https://discord.gg/fhe-org')">
            <CardHeader>
              <MessageCircle class="h-8 w-8 mb-2 text-purple-600" />
              <CardTitle class="text-lg">Discord</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Join our community for support and discussions
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="border-t bg-muted/50 py-8">
      <div class="container mx-auto px-4 text-center">
        <p class="text-muted-foreground">
          Built with ❤️ using FHEVM, Vue.js, and Tailwind CSS
        </p>
        <p class="text-sm text-muted-foreground mt-2">
          © 2024 Zama. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useWalletStore } from '@/stores/wallet'
import Navbar from '@/components/Navbar.vue'
import Counter from '@/components/Counter.vue'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardDescription from '@/components/ui/CardDescription.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Button from '@/components/ui/Button.vue'
import {
  Wallet,
  ExternalLink,
  Shield,
  Zap,
  Code,
  Globe,
  BookOpen,
  Github,
  GraduationCap,
  MessageCircle
} from 'lucide-vue-next'

const walletStore = useWalletStore()

function openDocumentation(): void {
  window.open('https://docs.zama.ai/fhevm', '_blank')
}

function openLink(url: string): void {
  window.open(url, '_blank')
}
</script>