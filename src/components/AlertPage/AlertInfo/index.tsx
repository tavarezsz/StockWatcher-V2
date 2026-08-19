import { alertService } from "@/lib/AlertService/alert-service"
import { connection } from "next/server"
import { getCurrentUser } from '@/lib/AuthService/auth-service'

const LAST_24_HOURS_IN_MS = 24 * 60 * 60 * 1000

export async function AlertInfo(){
    const user = await getCurrentUser()
    if(!user) return null

    const alerts = await alertService.getUserAlertsCached(user.id)
    if(alerts.length === 0) return null

    const activeAlerts = alerts.filter((alert) => alert.status === "ativo").length

    const dispatchedAlerts = alerts.filter((alert) => alert.status === "disparado")

    // A lista continua cacheada, mas o limite das últimas 24h usa o horário
    // da requisição atual. AlertInfo já está dentro de Suspense na página.
    await connection()
    const now = Date.now()
    const last24HoursLimit = now - LAST_24_HOURS_IN_MS

    const dispatchedAlerts24h = dispatchedAlerts.filter((alert) => {
        if (!alert.updatedAt) return false

        const dispatchedAt = new Date(alert.updatedAt).getTime()

        return Number.isFinite(dispatchedAt)
            && dispatchedAt >= last24HoursLimit
            && dispatchedAt <= now
    }).length


    return(
        <section className="grid w-full grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
            <InfoAlertCard title="Total de alertas" value={alerts.length} />
            <InfoAlertCard title="Ativos" value={activeAlerts} type="active" />
            <InfoAlertCard title="Disparados (24H)" value={dispatchedAlerts24h} />
            <InfoAlertCard title="Total disparados" value={dispatchedAlerts.length} type="muted" />
        </section>
    )
}

type InfoAlertCardProps = {
    title: string
    value: number
    type?: 'default' | 'active' | 'muted'
}

function InfoAlertCard({title, value, type='default'}: InfoAlertCardProps) {

    const cardTypes: Record<string, string> = {
        'default': 'text-primary',
        'active': 'text-green-600',
        'muted': 'text-muted'
    }

    return(
        <article className="flex min-w-0 flex-col gap-1 rounded-xl border border-border bg-white p-4 lg:p-5">
            <p className="text-xs font-bold capitalize text-muted sm:text-sm">{title}</p>
            <p className={`text-2xl font-bold ${cardTypes[type]}`}>{value}</p>
        </article>
    )
}
