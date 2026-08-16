import type {
  WalletAssetDistribution,
  WalletModel,
} from '@/models/wallet-model';
import { formatPrice, formatVariation } from '@/utils/formatters';

type WalletCompositionProps = {
  wallet: WalletModel;
};

export function WalletComposition({ wallet }: WalletCompositionProps) {
  const distribution = groupSmallerPositions(wallet.assetDistribution);
  const assetsLabel = wallet.assetsQuantity === 1 ? 'ativo' : 'ativos';

  return (
    <div className='flex h-full flex-col gap-4 rounded-2xl border border-border bg-white p-6'>
      <div className='flex items-end justify-between gap-4'>
        <div className='flex flex-col gap-1'>
          <p className='text-sm text-gray-500'>Distribuição por ativo</p>
          <p className='text-2xl font-bold text-primary'>
            {wallet.assetsQuantity} {assetsLabel}
          </p>
        </div>
        <p className='text-xs text-gray-400'>Valor atual</p>
      </div>

      {distribution.length > 0 ? (
        <div className='flex flex-col gap-3'>
          {distribution.map(position => (
            <DistributionRow key={position.symbol} position={position} />
          ))}
        </div>
      ) : (
        <p className='flex flex-1 items-center justify-center py-6 text-sm text-gray-500'>
          Nenhum ativo na carteira.
        </p>
      )}
    </div>
  );
}

function DistributionRow({
  position,
}: {
  position: WalletAssetDistribution;
}) {
  const width = Math.min(Math.max(position.percentage, 0), 100);

  return (
    <div className='flex flex-col gap-1.5'>
      <div className='flex items-center justify-between gap-4 text-xs'>
        <div className='flex items-center gap-2'>
          <p className='font-bold text-primary'>{position.symbol}</p>
          <p className='text-gray-500'>
            {formatVariation(position.percentage)}%
          </p>
        </div>
        <p className='font-medium text-gray-600'>
          {formatPrice(position.currentValue)}
        </p>
      </div>
      <div className='h-2 overflow-hidden rounded-full bg-green-50'>
        <div
          className='h-full rounded-full bg-green-600'
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

function groupSmallerPositions(
  distribution: WalletAssetDistribution[],
): WalletAssetDistribution[] {
  const visiblePositions = distribution.slice(0, 4);
  const smallerPositions = distribution.slice(4);

  if (smallerPositions.length === 0) {
    return visiblePositions;
  }

  const otherPositions = smallerPositions.reduce<WalletAssetDistribution>(
    (result, position) => ({
      symbol: 'Outros',
      currentValue: result.currentValue + position.currentValue,
      percentage: result.percentage + position.percentage,
    }),
    { symbol: 'Outros', currentValue: 0, percentage: 0 },
  );

  return [...visiblePositions, otherPositions];
}
