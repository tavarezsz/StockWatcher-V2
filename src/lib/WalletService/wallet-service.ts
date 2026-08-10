import { WalletModel } from "@/models/wallet-model";
import { stockRepository } from "@/repositories/stock";
import { walletItemRepository } from "@/repositories/wallet";
import { StockInstance } from "@/models/wallet-model";
import { cacheTag, cacheLife } from "next/cache";

export class WalletService {
  //Cruza os dados do repositorio de wallet e stocks pra gerar a wallet do usuário atual
  //O objeto walletModel não tem persistencia em banco pois ele vai mudar a cada atualização de preço, fica no cache do next
  async getWallet(userId: string): Promise<WalletModel> {
    'use cache'

    cacheLife('minutes') //revalida wallet mais ou menos a cada 5 min
    cacheTag(`wallet:${userId}`)

    const items = await walletItemRepository.findByUserId(userId);
    const symbols = items.map((i) => i.stockSymbol);
    const stocks = await stockRepository.findManyBySymbol(symbols);
    const stockMap = new Map(stocks.map(s => [s.symbol, s]))

    const stockInstances: StockInstance[] = items.map((item) => ({
      stock: stockMap.get(item.stockSymbol)!,
      quantity: item.quantity,
      referencePrice: item.referencePrice,
    }));
    // se o usuário comprou PETR4 duas vezes por preços diferentes, aparecem 2 StockInstance de PETR4 na lista

    const totalValue = stockInstances.reduce(
        (sum, i) => sum + i.stock.price * i.quantity, 0
    )

    const totalInvested = stockInstances.reduce(
        (sum, i) => sum + i.referencePrice * i.quantity, 0
    )

    const totalProfitLoss = totalValue - totalInvested

    const totalProfitPercent = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0

    return{
        stocks: stockInstances,
        totalValue,
        totalProfitLoss,
        totalProfitPercent,
        assetsQuantity: stockInstances.length,
        updatedAt: new Date()
    }

  }
}
