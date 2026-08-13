import { Container } from '@/components/Container';
import { SpinLoader } from '@/components/SpinLoader';
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
      <Suspense fallback={<SpinLoader />}>
        {params.then(({ symbol }) => (
          <InfoSection symbol={symbol} />
        ))}
      </Suspense>
    </Container>
  );
}
