export type StockModel = {
    symbol: string;
    name: string;
    price: number;
    openPrice: number;
    changePercentDay: number;
    dayHigh: number;
    dayLow: number;
    dividendYield: number;
    priceToBook: number | null;
    peRatio: number | null;
    lastChange: Date | null;
}