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

export type WalletAssetDistribution = {
    symbol: string
    currentValue: number
    percentage: number
}

export type WalletModel = {
    stocks?: StockInstance[]
    totalValue: number
    totalInvested: number
    totalProfitLoss: number
    totalProfitPercent: number
    dayProfitLoss: number
    dayProfitPercent: number
    assetsQuantity: number
    assetDistribution: WalletAssetDistribution[]
    updatedAt: Date | undefined 
}
