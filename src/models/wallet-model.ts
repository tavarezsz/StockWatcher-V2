import { StockModel } from "./stock-model"

export type StockInstance = {
    itemId: string;
    stock: StockModel;
    quantity: number;
    referencePrice: number;
}

export type StockInstanceDTO = {
    stockSymbol: string,
    quantity: number
    referencePrice: number
}

export type WalletModel = {
    stocks?: StockInstance[]
    totalValue: number
    totalProfitLoss: number
    totalProfitPercent: number
    assetsQuantity: number
    updatedAt: Date | undefined 
}
