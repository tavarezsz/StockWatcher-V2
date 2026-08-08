import { StockModel } from "@/models/stock-model"

export interface StockRepository{
    findAll(): Promise<StockModel[]>
    findBySymbol(symbol: string): Promise<StockModel>

    //mutation

    create(stock: StockModel): Promise<StockModel>
    update(symbol: string, newStockData: Omit<StockModel, 'symbol' | 'lastChange'>): Promise<StockModel>
    delete(symbol: string): Promise<StockModel>



}