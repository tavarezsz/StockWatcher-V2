import { walletService } from '@/lib/WalletService/wallet-service';
import { formatPrice, formatVariation } from '@/utils/formatters';
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from 'lucide-react';
import { LastUpdate } from '../../WalletSummary/LastUpdate';
import { WalletComposition } from './WalletComposition';

export async function WalletInfo() {
  // TODO: implementar autenticação
  const userId =
    process.env.DEV_USER_ID || 'b7a4ece1-f5c5-49d6-b37b-454de642fb36';

  if (!userId) return null;

  const wallet = await walletService.getWalletCached(userId);

  if (!wallet) return null;

  return (
    <div className='flex flex-col gap-5 xl:flex-row'>
      <div className='flex w-full flex-col justify-between gap-6 rounded-2xl border border-border bg-white p-6 xl:w-3/5'>
        <div className='flex items-start justify-between gap-4'>
          <div className='flex flex-col gap-1'>
            <p className='text-sm text-gray-500'>Patrimônio total</p>
            <p className='text-3xl font-bold text-primary'>
              {formatPrice(wallet.totalValue)}
            </p>
          </div>
          {wallet.updatedAt && (
            <p className='text-xs text-gray-400'>
              <LastUpdate updatedAt={wallet.updatedAt.toISOString()} />
            </p>
          )}
        </div>

        <div className='grid grid-cols-1 gap-5 border-t border-border pt-5 sm:grid-cols-3'>
          <div className='flex flex-col gap-1'>
            <p className='text-xs text-gray-500'>Capital investido</p>
            <p className='text-lg font-bold text-primary'>
              {formatPrice(wallet.totalInvested)}
            </p>
          </div>
          <PerformanceMetric
            label='Lucro/Prejuízo total'
            value={wallet.totalProfitLoss}
            percentage={wallet.totalProfitPercent}
          />
          <PerformanceMetric
            label='Resultado hoje'
            value={wallet.dayProfitLoss}
            percentage={wallet.dayProfitPercent}
          />
        </div>
      </div>

      <div className='w-full xl:w-2/5'>
        <WalletComposition wallet={wallet} />
      </div>
    </div>
  );
}

type PerformanceMetricProps = {
  label: string;
  value: number;
  percentage: number;
};

function PerformanceMetric({
  label,
  value,
  percentage,
}: PerformanceMetricProps) {
  const isPositive = value > 0;
  const isNegative = value < 0;
  const classes = isPositive
    ? 'text-green-600'
    : isNegative
      ? 'text-red-600'
      : 'text-gray-500';
  const Icon = isPositive
    ? ArrowUpIcon
    : isNegative
      ? ArrowDownIcon
      : MinusIcon;

  return (
    <div className='flex min-w-0 flex-col gap-1'>
      <p className='text-xs text-gray-500'>{label}</p>
      <p className={`flex items-center gap-1 text-lg font-bold ${classes}`}>
        <Icon className='shrink-0' size={16} />
        <span className='truncate'>{formatPrice(value)}</span>
      </p>
      <p className={`text-xs font-semibold ${classes}`}>
        {formatVariation(percentage)}%
      </p>
    </div>
  );
}
