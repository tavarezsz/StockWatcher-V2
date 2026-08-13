import { walletService } from '@/lib/WalletService/wallet-service';
import { formatPrice } from '@/utils/formatters';
import { LastUpdate } from './LastUpdate';
import { VariationBadge } from '../atoms/variationBadge';
import { WalletHighlights } from './WalletHighlights';

export async function WalletSummary() {
  // TODO: implementação de session
  const wallet = await walletService.getWalletCached(
    process.env.DEV_USER_ID || 'b7a4ece1-f5c5-49d6-b37b-454de642fb36',
  );

  if (!wallet) return null;

  const totalValue = formatPrice(wallet.totalValue);
  

  return (
    <div className='flex py-6 px-7 border border-border bg-neutral-50 rounded-2xl justify-between '>
      <div className='flex flex-col'>
        <p className='text-sm text-gray-500'>
          Saldo total da sua carteira ·{' '}
          <LastUpdate updatedAt={wallet.updatedAt!.toISOString()} />
        </p>
        <div className='flex items-end gap-3'>
          <p className='text-primary text-4xl font-bold'>{totalValue}</p>
          <VariationBadge variation={wallet.totalProfitPercent} aditionalText='hoje'/>
        </div>
      </div>
      <WalletHighlights stocks={wallet.stocks ?? []} />
    </div>
  );
}
