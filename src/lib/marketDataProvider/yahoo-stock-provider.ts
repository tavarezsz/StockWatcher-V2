import { StockModel } from "@/models/stock-model";
import { MarketDataProvider } from "./market-data";
import YahooFinance from "yahoo-finance2";
import quote, { Quote, ResultType } from "yahoo-finance2/modules/quote";
import { SearchResultModel } from "@/models/search-result-model";
import { SearchOptions } from "yahoo-finance2/modules/search";

export class yahooStockProvider implements MarketDataProvider {
  private yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

  //limita os resultados de busca da API para mercados especificos
  //atualmente só retorna resultados da bolsa brasileira
  //pode ser extendido mas é necessário lidar com conversão de moeda em tempo real
  private acceptedExchangeLocations = ["São Paulo", "BVMF", "SAO"]

  private parseStockInfo(stock: Quote): StockModel {

    return {
      symbol: stock.symbol,
      price: stock.regularMarketPrice,
      name: stock.longName || stock.shortName || stock.symbol,
      openPrice: stock.regularMarketOpen,
      changePercentDay: stock.regularMarketChangePercent,
      dayHigh: stock.regularMarketDayHigh,
      dayLow: stock.regularMarketDayLow,
      dividendYield: stock.trailingAnnualDividendYield
        ? Number((stock.trailingAnnualDividendYield * 100).toFixed(2))
        : 0,
      priceToBook: stock.priceToBook
        ? Number(stock.priceToBook.toFixed(2))
        : null,
      peRatio: stock.trailingPE ? Number(stock.trailingPE.toFixed(2)) : null,
      lastChange: null,
    };
  }

  private parseResultInfo(result: any[]): SearchResultModel[] {
    if (!Array.isArray(result)) return [];

    return (
      result
        
        .filter((res) => res?.index === "quotes" && res?.symbol)
        .map(
          (res): SearchResultModel => ({
            symbol: res.symbol,
            name: res.longname || res.shortname || "",
            sector: res.sector ?? "",
            industry: res.industry ?? "",
          }),
        )
    );
  }

  //erro bloqueante, pra ser usado na página stock details
  async findBySymbol(symbol: string): Promise<StockModel> {
    const stock: Quote = await this.yahooFinance.quote(symbol);

    if( ! stock || !this.acceptedExchangeLocations.includes(stock?.exchange)){
      throw new Error("Ação não encontrada");
    }

    return this.parseStockInfo(stock);
  }

  async findBySymbolList(symbols: string[]): Promise<StockModel[]> {
    const stocks: Quote[] = await this.yahooFinance.quote(symbols);

    const filteredStocks = stocks.filter((s) => this.acceptedExchangeLocations.includes(s.exchange))
    const parsedStocks = filteredStocks.map((s) => this.parseStockInfo(s));

    return parsedStocks;
  }

  async search(term: string): Promise<SearchResultModel[]> {
    const searchOptions: SearchOptions = {
      newsCount: 0,
      region: "BR",
    };

    const results = await this.yahooFinance.search(term, searchOptions);

    const filteredResult = results?.quotes.filter((res) => this.acceptedExchangeLocations.includes(res.exchDisp as string))

    console.log("filtered ", filteredResult)

    if (filteredResult.length === 0) {
      return [];
    }

    const resultsParsed = this.parseResultInfo(filteredResult);

    // Extrai os símbolos válidos
    const quoteSymbols: string[] = resultsParsed
      .map((stock: SearchResultModel) => stock.symbol)
      .filter((symbol): symbol is string => Boolean(symbol));

    if (quoteSymbols.length === 0) {
      return [];
    }

    try {
      const stocksInfo = await this.findBySymbolList(quoteSymbols);

      console.log("Stock raw: ", stocksInfo)

      //Cria um Map de Símbolo | Preço para busca rápida O(1)
      const priceMap = new Map<string, number>(
        stocksInfo.map((stock) => [stock.symbol, stock.price]),
      );

      //Mescla o preço no SearchResultModel
      return resultsParsed.map((result) => ({
        ...result,
        price: priceMap.get(result.symbol) ?? 0,
      }));
    } catch (error) {
      console.error(
        "Erro ao carregar preços para os resultados da busca:",
        error,
      );
      return resultsParsed
    }
  }
}