import { StockTopMenu } from '@/components/StockPage/StockTopMenu';
import { Suspense } from 'react';
import { normalizeStockSymbol } from '@/utils/stockRoute';

type StockLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ symbol: string }>;
};

export default function StockLayout({ children, params }: StockLayoutProps) {
  const stockSymbol = params.then(({ symbol }) =>
    normalizeStockSymbol(symbol),
  );

  return (
    <div className='flex min-h-full flex-col'>
      <Suspense fallback={<StockTopMenuSkeleton />}>
        {stockSymbol.then(symbol => (
          <StockTopMenu symbol={symbol} />
        ))}
      </Suspense>
      <div className='flex-1'>{children}</div>
    </div>
  );
}

function StockTopMenuSkeleton() {
  return (
    <div className='flex h-16 items-center gap-3 border-b border-border px-4 lg:h-[78px] lg:gap-4 lg:px-8'>
      <div className='size-8 animate-pulse rounded-md bg-gray-100' />
      <div className='size-10 animate-pulse rounded-lg bg-gray-100' />
      <div className='flex min-w-0 flex-1 flex-col gap-2'>
        <div className='h-4 w-20 animate-pulse rounded bg-gray-100 lg:w-40' />
        <div className='hidden h-3 w-52 animate-pulse rounded bg-gray-100 lg:block' />
      </div>
      <div className='size-10 animate-pulse rounded-lg bg-gray-100 sm:h-9 sm:w-44' />
    </div>
  );
}
