// app/api/check-alerts/route.ts

import { NextRequest } from 'next/server'
import { alertService } from '@/lib/AlertService/alert-service'

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret')
  if (secret !== process.env.CRON_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const result = await alertService.checkAllAlerts()
  return Response.json(result)
}