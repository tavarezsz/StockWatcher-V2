import { StockModel } from "@/models/stock-model"
import { Prisma } from "@/db/prisma/generated";

export type StockSearchOptions = {
  where?: Prisma.StockWhereInput;
  orderBy?:
    | Prisma.StockOrderByWithRelationInput
    | Prisma.StockOrderByWithRelationInput[];
  limit?: number;
  offset?: number;
};


export interface StockRepository{
    findAll(): Promise<StockModel[]>
    findBySymbol(symbol: string): Promise<StockModel | null>
    findManyBySymbol(symbols: string[]): Promise<StockModel[]>
    search(where: StockSearchOptions): Promise<StockModel[]>

    //mutation

    createOrUpdate(stock: StockModel): Promise<StockModel>
    delete(symbol: string): Promise<StockModel>

}