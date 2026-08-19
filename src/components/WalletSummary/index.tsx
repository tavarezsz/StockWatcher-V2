import { walletService } from '@/lib/WalletService/wallet-service';
import { formatPrice } from '@/utils/formatters';
import { LastUpdate } from './LastUpdate';
import { VariationBadge } from '../atoms/variationBadge';
import { WalletHighlights } from './WalletHighlights';
import { getCurrentUser } from '@/lib/AuthService/auth-service';
import Link from 'next/link';

export async function WalletSummary() {
  const user = await getCurrentUser();
  if (!user) return null;

  const wallet = await walletService.getWalletCached(user.id);

  if (!wallet) return null;

  const totalValue = formatPrice(wallet.totalValue);
  

  return (
    <Link
      href='/wallet'
      prefetch={false}
      className='flex min-h-40 justify-between rounded-2xl border border-primary bg-primary px-5 py-6 shadow-lg shadow-primary/10 transition hover:-translate-y-0.5 lg:min-h-0 lg:border-border lg:bg-neutral-50 lg:px-7 lg:shadow-none'
    >
      <div className='flex min-w-0 flex-col justify-between gap-5 lg:justify-start lg:gap-0'>
        <p className='text-sm text-white/65 lg:text-gray-500'>
          Saldo total da sua carteira ·{' '}
          <LastUpdate updatedAt={wallet.updatedAt!.toISOString()} />
        </p>
        <div className='flex flex-col items-start flex-wrap gap-3 lg:flex-row lg:items-end'>
          <p className='text-3xl font-bold text-white sm:text-4xl lg:text-primary'>
            {totalValue}
          </p>
          <VariationBadge variation={wallet.dayProfitPercent} aditionalText='hoje'/>
        </div>
      </div>
      <WalletHighlights stocks={wallet.stocks ?? []} />
    </Link>
  );
}
