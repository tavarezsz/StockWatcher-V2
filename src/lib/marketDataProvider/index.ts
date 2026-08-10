import { MarketDataProvider } from "./market-data";
import { yahooStockProvider } from "./yahoo-stock-provider";

export const marketDataProvider: MarketDataProvider = new yahooStockProvider()