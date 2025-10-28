"use client"

import { useState, useEffect } from 'react';
import { BrowserProvider } from 'ethers';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { detectNetwork, switchNetwork, NETWORKS, type NetworkName } from '@/lib/fhevm';
import { Moon, Sun, ExternalLink, Wallet } from 'lucide-react';

interface NavbarProps {
  onWalletConnect?: (provider: BrowserProvider, address: string) => void;
}

export function Navbar({ onWalletConnect }: NavbarProps) {
  const { theme, setTheme } = useTheme();
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string>('');
  const [network, setNetwork] = useState<NetworkName | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    checkConnection();
    
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const checkConnection = async () => {
    if (!window.ethereum) return;

    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();
      
      if (accounts.length > 0) {
        const address = accounts[0].address;
        setIsConnected(true);
        setAddress(address);
        setProvider(provider);
        
        const detectedNetwork = await detectNetwork(provider);
        setNetwork(detectedNetwork);
        
        onWalletConnect?.(provider, address);
      }
    } catch (error) {
      console.error('Failed to check connection:', error);
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setIsConnected(false);
      setAddress('');
      setProvider(null);
      setNetwork(null);
    } else {
      setAddress(accounts[0]);
      checkConnection();
    }
  };

  const handleChainChanged = () => {
    window.location.reload();
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask to use this application');
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      
      setIsConnected(true);
      setAddress(address);
      setProvider(provider);
      
      const detectedNetwork = await detectNetwork(provider);
      setNetwork(detectedNetwork);
      
      onWalletConnect?.(provider, address);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleNetworkSwitch = async (targetNetwork: NetworkName) => {
    if (!provider) return;
    
    try {
      const chainId = NETWORKS[targetNetwork].chainId;
      await switchNetwork(chainId);
    } catch (error) {
      console.error('Failed to switch network:', error);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  if (!mounted) {
    return null;
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-primary">🔐</div>
            <span className="text-xl font-semibold">Zama FHEVM</span>
          </div>

          {/* Center - Network Info */}
          <div className="flex items-center space-x-4">
            {isConnected && network && (
              <div className="flex items-center space-x-2">
                <div className="text-sm text-muted-foreground">Network:</div>
                <div className="flex space-x-2">
                  <Button
                    variant={network === 'hardhat' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleNetworkSwitch('hardhat')}
                  >
                    Hardhat Local
                  </Button>
                  <Button
                    variant={network === 'sepolia' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleNetworkSwitch('sepolia')}
                  >
                    Sepolia
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4" />
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
              />
              <Moon className="h-4 w-4" />
            </div>

            {/* Wallet Connection */}
            {isConnected ? (
              <div className="flex items-center space-x-2">
                <div className="text-sm text-muted-foreground">
                  {formatAddress(address)}
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            ) : (
              <Button onClick={connectWallet} className="flex items-center space-x-2">
                <Wallet className="h-4 w-4" />
                <span>Connect Wallet</span>
              </Button>
            )}

            {/* Zama Docs Link */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://docs.zama.ai/protocol/examples/', '_blank')}
              className="flex items-center space-x-2"
            >
              <span>View Zama Docs</span>
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}