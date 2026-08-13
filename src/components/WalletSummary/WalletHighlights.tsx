'use client';

import { StockInstance } from '@/models/wallet-model';
import { useMemo } from 'react';
import { VariationBadge } from '../atoms/variationBadge';

type WalletHighlightsProps = {
  stocks: StockInstance[];
};

export function WalletHighlights({ stocks }: WalletHighlightsProps) {
  const { biggestGain, biggestLoss } = useMemo(() => {
    const stocksBySymbol = new Map(
      stocks.map(({ stock }) => [stock.symbol, stock]),
    );

    return [...stocksBySymbol.values()].reduce<{
      biggestGain: StockInstance['stock'] | null;
      biggestLoss: StockInstance['stock'] | null;
    }>(
      (highlights, stock) => {
        if (
          stock.changePercentDay > 0 &&
          (!highlights.biggestGain ||
            stock.changePercentDay > highlights.biggestGain.changePercentDay)
        ) {
          highlights.biggestGain = stock;
        }

        if (
          stock.changePercentDay < 0 &&
          (!highlights.biggestLoss ||
            stock.changePercentDay < highlights.biggestLoss.changePercentDay)
        ) {
          highlights.biggestLoss = stock;
        }

        return highlights;
      },
      { biggestGain: null, biggestLoss: null },
    );
  }, [stocks]);

  return (
    <div className='flex gap-6 items-center'>
      <Highlight label='Maior alta' stock={biggestGain} classes='text-green-600' />
      <Highlight label='Maior queda' stock={biggestLoss} classes='text-red-600' />
    </div>
  );
}

type HighlightProps = {
  label: string;
  stock: StockInstance['stock'] | null;
  classes?:string
};

function Highlight({ label, stock, classes }: HighlightProps) {
  return (
    <div className='flex flex-col gap-1'>
      <p className='text-xs text-gray-500 text-right'>{label}</p>
      {stock ? (
        <div className='flex items-center'>
          <p className={`text-sm font-semibold ${classes}`}>{stock.symbol}</p>
          <VariationBadge variation={stock.changePercentDay} background={false} />
        </div>
      ) : (
        <p className='text-sm text-gray-400'>—</p>
      )}
    </div>
  );
}
