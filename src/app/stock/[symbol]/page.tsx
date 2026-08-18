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
    <Container>
      <div className='flex gap-8'>
        <div className='flex flex-col w-3/5 gap-8'>
          <Suspense fallback={<SkeletonLoader className='h-72' />}>
            {stockSymbol.then(symbol => (
              <InfoSection symbol={symbol} />
            ))}
          </Suspense>
          <Suspense fallback={<SkeletonLoader className='h-44' />}>
            {stockSymbol.then(symbol => (
              <StockIndicators symbol={symbol} />
            ))}
          </Suspense>
        </div>
        <div className='flex flex-col gap-8 w-2/5'>
          <Suspense fallback={<SkeletonLoader className='h-80' />}>
            {stockSymbol.then(symbol => (
              <AlertForm symbol={symbol} />
            ))}
          </Suspense>
          <Suspense fallback={<SkeletonLoader className='h-40' />}>
            {stockSymbol.then(symbol => (
              <ActiveAlerts symbol={symbol} />
            ))}
          </Suspense>
        </div>
      </div>
    </Container>
  );
}
