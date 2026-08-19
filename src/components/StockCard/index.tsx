import { StockModel } from '@/models/stock-model';
import { formatPrice } from '@/utils/formatters';
import { getStockInitials } from '@/utils/getStockInitials';
import { VariationBadge } from '../atoms/variationBadge';
import Link from 'next/link';
import { getStockHref } from '@/utils/stockRoute';

type StockCardProps = {
  stock: StockModel;
};

export function StockCard({ stock }: StockCardProps) {

  const price = formatPrice(stock.price);
  const initials = getStockInitials(stock.name)

  return (
    <Link
      href={getStockHref(stock.symbol)}
      prefetch={false}
      className='relative flex min-w-55 snap-start flex-col rounded-2xl border border-border bg-white p-4 transition hover:border-green-300 hover:shadow-sm lg:min-w-0'
    >
      {/*Linha 1 - Título, nome, variação*/}
      <div className='flex items-start justify-between'>
        <div className='flex gap-3'>
            <span className='text-sm text-green-600 bg-green-100 py-2.5 px-3.5 border border-transparent rounded-xl'>
                {initials}
            </span>
          <div className='flex flex-col items-start'>
            <p className='font-bold text-primary'>{stock.symbol}</p>
            <p className='max-w-28 truncate text-sm text-muted sm:max-w-36 lg:max-w-52'>{stock.name}</p>
          </div>
        </div>
        <div className='absolute bottom-4 right-4 lg:static '>
          <VariationBadge variation={stock.changePercentDay}/>
        </div>
      </div>

      <div>
        <p className='text-xl font-bold text-primary pt-2.5'>{price}</p>
      </div>
    </Link>
  );
}
