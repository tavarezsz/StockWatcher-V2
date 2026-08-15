
import { alertService } from "@/lib/AlertService/alert-service"
import type { AlertModel } from "@/models/alert-model"
import { BellIcon } from "lucide-react"
import { AlertCard } from "./AlertCard"

type ActiveAlertsProps = {
    symbol: string
}

export async function ActiveAlerts({symbol}: ActiveAlertsProps){
    //TODO: implementação de login
    const userId = process.env.DEV_USER_ID || 'b7a4ece1-f5c5-49d6-b37b-454de642fb36'
    const allUserAlerts = await alertService.getUserAlertsCached(userId)


    if(allUserAlerts.length === 0) return null

    const thisStockAlerts = allUserAlerts.filter((alert) => alert.stockSymbol === symbol && alert.status === "ativo")
    if(thisStockAlerts.length === 0) return null

    return(
        <div className="flex flex-col bg-white border border-border rounded-2xl p-6  gap-4">
            <p className="flex justify-between text-primary text-sm font-bold">Alertas Ativos ({thisStockAlerts.length}) <BellIcon size={18} className="text-green-600"/></p>
            <div className="flex flex-col gap-3">
                {thisStockAlerts.map((al: AlertModel) => {
                    return <AlertCard key={al.id} alert={al} />
                })}
            </div>
        </div>
    )
}
