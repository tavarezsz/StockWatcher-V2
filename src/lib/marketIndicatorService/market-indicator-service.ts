import { marketDataProvider } from '@/lib/marketDataProvider';
import { MarketIndicators } from '@/models/market-indicator';
import { cacheLife, cacheTag } from 'next/cache';

async function getIbovIndicatorsCachedInternal(): Promise<MarketIndicators> {
  'use cache';

  cacheLife('minutes');
  cacheTag('market:ibov');

  return marketDataProvider.getIbovIndicators();
}

class MarketIndicatorService {
  async getIbovIndicators(): Promise<MarketIndicators> {
    return getIbovIndicatorsCachedInternal();
  }
}

export const marketIndicatorService = new MarketIndicatorService();