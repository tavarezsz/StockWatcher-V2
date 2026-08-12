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
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4',
} as const;

export async function FeaturedStocks({
  stocks,
  seeAllLink,
  maxItems = 6,
  lineItems = 3,
}: FeaturedStocksProps) {
  const columns =
    gridColumns[lineItems as keyof typeof gridColumns] ?? 'grid-cols-3';

  const featuredStocks =
    stocks && stocks.length > 0
      ? stocks
      : await getFeaturedStocks();

  return (
    <section className=' flex flex-col bg-white p-6 border gap-5 border-border rounded-xl'>
        <div className='flex justify-between '> 
            <p className='font-bold text-primary'>Destaques</p> 
            {seeAllLink && <Link href={seeAllLink} className='text-green-600 text-sm hover:text-green-800'>Ver todos</Link>}
        </div>
        <div className={`grid gap-5 ${columns} `}>
        {featuredStocks.slice(0, maxItems).map((stock) => (
            <StockCard key={stock.symbol} stock={stock} />
        ))}
        </div>
    </section>
  );
}
