import { stockService } from "@/lib/StockService/stock-service"

//Inicialmente hardcoded, mas pode ser exibida no futuro as açoes no banco com maior variação no dia anterior ou algo assim
const featuredStockList = ['PETR4.SA', 'ITUB4.SA','VALE3.SA','WEGE3.SA', 'COGN3.SA', 'MULT3.SA']

export async function getFeaturedStocks() {
    return await stockService.getManyStocksCached(featuredStockList)
}
