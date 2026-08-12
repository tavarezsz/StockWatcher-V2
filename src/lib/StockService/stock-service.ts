import { StockModel } from "@/models/stock-model";
import { stockRepository } from "@/repositories/stock";
import { cacheLife, cacheTag, revalidateTag } from "next/cache";
import { marketDataProvider } from "../marketDataProvider";

async function getStockCachedInternal(symbol: string): Promise<StockModel> {
  "use cache";

  cacheLife("minutes");
  cacheTag(`stock:${symbol}`);

  const stock = await stockRepository.findBySymbol(symbol);

  if (stock) {
    return stock;
  }

  try {
    const stockProvider = await marketDataProvider.findBySymbol(symbol);

    return await stockRepository.createOrUpdate(stockProvider);
  } catch (err) {
    throw new Error("Erro ao procurar pela ação", {
      cause: err,
    });
  }
}

async function getManyStocksCachedInternal(
  symbols: string[],
): Promise<StockModel[]> {
  "use cache";

  cacheLife("minutes");
  const uniqueSymbols = [...new Set(symbols)];
  uniqueSymbols.forEach((symbol) => cacheTag(`stock:${symbol}`));

  if (uniqueSymbols.length === 0) {
    return [];
  }

  const cachedStocks = await stockRepository.findManyBySymbol(uniqueSymbols);
  const cachedSymbols = new Set(cachedStocks.map((stock) => stock.symbol));
  const missingSymbols = uniqueSymbols.filter(
    (symbol) => !cachedSymbols.has(symbol),
  );

  if (missingSymbols.length === 0) {
    return orderStocksBySymbols(cachedStocks, uniqueSymbols);
  }

  try {
    const providerStocks =
      await marketDataProvider.findBySymbolList(missingSymbols);

    const createdStocks = await Promise.all(
      providerStocks.map((stock) => stockRepository.createOrUpdate(stock)),
    );

    return orderStocksBySymbols(
      [...cachedStocks, ...createdStocks],
      uniqueSymbols,
    );
  } catch (err) {
    throw new Error("Erro ao procurar pelas ações", {
      cause: err,
    });
  }
}

function orderStocksBySymbols(
  stocks: StockModel[],
  symbols: string[],
): StockModel[] {
  const stockBySymbol = new Map(
    stocks.map((stock) => [stock.symbol, stock]),
  );

  return symbols
    .map((symbol) => stockBySymbol.get(symbol))
    .filter((stock): stock is StockModel => Boolean(stock));
}

class StockService {
  // chamado a partir de um cron job a cada x min, configurado no server
  async refreshQuoteFromCron(symbol: string): Promise<StockModel> {
    const fresh = await marketDataProvider.findBySymbol(symbol);
    const updatedStock = await stockRepository.createOrUpdate(fresh);

    revalidateTag(`stock:${symbol}`, "max");
    return updatedStock;
  }

  // Procura primeiro no banco por uma stock já mapeada; se não encontrar,
  // consulta o marketDataProvider e alimenta o banco.
  async getStockCached(symbol: string): Promise<StockModel> {
    return getStockCachedInternal(symbol);
  }

  async getManyStocksCached(symbols: string[]): Promise<StockModel[]> {
    return getManyStocksCachedInternal(symbols);
  }
}

export const stockService = new StockService();
