import { StockModel } from "@/models/stock-model";
import { stockRepository } from "@/repositories/stock";
import { cacheLife, cacheTag, revalidateTag } from "next/cache";
import { marketDataProvider } from "../marketDataProvider";

export type RefreshQuotesResponse = {
  updated: number;
  errors: number;
};

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

  async refreshAllQuotesFromCron(): Promise<RefreshQuotesResponse> {
    const allStocks = await stockRepository.findAll();

    const allStockSymbols = [
      ...new Set(allStocks.map((stock) => stock.symbol)),
    ];

    if (allStockSymbols.length === 0) {
      return { updated: 0, errors: 0 };
    }

    let freshStocks: StockModel[];

    try {
      freshStocks =
        await marketDataProvider.findBySymbolList(allStockSymbols);
    } catch (error) {
      console.error("Erro ao atualizar cotações no provider", error);

      return { updated: 0, errors: allStockSymbols.length };
    }

    const requestedSymbols = new Set(allStockSymbols);
    const freshStocksBySymbol = new Map(
      freshStocks
        .filter((stock) => requestedSymbols.has(stock.symbol))
        .map((stock) => [stock.symbol, stock]),
    );
    const uniqueFreshStocks = [...freshStocksBySymbol.values()];
    const missingStocks = allStockSymbols.filter(
      (symbol) => !freshStocksBySymbol.has(symbol),
    ).length;

    const updateResults = await Promise.allSettled(
      uniqueFreshStocks.map(async (stock) => {
        const updatedStock = await stockRepository.createOrUpdate(stock);
        revalidateTag(`stock:${stock.symbol}`, "max");
        return updatedStock;
      }),
    );

    const updated = updateResults.filter(
      (result) => result.status === "fulfilled",
    ).length;
    const updateErrors = updateResults.length - updated;

    updateResults.forEach((result, index) => {
      if (result.status === "rejected") {
        const stock = uniqueFreshStocks[index];
        console.error(`Erro ao atualizar ${stock.symbol}`, result.reason);
      }
    });

    return {
      updated,
      errors: missingStocks + updateErrors,
    };
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
