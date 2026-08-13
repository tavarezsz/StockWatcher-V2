import { Container } from '@/components/Container';
import { FeaturedIndicators } from '@/components/FeaturedIndicators';
import { FeaturedStocks } from '@/components/FeaturedStocks';
import { RecentAlerts } from '@/components/RecentAlerts';
import { SpinLoader } from '@/components/SpinLoader';
import { StockCard } from '@/components/StockCard';
import { WalletSummary } from '@/components/WalletSummary';
import { stockService } from '@/lib/StockService/stock-service';
import { Suspense } from 'react';

export default function Home() {
  return (
    <Container>
      <Suspense fallback={<SpinLoader />}>
        <WalletSummary />
      </Suspense>
      <FeaturedIndicators />
      <Suspense fallback={<SpinLoader />}>
        <FeaturedStocks seeAllLink='/stock' lineItems={2} maxItems={4} />
      </Suspense>
      <RecentAlerts/>
    </Container>
  );
}
