import { alertService } from '@/lib/AlertService/alert-service';
import type { AlertModel } from '@/models/alert-model';
import { AlertListTable, type AlertListRow } from './AlertListTable';

export async function AlertList() {
  // TODO: implementar autenticação
  const userId =
    process.env.DEV_USER_ID || 'b7a4ece1-f5c5-49d6-b37b-454de642fb36';

  if (!userId) return null;

  const alerts = await alertService.getUserAlertsCached(userId);
  const rows: AlertListRow[] = [...alerts]
    .sort(
      (first, second) =>
        new Date(second.createdAt).getTime() -
        new Date(first.createdAt).getTime(),
    )
    .map(toAlertListRow);

  return <AlertListTable rows={rows} />;
}

function toAlertListRow(alert: AlertModel): AlertListRow {
  return {
    id: alert.id,
    stockSymbol: alert.stockSymbol,
    targetValue: alert.targetValue,
    targetValueType: alert.targetValueType,
    targetCondition: alert.targetCondition,
    status: alert.status,
    createdAt: new Date(alert.createdAt).toISOString(),
  };
}
