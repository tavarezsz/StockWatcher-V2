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

  const indicatorWrapClass = 'flex flex-col'
  const indicatorLabelClass = 'text-xs text-muted font-bold uppercase'
  const indicatorValueClass = 'text-primary font-bold text-lg'

  return (
    <div className='flex flex-col p-8 border border-border rounded-2xl bg-white gap-10'>
      <div className='flex flex-col gap-1'>
        <p className='text-muted text-sm font-semibold'>PREÇO ATUAL</p>
        <div className='flex items-end'>
          <p className='text-primary text-5xl font-black '>{price}</p>
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

      <div className='flex gap-20 border-t border-border pt-8'>
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
    </div>
  );
}
