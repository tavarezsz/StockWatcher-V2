// app/api/check-alerts/route.ts

import { stockService } from '@/lib/StockService/stock-service'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret')
  if (secret !== process.env.CRON_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const result = await stockService.refreshAllQuotesFromCron()
  return Response.json(result)
}