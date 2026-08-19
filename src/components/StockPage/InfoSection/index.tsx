import { VariationBadge } from '@/components/atoms/variationBadge';
import { stockService } from '@/lib/StockService/stock-service';
import { formatLastUpdate, formatPrice } from '@/utils/formatters';

type InfoSectionProps = {
  symbol: string;
};

export async function InfoSection({ symbol }: InfoSectionProps) {
  const stock = await stockService.getStockCached(symbol);
  const price = formatPrice(stock.price);
  const lastChange = stock.lastChange
    ? formatLastUpdate(stock.lastChange)
    : null;

  const openPrice = formatPrice(stock.openPrice)
  const dayLow = formatPrice(stock.dayLow)
  const dayhigh = formatPrice(stock.dayHigh)

  const indicatorWrapClass = 'flex min-w-0 flex-col'
  const indicatorLabelClass = 'text-[10px] text-muted font-bold uppercase sm:text-xs'
  const indicatorValueClass = 'break-words text-sm font-bold text-primary sm:text-lg'

  return (
    <section className='flex flex-col gap-7 rounded-2xl border border-border bg-white p-5 sm:p-6 lg:gap-10 lg:p-8'>
      <div className='flex flex-col gap-1'>
        <p className='text-muted text-sm font-semibold'>PREÇO ATUAL</p>
        <div className='flex flex-wrap items-end gap-1'>
          <p className='text-3xl font-black text-primary sm:text-4xl lg:text-5xl'>{price}</p>
          <VariationBadge
            variation={stock.changePercentDay}
            background={false}
          />
        </div>
        {lastChange && (
          <p className='text-muted text-sm'>
            Última atualização: {lastChange}
          </p>
        )}
      </div>

      <div className='grid grid-cols-3 gap-3 border-t border-border pt-5 sm:gap-8 lg:gap-20 lg:pt-8'>
        <div className={indicatorWrapClass}>
          <p className={indicatorLabelClass}>Abertura</p>
          <p className={indicatorValueClass}>{openPrice}</p>
        </div>

        <div className={indicatorWrapClass}>
          <p className={indicatorLabelClass}>Mínima (dia)</p>
          <p className={indicatorValueClass}>{dayLow}</p>
        </div>

        <div className={indicatorWrapClass}>
          <p className={indicatorLabelClass}>Máxima (dia)</p>
          <p className={indicatorValueClass}>{dayhigh}</p>
        </div>
      </div>
    </section>
  );
}
