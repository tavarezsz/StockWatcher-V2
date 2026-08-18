import { StockModel } from '@/models/stock-model';
import { StockCard } from '../StockCard';
import { getFeaturedStocks } from './getFeaturedStocks';
import Link from 'next/link';

type FeaturedStocksProps = {
  stocks?: StockModel[];
  seeAllLink?: string;
  maxItems?: number;
  lineItems?: number;
};

const gridColumns = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-2 xl:grid-cols-3',
  4: 'lg:grid-cols-2 xl:grid-cols-4',
} as const;

export async function FeaturedStocks({
  stocks,
  seeAllLink,
  maxItems = 6,
  lineItems = 3,
}: FeaturedStocksProps) {
  const columns =
    gridColumns[lineItems as keyof typeof gridColumns] ?? 'lg:grid-cols-3';

  const featuredStocks =
    stocks && stocks.length > 0
      ? stocks
      : await getFeaturedStocks();

  return (
    <section className='flex flex-col gap-4 lg:rounded-xl lg:border lg:border-border lg:bg-white lg:p-6'>
        <div className='flex items-center justify-between'>
            <h2 className='font-bold text-primary'>Ações em destaque</h2>
            {seeAllLink && <Link href={seeAllLink} className='text-sm font-semibold text-green-600 hover:text-green-800'>Ver todos</Link>}
        </div>
        <div className={`flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 lg:grid lg:gap-5 lg:overflow-visible lg:pb-0 ${columns}`}>
        {featuredStocks.slice(0, maxItems).map((stock) => (
            <StockCard key={stock.symbol} stock={stock} />
        ))}
        </div>
    </section>
  );
}
