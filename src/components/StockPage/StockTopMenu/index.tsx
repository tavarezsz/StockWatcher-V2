import { stockService } from '@/lib/StockService/stock-service';
import { getStockInitials } from '@/utils/getStockInitials';
import { BackButton } from './BackButton';
import { AddToWalletButton } from './AddToWalletButton';

type StockTopMenuProps = {
  symbol: string;
};

export async function StockTopMenu({ symbol }: StockTopMenuProps) {
  const stock = await stockService.getStockCached(symbol);
  const displaySymbol = stock.symbol.replace(/\.SA$/i, '');
  const initials = getStockInitials(stock.name);

  return (
    <header className='sticky top-0 z-50 flex h-16 shrink-0 items-center border-b border-border bg-white/95 px-4 backdrop-blur lg:h-[78px] lg:px-8'>
      <div className='flex min-w-0 w-full items-center justify-between gap-3'>
        <div className='flex min-w-0 items-center gap-2'>
          <BackButton />
          <div className='flex size-10 items-center justify-center rounded-lg bg-green-50 text-sm font-bold text-green-600'>
            {initials}
          </div>
          <div className='min-w-0'>
            <p className='text-base font-bold text-primary lg:hidden'>
              {displaySymbol}
            </p>
            <p className='hidden truncate text-base font-bold text-primary lg:block'>
              {stock.name} ({displaySymbol})
            </p>
            <p className='hidden text-xs text-gray-500 lg:block'>
              Ação listada na B3
            </p>
          </div>
        </div>

        <div className='flex shrink-0 gap-3'>
         <AddToWalletButton stock={stock}/>
        </div>
      </div>
    </header>
  );
}
