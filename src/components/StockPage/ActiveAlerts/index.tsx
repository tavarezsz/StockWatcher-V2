
import { alertService } from "@/lib/AlertService/alert-service"
import type { AlertModel } from "@/models/alert-model"
import { BellIcon } from "lucide-react"
import { AlertCard } from "./AlertCard"
import { getCurrentUser } from '@/lib/AuthService/auth-service'

type ActiveAlertsProps = {
    symbol: string
}

export async function ActiveAlerts({symbol}: ActiveAlertsProps){
    const user = await getCurrentUser()
    if (!user) return null

    const allUserAlerts = await alertService.getUserAlertsCached(user.id)


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
