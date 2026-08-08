import { PrismaClient } from "@/db/prisma/generated"
import { PrismaPg } from "@prisma/adapter-pg"
import { StockModel } from "@/models/stock-model"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })

export const db = new PrismaClient({ adapter })

export async function upsertStock(stock: StockModel) {
  return db.stock.upsert({
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
  })
}