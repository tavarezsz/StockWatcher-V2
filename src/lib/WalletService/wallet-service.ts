import { WalletAssetDistribution, WalletModel } from "@/models/wallet-model";
import { stockRepository } from "@/repositories/stock";
import { walletItemRepository } from "@/repositories/wallet";
import { StockInstance } from "@/models/wallet-model";
import { cacheTag, cacheLife, updateTag } from "next/cache";

async function getWalletCachedInternal(userId: string): Promise<WalletModel> {
    "use cache";

    cacheLife("minutes"); //revalida wallet mais ou menos a cada 5 min
    cacheTag(`wallet:${userId}`);

    const wallet = await walletService.getWallet(userId);
    wallet.stocks?.forEach((s) => cacheTag(`stock:${s.stock.symbol}`));
    return wallet;
  }

export class WalletService {
  //Cruza os dados do repositorio de wallet e stocks pra gerar a wallet do usuário atual
  //O objeto walletModel não tem persistencia em banco pois ele vai mudar a cada atualização de preço, fica no cache do next
  async getWallet(userId: string): Promise<WalletModel> {
    const items = await walletItemRepository.findByUserId(userId);
    const symbols = items.map((i) => i.stockSymbol);
    const stocks = await stockRepository.findManyBySymbol(symbols);
    const stockMap = new Map(stocks.map((s) => [s.symbol, s]));

    const stockInstances: StockInstance[] = items.map((item) => ({
      itemId: item.id,
      stock: stockMap.get(item.stockSymbol)!,
      quantity: item.quantity,
      referencePrice: item.referencePrice,
    }));
    // se o usuário comprou PETR4 duas vezes por preços diferentes, aparecem 2 StockInstance de PETR4 na lista

    const totalValue = stockInstances.reduce(
      (sum, i) => sum + i.stock.price * i.quantity,
      0,
    );

    const totalInvested = stockInstances.reduce(
      (sum, i) => sum + i.referencePrice * i.quantity,
      0,
    );

    const totalProfitLoss = totalValue - totalInvested;

    const totalProfitPercent =
      totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;

    const openingValue = stockInstances.reduce(
      (sum, item) => sum + item.stock.openPrice * item.quantity,
      0,
    );

    const dayProfitLoss = stockInstances.reduce(
      (sum, item) =>
        sum + (item.stock.price - item.stock.openPrice) * item.quantity,
      0,
    );

    const dayProfitPercent =
      openingValue > 0 ? (dayProfitLoss / openingValue) * 100 : 0;

    const positionValues = stockInstances.reduce((positions, item) => {
      const positionValue = item.stock.price * item.quantity;
      const currentValue = positions.get(item.stock.symbol) ?? 0;

      positions.set(item.stock.symbol, currentValue + positionValue);
      return positions;
    }, new Map<string, number>());

    const assetDistribution: WalletAssetDistribution[] = [
      ...positionValues.entries(),
    ]
      .map(([symbol, currentValue]) => ({
        symbol,
        currentValue,
        percentage: totalValue > 0 ? (currentValue / totalValue) * 100 : 0,
      }))
      .sort((first, second) => second.currentValue - first.currentValue);

    return {
      stocks: stockInstances,
      totalValue,
      totalInvested,
      totalProfitLoss,
      totalProfitPercent,
      dayProfitLoss,
      dayProfitPercent,
      assetsQuantity: assetDistribution.length,
      assetDistribution,
      updatedAt: new Date(),
    };
  }

  async getWalletCached(userId: string): Promise<WalletModel> {
    return getWalletCachedInternal(userId)
  }

  async addAsset(
    userId: string,
    stockSymbol: string,
    quantity: number,
    referencePrice: number,
  ) {
    await walletItemRepository.create({
      userId,
      quantity,
      referencePrice,
      stockSymbol,
    });

    updateTag(`wallet:${userId}`);

    return {
      success: true,
    };
  }

  async removeAsset(userId: string, assetId: string) {
    const wallet = await this.getWallet(userId);
    const match = wallet.stocks?.find((s) => s.itemId === assetId);

    if (!match) throw new Error("Item não encontrado");

    const item = await walletItemRepository.findById(match.itemId);

    if (!item || item.userId !== userId) throw new Error("Item não encontrado");

    const itemDeleted = await walletItemRepository.delete(item.id);

    if (itemDeleted) {
      updateTag(`wallet:${userId}`);
      return {
        success: true,
      };
    }
  }

  async updateAsset(
    userId: string,
    stockId: string,
    quantity?: number,
    referencePrice?: number,
  ) {
    const item = await walletItemRepository.findById(stockId);

    if (!item || item.userId !== userId) throw new Error("Item não encontrado");

    const changes = {
      ...(quantity !== undefined && { quantity }),
      ...(referencePrice !== undefined && { referencePrice }),
    };

    const updatedItem = await walletItemRepository.update(stockId, changes);

    if(updatedItem){
      updateTag(`wallet:${userId}`);
      return{
        success: true
      }
    }
  }
}

export const walletService = new WalletService()
