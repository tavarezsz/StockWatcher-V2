import { Container } from '@/components/Container';
import { FeaturedIndicators } from '@/components/FeaturedIndicators';
import { FeaturedStocks } from '@/components/FeaturedStocks';
import { RecentAlerts } from '@/components/RecentAlerts';
import { SkeletonLoader } from '@/components/SpinLoader';
import { WalletSummary } from '@/components/WalletSummary';
import { Suspense } from 'react';

export default function Home() {
  return (
    <Container className='gap-5 p-4 sm:p-6 lg:gap-7 lg:p-8'>
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
