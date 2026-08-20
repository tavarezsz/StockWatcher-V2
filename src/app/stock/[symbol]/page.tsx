import { Container } from '@/components/Container';
import { SkeletonLoader } from '@/components/SpinLoader';
import { ActiveAlerts } from '@/components/StockPage/ActiveAlerts';
import { AlertForm } from '@/components/StockPage/AlertForm';
import { InfoSection } from '@/components/StockPage/InfoSection';
import { StockIndicators } from '@/components/StockPage/StockIndicators';
import { stockService } from '@/lib/StockService/stock-service';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { normalizeStockSymbol } from '@/utils/stockRoute';

type StockPageProps = {
  params: Promise<{ symbol: string }>;
};

//TODO: Validar implementação do gráfico

export async function generateMetadata({
  params,
}: StockPageProps): Promise<Metadata> {
  const { symbol: routeSymbol } = await params;
  const symbol = normalizeStockSymbol(routeSymbol);
  const stock = await stockService.getStockCached(symbol);

  return {
    title: stock.symbol,
    description: stock.name,
  };
}

export default function StockPage({ params }: StockPageProps) {
  const stockSymbol = params.then(({ symbol }) =>
    normalizeStockSymbol(symbol),
  );

  return (
    <Container className='gap-5 p-4 sm:p-6 lg:p-8'>
      <div className='grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-5 xl:gap-8'>
        <div className='flex min-w-0 flex-col gap-5 xl:col-span-3 xl:gap-8'>
          <Suspense fallback={<SkeletonLoader className=' min-h-[210px] lg:min-h-[279px]' />}>
            {stockSymbol.then(symbol => (
              <InfoSection symbol={symbol} />
            ))}
          </Suspense>
          <Suspense fallback={<SkeletonLoader className='min-h-[254px] lg:min-h-[192px]' />}>
            {stockSymbol.then(symbol => (
              <StockIndicators symbol={symbol} />
            ))}
          </Suspense>
        </div>
        <div className='flex min-w-0 flex-col gap-5 xl:col-span-2 xl:gap-8'>
          <Suspense fallback={<SkeletonLoader className='min-h-[331px] lg:min-h-[339px]' />}>
            {stockSymbol.then(symbol => (
              <AlertForm symbol={symbol} />
            ))}
          </Suspense>
          <Suspense fallback={<SkeletonLoader className='min-h-[148px]' />}>
            {stockSymbol.then(symbol => (
              <ActiveAlerts symbol={symbol} />
            ))}
          </Suspense>
        </div>
      </div>
    </Container>
  );
}
