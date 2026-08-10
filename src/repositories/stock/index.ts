import { PrismaStockRepository } from "./prisma-stock-respository";
import { StockRepository } from "./stock-repository";

export const stockRepository : StockRepository = new PrismaStockRepository()
