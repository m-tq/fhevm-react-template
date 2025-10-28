"use client"

import { useState, useEffect } from 'react';
import { BrowserProvider, Contract } from 'ethers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { initializeFhevm, initializeFhevmWithEthereumProvider, encryptValue, decryptValue } from '@/lib/fhevm';
import { Plus, Minus, RotateCcw, Eye, EyeOff, Loader2 } from 'lucide-react';

// Mock contract ABI - replace with actual generated ABI
const COUNTER_ABI = [
  "function increment() external",
  "function decrement() external", 
  "function set(bytes calldata encryptedValue) external",
  "function get() external view returns (bytes memory)",
  "function compare(bytes calldata encryptedValue) external view returns (bytes memory)",
  "function reset() external",
  "event CounterChanged(address indexed user)"
];

// Mock contract address - replace with actual deployed address
const COUNTER_ADDRESS = "0x1234567890123456789012345678901234567890";

interface CounterProps {
  provider: BrowserProvider | null;
  userAddress: string;
}

export function Counter({ provider, userAddress }: CounterProps) {
  const [contract, setContract] = useState<Contract | null>(null);
  const [currentValue, setCurrentValue] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [compareValue, setCompareValue] = useState<string>('');
  const [compareResult, setCompareResult] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showValue, setShowValue] = useState(false);
  const [fhevmInitialized, setFhevmInitialized] = useState(false);

  useEffect(() => {
    if (provider && userAddress) {
      initializeContract();
      initializeFhevmInstance();
    }
  }, [provider, userAddress]);

  const initializeContract = async () => {
    if (!provider) return;

    try {
      const signer = await provider.getSigner();
      const counterContract = new Contract(COUNTER_ADDRESS, COUNTER_ABI, signer);
      setContract(counterContract);
    } catch (error) {
      console.error('Failed to initialize contract:', error);
    }
  };

  const initializeFhevmInstance = async () => {
    if (!provider) return;

    try {
      setIsLoading(true);
      // Prefer initializing via window.ethereum to guarantee EIP-1193
      await initializeFhevmWithEthereumProvider();
      setFhevmInitialized(true);
    } catch (error) {
      console.error('Failed to initialize FHEVM:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIncrement = async () => {
    if (!contract) return;

    try {
      setIsLoading(true);
      const tx = await contract.increment();
      await tx.wait();
      
      // Refresh the current value
      await getCurrentValue();
    } catch (error) {
      console.error('Failed to increment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecrement = async () => {
    if (!contract) return;

    try {
      setIsLoading(true);
      const tx = await contract.decrement();
      await tx.wait();
      
      // Refresh the current value
      await getCurrentValue();
    } catch (error) {
      console.error('Failed to decrement:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSet = async () => {
    if (!contract || !inputValue) return;

    try {
      setIsLoading(true);
      const value = parseInt(inputValue);
      const encryptedValue = await encryptValue(value);
      
      const tx = await contract.set(encryptedValue);
      await tx.wait();
      
      setInputValue('');
      await getCurrentValue();
    } catch (error) {
      console.error('Failed to set value:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    if (!contract) return;

    try {
      setIsLoading(true);
      const tx = await contract.reset();
      await tx.wait();
      
      setCurrentValue(0);
      setCompareResult(null);
    } catch (error) {
      console.error('Failed to reset:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentValue = async () => {
    if (!contract || !showValue) return;

    try {
      setIsLoading(true);
      const encryptedResult = await contract.get();
      const decryptedValue = await decryptValue(encryptedResult, userAddress);
      setCurrentValue(decryptedValue);
    } catch (error) {
      console.error('Failed to get current value:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompare = async () => {
    if (!contract || !compareValue) return;

    try {
      setIsLoading(true);
      const value = parseInt(compareValue);
      const encryptedValue = await encryptValue(value);
      
      const encryptedResult = await contract.compare(encryptedValue);
      const decryptedResult = await decryptValue(encryptedResult, userAddress);
      setCompareResult(Boolean(decryptedResult));
      setCompareValue('');
    } catch (error) {
      console.error('Failed to compare:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowValue = async () => {
    setShowValue(!showValue);
    if (!showValue) {
      await getCurrentValue();
    } else {
      setCurrentValue(null);
    }
  };

  if (!provider || !userAddress) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>🔐 Encrypted Counter</CardTitle>
          <CardDescription>
            Connect your wallet to interact with the FHEVM encrypted counter
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!fhevmInitialized) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>🔐 Encrypted Counter</CardTitle>
          <CardDescription>
            Initializing FHEVM...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          🔐 Encrypted Counter
          <Button
            variant="outline"
            size="sm"
            onClick={toggleShowValue}
            className="flex items-center space-x-2"
          >
            {showValue ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span>{showValue ? 'Hide' : 'Show'} Value</span>
          </Button>
        </CardTitle>
        <CardDescription>
          Perform encrypted operations on a private counter using FHEVM
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Current Value Display */}
        <div className="text-center">
          <div className="text-sm text-muted-foreground mb-2">Current Value</div>
          <div className="text-3xl font-bold">
            {showValue ? (
              currentValue !== null ? currentValue : (
                isLoading ? <Loader2 className="h-8 w-8 animate-spin mx-auto" /> : '???'
              )
            ) : (
              '🔒 Hidden'
            )}
          </div>
        </div>

        {/* Increment/Decrement Buttons */}
        <div className="flex space-x-2">
          <Button
            onClick={handleIncrement}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center space-x-2"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            <span>Increment</span>
          </Button>
          <Button
            onClick={handleDecrement}
            disabled={isLoading}
            variant="outline"
            className="flex-1 flex items-center justify-center space-x-2"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Minus className="h-4 w-4" />}
            <span>Decrement</span>
          </Button>
        </div>

        {/* Set Value */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Set Encrypted Value</label>
          <div className="flex space-x-2">
            <Input
              type="number"
              placeholder="Enter value"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
            />
            <Button
              onClick={handleSet}
              disabled={isLoading || !inputValue}
            >
              Set
            </Button>
          </div>
        </div>

        {/* Compare Value */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Compare with Value</label>
          <div className="flex space-x-2">
            <Input
              type="number"
              placeholder="Compare value"
              value={compareValue}
              onChange={(e) => setCompareValue(e.target.value)}
              disabled={isLoading}
            />
            <Button
              onClick={handleCompare}
              disabled={isLoading || !compareValue}
              variant="outline"
            >
              Compare
            </Button>
          </div>
          {compareResult !== null && (
            <div className="text-sm text-center">
              Result: <span className={compareResult ? 'text-green-600' : 'text-red-600'}>
                {compareResult ? 'Equal ✓' : 'Not Equal ✗'}
              </span>
            </div>
          )}
        </div>

        {/* Reset Button */}
        <Button
          onClick={handleReset}
          disabled={isLoading}
          variant="destructive"
          className="w-full flex items-center justify-center space-x-2"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
          <span>Reset Counter</span>
        </Button>

        {/* Info */}
        <div className="text-xs text-muted-foreground text-center">
          All operations are performed on encrypted data using FHEVM.
          The actual values remain private on the blockchain.
        </div>
      </CardContent>
    </Card>
  );
}