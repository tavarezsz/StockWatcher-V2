import { walletService } from '@/lib/WalletService/wallet-service';
import { getStockInitials } from '@/utils/getStockInitials';
import { WalletAssetsTable, type WalletAssetRow } from './WalletAssetsTable';

export async function WalletAssets() {
  // TODO: implementar autenticação
  const userId =
    process.env.DEV_USER_ID || 'b7a4ece1-f5c5-49d6-b37b-454de642fb36';

  if (!userId) return null;

  const wallet = await walletService.getWalletCached(userId);

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
