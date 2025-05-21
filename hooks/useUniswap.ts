import { useState, useCallback } from 'react';
import { UniswapService, SwapParameters, SwapQuote } from '@/lib/services/uniswap';
import { useProvider } from './useProvider';
import { useSigner } from './useSigner';
import { Token } from '@uniswap/sdk-core';

export function useUniswap() {
  const { provider } = useProvider();
  const { signer } = useSigner();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getQuote = useCallback(
    async (params: SwapParameters): Promise<SwapQuote | null> => {
      if (!provider) return null;
      setLoading(true);
      setError(null);

      try {
        const service = new UniswapService(provider);
        const quote = await service.getQuote(params);
        return quote;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to get quote');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [provider]
  );

  const executeSwap = useCallback(
    async (params: SwapParameters) => {
      if (!provider || !signer) {
        throw new Error('Provider and signer are required');
      }
      setLoading(true);
      setError(null);

      try {
        const service = new UniswapService(provider, signer);
        const tx = await service.executeSwap(params);
        const receipt = await tx.wait();
        return receipt;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Swap failed');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [provider, signer]
  );

  const createToken = useCallback(
    (address: string, decimals: number, symbol: string, name: string): Token => {
      return UniswapService.createToken(address, decimals, symbol, name);
    },
    []
  );

  return {
    getQuote,
    executeSwap,
    createToken,
    loading,
    error,
  };
}