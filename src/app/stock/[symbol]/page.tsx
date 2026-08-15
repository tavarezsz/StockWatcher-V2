import { Container } from '@/components/Container';
import { SpinLoader } from '@/components/SpinLoader';
import { ActiveAlerts } from '@/components/StockPage/ActiveAlerts';
import { AlertForm } from '@/components/StockPage/AlertForm';
import { InfoSection } from '@/components/StockPage/InfoSection';
import { StockIndicators } from '@/components/StockPage/StockIndicators';
import { stockService } from '@/lib/StockService/stock-service';
import { Metadata } from 'next';
import { Suspense } from 'react';

type StockPageProps = {
  params: Promise<{ symbol: string }>;
};

//TODO: Validar implementação do gráfico

export async function generateMetadata({
  params,
}: StockPageProps): Promise<Metadata> {
  const { symbol } = await params;
  const stock = await stockService.getStockCached(symbol);

  return {
    title: stock.symbol,
    description: stock.name,
  };
}

export default function StockPage({ params }: StockPageProps) {
  return (
    <Container>
      <div className='flex gap-8'>
        <div className='flex flex-col w-3/5 gap-8'>
          <Suspense fallback={<SpinLoader />}>
            {params.then(({ symbol }) => (
              <InfoSection symbol={symbol} />
            ))}
          </Suspense>
          <Suspense fallback={<SpinLoader />}>
            {params.then(({ symbol }) => (
              <StockIndicators symbol={symbol} />
            ))}
          </Suspense>
        </div>
        <div className='flex flex-col gap-8 w-2/5'>
          <Suspense fallback={<SpinLoader />}>
            {params.then(({ symbol }) => (
              <AlertForm symbol={symbol} />
            ))}
          </Suspense>
          <Suspense fallback={<SpinLoader />}>
            {params.then(({ symbol }) => (
              <ActiveAlerts symbol={symbol} />
            ))}
          </Suspense>
        </div>
      </div>
    </Container>
  );
}
