/**
 * Utility for loading RelayerSDK with npm fallback
 */

declare global {
  interface Window {
    relayerSDK?: any;
  }
}

export async function ensureRelayerSDK(): Promise<void> {
  // Check if already loaded
  if (window.relayerSDK && typeof window.relayerSDK === 'object') {
    return;
  }

  try {
    console.log('[RelayerSDK] Attempting to load from npm package...');
    
    // Try to load from npm package directly
    const relayerSDK = await import('@zama-fhe/relayer-sdk');
    
    // Attach to window
    window.relayerSDK = relayerSDK;
    
    console.log('[RelayerSDK] Successfully loaded from npm package');
  } catch (error) {
    console.error('[RelayerSDK] Failed to load from npm package:', error);
    throw new Error('Failed to load RelayerSDK from npm package');
  }
}