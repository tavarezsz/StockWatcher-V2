import { stockService } from "@/lib/StockService/stock-service"
import { StockModel } from "@/models/stock-model"

type StockIndicatorsProps = {
    symbol : string
}

export async function StockIndicators({symbol}: StockIndicatorsProps){

    const stock = await stockService.getStockCached(symbol)

    if(!stock) return null

    return(
        <section className="flex flex-col bg-white p-8 border border-border rounded-2xl gap-6">
            <h3 className="text-primary font-bold">Indicadores Fundamentalistas</h3>
            <div className="flex gap-8">
                {stock.peRatio && <StockIndicator title="P/L" value={stock.peRatio} />}
                {stock.dividendYield > 0 && <StockIndicator title="Dividend Yield" value={stock.dividendYield} percent />}
                {stock.priceToBook && <StockIndicator title="P/VP" value={stock.priceToBook} />}
            </div>
        </section>
    )

}

type StockIndicatorProps = {
    title: string,
    value: number,
    percent?: boolean
}

function StockIndicator({title, value, percent }: StockIndicatorProps){


    const formattedValue = value.toString().replace(".", ",")

    return(
        <div className="flex flex-col bg-background-sec border border-border rounded-lg p-4 w-full">
            <p className="text-xs font-bold text-muted capitalize">{title}</p>
            <p className="text-primary text-xl font-bold">{formattedValue}{percent ? "%" : ""}</p>
        </div>
    )
}