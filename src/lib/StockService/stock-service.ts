// src/services/quote.service.ts

import { updateTag, revalidateTag } from "next/cache";
import { marketDataProvider } from "../marketDataProvider";
import { stockRepository } from "@/repositories/stock";
import { StockModel } from "@/models/stock-model";
import { cacheTag, cacheLife } from "next/cache";

class StockService {
  // chamado a partir de um cron job a cada x min, configurado no server
  async refreshQuoteFromCron(symbol: string): Promise<StockModel> {
    const fresh = await marketDataProvider.findBySymbol(symbol);
    const updatedStock = await stockRepository.createOrUpdate(fresh);

    revalidateTag(`stock:${symbol}`, "max"); // ok servir stale por um instante enquanto revalida
    return updatedStock;
  }

  //Procura primeiro no banco por uma stock já mapeada, se não bate no marketDataProvider e alimenta o banco
  async getStockCached(symbol: string): Promise<StockModel> {
    "use cache";

    cacheLife("minutes");
    cacheTag(`stock:${symbol}`);
    const stock = await stockRepository.findBySymbol(symbol);

    if (stock) {
      return stock;
    }

    //se não encontra no repository, a ação pode não ter sido inserida ainda no banco
    try {
      const newStockProvider = await marketDataProvider.findBySymbol(symbol);
      const newStock = await stockRepository.createOrUpdate(newStockProvider);
      return newStock;
    } catch (err) {
      throw new Error("Erro ao procurar pela ação ", { cause: err });
    }
  }
}

export const stockService = new StockService();
