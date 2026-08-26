import { StockModel } from '@/models/stock-model';
import { StockCard } from '../StockCard';
import { getFeaturedStocks } from './getFeaturedStocks';
import { ExpandableStockGrid } from './ExpandableStockGrid';

type FeaturedStocksProps = {
  stocks?: StockModel[];
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
      <ExpandableStockGrid
        columns={columns}
        initialItems={Math.max(maxItems, 1)}
      >
        {featuredStocks.map((stock) => (
            <StockCard key={stock.symbol} stock={stock} />
        ))}
      </ExpandableStockGrid>
    </section>
  );
}
