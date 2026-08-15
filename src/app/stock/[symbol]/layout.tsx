import { StockTopMenu } from '@/components/StockPage/StockTopMenu';
import { Suspense } from 'react';

type StockLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ symbol: string }>;
};

export default function StockLayout({ children, params }: StockLayoutProps) {
  return (
    <div className='flex min-h-full flex-col'>
      <Suspense fallback={<StockTopMenuSkeleton />}>
        {params.then(({ symbol }) => (
          <StockTopMenu symbol={symbol} />
        ))}
      </Suspense>
      <div className='flex-1'>{children}</div>
    </div>
  );
}

function StockTopMenuSkeleton() {
  return (
    <div className='flex h-[78px] items-center gap-4 border-b border-border px-8'>
      <div className='size-8 animate-pulse rounded-md bg-gray-100' />
      <div className='size-10 animate-pulse rounded-lg bg-gray-100' />
      <div className='flex flex-col gap-2'>
        <div className='h-4 w-40 animate-pulse rounded bg-gray-100' />
        <div className='h-3 w-52 animate-pulse rounded bg-gray-100' />
      </div>
    </div>
  );
}
