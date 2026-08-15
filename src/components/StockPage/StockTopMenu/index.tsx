import { stockService } from '@/lib/StockService/stock-service';
import { getStockInitials } from '@/utils/getStockInitials';
import { BackButton } from './BackButton';
import { PlusIcon } from 'lucide-react';

type StockTopMenuProps = {
  symbol: string;
};

export async function StockTopMenu({ symbol }: StockTopMenuProps) {
  const stock = await stockService.getStockCached(symbol);
  const displaySymbol = stock.symbol.replace(/\.SA$/i, '');
  const initials = getStockInitials(stock.name);

  return (
    <header className='flex h-[78px] shrink-0 items-center gap-4 border-b border-border bg-white px-8'>
      <div className='flex w-full justify-between'>
        <div className='flex items-center gap-2'>
          <BackButton />
          <div className='flex size-10 items-center justify-center rounded-lg bg-green-50 text-sm font-bold text-green-600'>
            {initials}
          </div>
          <div className='min-w-0'>
            <p className='truncate text-base font-bold text-primary'>
              {stock.name} ({displaySymbol})
            </p>
            <p className='text-xs text-gray-500'>Ação listada na B3</p>
          </div>
        </div>

        <div className='flex gap-3'>
          <button className='flex items-center py-2 px-3 bg-green-600 rounded-lg text-white gap-2 cursor-pointer hover:bg-green-700'>
            <PlusIcon size={16} />{' '}
            <p className='text-sm'>Adicionar à Carteira</p>
          </button>
        </div>
      </div>
    </header>
  );
}
