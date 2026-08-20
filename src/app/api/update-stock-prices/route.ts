// app/api/update-stock-prices/route.ts

import { stockService } from '@/lib/StockService/stock-service'
import { alertService } from '@/lib/AlertService/alert-service'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret')
  if (secret !== process.env.CRON_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const quoteResult = await stockService.refreshAllQuotesFromCron()

  // O await garante a ordem: nenhum alerta é avaliado antes de todas as
  // tentativas de atualização e persistência das cotações terminarem.
  const alertResult = await alertService.checkAllAlerts(
    quoteResult.updatedSymbols,
  )

  return Response.json({
    quotes: {
      updated: quoteResult.updated,
      errors: quoteResult.errors,
    },
    alerts: alertResult,
  })
}
