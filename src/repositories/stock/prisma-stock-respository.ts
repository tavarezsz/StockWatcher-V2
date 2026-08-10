import { StockModel } from "@/models/stock-model";
import { StockRepository } from "./stock-repository";
import 'dotenv/config'

import { db } from "../client";

export class PrismaStockRepository implements StockRepository {

  async findAll(): Promise<StockModel[]> {

    const stocks = await db.stock.findMany()
    return stocks;
  }

  async findBySymbol(symbol: string): Promise<StockModel | null>{
    const stock = await db.stock.findUnique({
      where: {symbol: symbol}
    })
    return stock
  }

  async findManyBySymbol(symbols: string[]): Promise<StockModel[]>{
    const stocks = await db.stock.findMany({
      where: {symbol: { in: symbols}}
    })
    return stocks
  }

  async createOrUpdate(stock: StockModel): Promise<StockModel> {

    return await db.stock.upsert({
      where: { symbol: stock.symbol },
      update: {
        name: stock.name,
        price: stock.price,
        openPrice: stock.openPrice,
        changePercentDay: stock.changePercentDay,
        dayHigh: stock.dayHigh,
        dayLow: stock.dayLow,
        dividendYield: stock.dividendYield,
        priceToBook: stock.priceToBook,
        peRatio: stock.peRatio,
        lastChange: new Date(),
      },
      create: {
        symbol: stock.symbol,
        name: stock.name,
        price: stock.price,
        openPrice: stock.openPrice,
        changePercentDay: stock.changePercentDay,
        dayHigh: stock.dayHigh,
        dayLow: stock.dayLow,
        dividendYield: stock.dividendYield,
        priceToBook: stock.priceToBook,
        peRatio: stock.peRatio,
        lastChange: new Date(),
      },
    });
  }

  //Essa função é voltada pra testes, não vai existir deleção fisica de ações na aplicação
  async delete(symbol: string): Promise<StockModel>{


    const searchStock = await this.findBySymbol(symbol)

    if(!searchStock){
      throw new Error("Ação não encontrada")
    }

    const stock = await db.stock.delete({
      where: {
        symbol: symbol
      }
    })

    return stock
  }

}
