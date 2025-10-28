"use client"

import { useState, useEffect } from 'react';
import { BrowserProvider } from 'ethers';
import { Navbar } from '@/components/navbar';
import { Counter } from '@/components/counter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Zap, Code, Globe, ExternalLink } from 'lucide-react';

export default function Home() {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [userAddress, setUserAddress] = useState<string>('');

  useEffect(() => {
    // Check if wallet is already connected
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        
        if (accounts.length > 0) {
          setProvider(provider);
          setUserAddress(accounts[0].address);
        }
      } catch (error) {
        console.error('Failed to check wallet connection:', error);
      }
    }
  };

  const handleWalletConnect = (newProvider: BrowserProvider, address: string) => {
    setProvider(newProvider);
    setUserAddress(address);
  };

  const handleWalletDisconnect = () => {
    setProvider(null);
    setUserAddress('');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        onWalletConnect={handleWalletConnect}
        onWalletDisconnect={handleWalletDisconnect}
        provider={provider}
        userAddress={userAddress}
      />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Welcome to <span className="text-primary">FHEVM</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Build privacy-preserving decentralized applications with Fully Homomorphic Encryption
          </p>
        </div>

        {/* Wallet Connection Prompt */}
        {!provider && (
          <Card className="max-w-md mx-auto mb-8">
            <CardHeader>
              <CardTitle>🔗 Connect Your Wallet</CardTitle>
              <CardDescription>
                Connect your wallet to start interacting with FHEVM smart contracts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Use the "Connect Wallet" button in the navigation bar to get started.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Counter Demo */}
        <div className="mb-12">
          <Counter provider={provider} userAddress={userAddress} />
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">Privacy First</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Perform computations on encrypted data without revealing sensitive information
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">High Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Optimized FHEVM implementation for efficient encrypted computations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Code className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">Developer Friendly</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Easy-to-use APIs and comprehensive documentation for rapid development
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Globe className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">Multi-Network</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Support for multiple networks including local development and testnets
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Resources Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>📚 Learn More</CardTitle>
            <CardDescription>
              Explore resources to help you build with FHEVM
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Button variant="outline" className="justify-start" asChild>
                <a 
                  href="https://docs.zama.ai/fhevm" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2"
                >
                  <span>FHEVM Documentation</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              
              <Button variant="outline" className="justify-start" asChild>
                <a 
                  href="https://github.com/zama-ai/fhevm" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2"
                >
                  <span>GitHub Repository</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              
              <Button variant="outline" className="justify-start" asChild>
                <a 
                  href="https://docs.zama.ai/fhevm/tutorials" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2"
                >
                  <span>Tutorials</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              
              <Button variant="outline" className="justify-start" asChild>
                <a 
                  href="https://discord.gg/fhe-org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2"
                >
                  <span>Community Discord</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground">
          <p>
            Built with ❤️ using{' '}
            <a 
              href="https://nextjs.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              Next.js
            </a>
            {' '}and{' '}
            <a 
              href="https://docs.zama.ai/fhevm" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              FHEVM
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}