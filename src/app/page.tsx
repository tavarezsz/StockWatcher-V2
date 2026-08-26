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
      <Suspense fallback={<SkeletonLoader className='min-h-[160px] lg:min-h-[110px]' />}>
        <WalletSummary />
      </Suspense>
      <FeaturedIndicators />
      <Suspense fallback={<SkeletonLoader className='min-h-[168px] lg:min-h-[342px]' />}>
        <FeaturedStocks lineItems={2} maxItems={4} />
      </Suspense>
      <Suspense fallback={<SkeletonLoader className='min-h-[341px] lg:min-h-[400px]' />}>
        <RecentAlerts />
      </Suspense>
    </Container>
  );
}
