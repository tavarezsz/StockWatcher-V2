import { PrismaStockRepository } from "./prisma-stock-respository";
import { StockRepository } from "./stock-repository";

const stockRepository:StockRepository = new PrismaStockRepository()

async function test() {
  /* const stock = await stockRepository.create({
    symbol: 'PETR4Teste',
    name: 'Petrobras',
    price: 36.42,
    openPrice: 35.90,
    changePercentDay: 2.4,
    dayHigh: 36.80,
    dayLow: 35.60,
    dividendYield: 0.12,
    priceToBook: 1.8,
    peRatio: 7.2,
    lastChange: new Date(),
  }) */

const stocks =  await stockRepository.findAll()
  console.log('Resultado: ', stocks)
}

test()

