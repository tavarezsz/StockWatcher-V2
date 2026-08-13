import { StockModel } from '@/models/stock-model';
import { formatPrice, formatVariation } from '@/utils/formatters';
import { getStockInitials } from '@/utils/getStockInitials';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import { VariationBadge } from '../atoms/variationBadge';
import Link from 'next/link';

type StockCardProps = {
  stock: StockModel;
};

export function StockCard({ stock }: StockCardProps) {

  const price = formatPrice(stock.price);
  const initials = getStockInitials(stock.name)

  return (
    <Link href={`/stock/${stock.symbol}`} className='flex flex-col p-4 border border-border rounded-2xl relative'>
      {/*Linha 1 - Título, nome, variação*/}
      <div className='flex items-start justify-between'>
        <div className='flex gap-3'>
            <span className='text-sm text-green-600 bg-green-100 py-2.5 px-3.5 border border-transparent rounded-xl'>
                {initials}
            </span>
          <div className='flex flex-col items-start'>
            <p className='font-bold text-primary'>{stock.symbol}</p>
            <p className='text-sm text-muted truncate'>{stock.name}</p>
          </div>
        </div>
        <div>
          <VariationBadge variation={stock.changePercentDay} variationType='Absolute'/>
        </div>
      </div>

      <div>
        <p className='text-xl font-bold text-primary pt-2.5'>{price}</p>
      </div>
    </Link>
  );
}
