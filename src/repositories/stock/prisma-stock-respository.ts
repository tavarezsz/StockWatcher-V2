import { StockModel } from "@/models/stock-model";
import { StockRepository } from "./stock-repository";
import 'dotenv/config'

import { db } from "../client";

export class PrismaStockRepository implements StockRepository {

  async findAll(): Promise<StockModel[]> {

    const stocks = await db.stock.findMany()
    return stocks;
  }

  async create(stock: StockModel): Promise<StockModel> {

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
        lastChange: stock.lastChange,
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
        lastChange: stock.lastChange,
      },
    });
  }
}
