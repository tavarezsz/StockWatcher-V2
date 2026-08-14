import { Container } from '@/components/Container';
import { SpinLoader } from '@/components/SpinLoader';
import { AlertForm } from '@/components/StockPage/AlertForm';
import { InfoSection } from '@/components/StockPage/InfoSection';
import { stockService } from '@/lib/StockService/stock-service';
import { Metadata } from 'next';
import { Suspense } from 'react';

type StockPageProps = {
  params: Promise<{ symbol: string }>;
};

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
        <div className='flex flex-col w-3/5'>
          <Suspense fallback={<SpinLoader />}>
            {params.then(({ symbol }) => (
              <InfoSection symbol={symbol} />
            ))}
          </Suspense>
        </div>
        <div className='flex flex-col w-2/5'>
          <Suspense fallback={<SpinLoader />}>
            {params.then(({ symbol }) => (
              <AlertForm symbol={symbol} />
            ))}
          </Suspense>
        </div>
      </div>
    </Container>
  );
}
