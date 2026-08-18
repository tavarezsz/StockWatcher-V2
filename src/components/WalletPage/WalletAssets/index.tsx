import { walletService } from '@/lib/WalletService/wallet-service';
import { getStockInitials } from '@/utils/getStockInitials';
import { WalletAssetsTable, type WalletAssetRow } from './WalletAssetsTable';
import { getCurrentUser } from '@/lib/AuthService/auth-service';

export async function WalletAssets() {
  const user = await getCurrentUser();
  if (!user) return null;

  const wallet = await walletService.getWalletCached(user.id);

  if (!wallet) return null;

  const rows: WalletAssetRow[] = (wallet.stocks ?? []).map((item) => {
    const total = item.stock.price * item.quantity;
    const invested = item.referencePrice * item.quantity;

    return {
      itemId: item.itemId,
      symbol: item.stock.symbol,
      name: item.stock.name,
      initials: getStockInitials(item.stock.name),
      quantity: item.quantity,
      referencePrice: item.referencePrice,
      currentPrice: item.stock.price,
      variation: item.stock.changePercentDay,
      total,
      result: total - invested,
    };
  });

  return (
    <WalletAssetsTable
      rows={rows}
      updatedAt={wallet.updatedAt?.toISOString()}
    />
  );
}
