import { SearchResultModel } from "@/models/search-result-model";
import { StockModel } from "@/models/stock-model";

export interface MarketDataProvider {
  findBySymbol(symbol: string): Promise<StockModel>;
  findBySymbolList(symbols: string[]): Promise<StockModel[]>;
  search(term: string):Promise<SearchResultModel[]>;
}
