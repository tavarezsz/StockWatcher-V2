import { stockService } from "@/lib/StockService/stock-service"

export async function getFeaturedStocks() {
    return await stockService.getFeaturedStocksCached(10)
}
