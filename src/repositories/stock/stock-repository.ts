import { StockModel } from "@/models/stock-model"

export interface StockRepository{
    findAll(): Promise<StockModel[]>
    findBySymbol(symbol: string): Promise<StockModel | null>
    findManyBySymbol(symbols: string[]): Promise<StockModel[]>

    //mutation

    createOrUpdate(stock: StockModel): Promise<StockModel>
    delete(symbol: string): Promise<StockModel>



}