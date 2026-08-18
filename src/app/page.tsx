import { Container } from '@/components/Container';
import { FeaturedIndicators } from '@/components/FeaturedIndicators';
import { FeaturedStocks } from '@/components/FeaturedStocks';
import { RecentAlerts } from '@/components/RecentAlerts';
import { SkeletonLoader } from '@/components/SpinLoader';
import { StockCard } from '@/components/StockCard';
import { WalletSummary } from '@/components/WalletSummary';
import { stockService } from '@/lib/StockService/stock-service';
import { Suspense } from 'react';

export default function Home() {
  return (
    <Container>
      <Suspense fallback={<SkeletonLoader heigth={28} />}>
        <WalletSummary />
      </Suspense>
      <FeaturedIndicators />
      <Suspense fallback={<SkeletonLoader heigth={72} />}>
        <FeaturedStocks seeAllLink='/stock' lineItems={2} maxItems={4} />
      </Suspense>
      <Suspense fallback={<SkeletonLoader heigth={96} />}>
        <RecentAlerts />
      </Suspense>
    </Container>
  );
}
