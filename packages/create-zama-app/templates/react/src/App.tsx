import { useState } from 'react';
import { BrowserProvider } from 'ethers';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/navbar';
import { Counter } from '@/components/counter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function App() {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [userAddress, setUserAddress] = useState<string>('');

  const handleWalletConnect = (walletProvider: BrowserProvider, address: string) => {
    setProvider(walletProvider);
    setUserAddress(address);
  };

  return (
    <ThemeProvider defaultTheme="system" storageKey="zama-fhevm-theme">
      <div className="min-h-screen bg-background">
        <Navbar onWalletConnect={handleWalletConnect} />
        
        <main className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Welcome to Zama FHEVM
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Experience the power of Fully Homomorphic Encryption on the blockchain. 
              Perform computations on encrypted data without revealing the underlying values.
            </p>
            
            {!provider && (
              <Card className="max-w-md mx-auto">
                <CardHeader>
                  <CardTitle>Get Started</CardTitle>
                  <CardDescription>
                    Connect your wallet to start interacting with encrypted smart contracts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Make sure you have MetaMask installed and are connected to either:
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Hardhat Local Network (for development)</li>
                      <li>Sepolia Testnet (for testing)</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Counter Demo */}
          {provider && userAddress && (
            <div className="mb-12">
              <Counter provider={provider} userAddress={userAddress} />
            </div>
          )}

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>🔐</span>
                  <span>Privacy-Preserving</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  All computations are performed on encrypted data, ensuring complete privacy 
                  while maintaining the ability to execute complex smart contract logic.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>⚡</span>
                  <span>High Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Zama's FHEVM provides efficient homomorphic encryption operations 
                  optimized for blockchain environments with minimal gas overhead.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>🛠️</span>
                  <span>Developer Friendly</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Easy-to-use SDK and tools that make building privacy-preserving 
                  dApps as simple as traditional smart contract development.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Resources Section */}
          <Card>
            <CardHeader>
              <CardTitle>Learn More</CardTitle>
              <CardDescription>
                Explore additional resources to master FHEVM development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Documentation</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• <a href="https://docs.zama.ai/protocol/examples/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">FHEVM Examples</a></li>
                    <li>• <a href="https://docs.zama.ai/protocol/fhevm/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">FHEVM Protocol</a></li>
                    <li>• <a href="https://docs.zama.ai/protocol/solidity/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Solidity Library</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Community</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• <a href="https://github.com/zama-ai" target="_blank" rel="noopener noreferrer" className="hover:text-primary">GitHub Repository</a></li>
                    <li>• <a href="https://discord.gg/zama" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Discord Community</a></li>
                    <li>• <a href="https://twitter.com/zama_fhe" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Twitter Updates</a></li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>

        {/* Footer */}
        <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Built with ❤️ using Zama FHEVM
              </div>
              <div className="text-sm text-muted-foreground">
                Powered by <a href="https://zama.ai" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Zama</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;