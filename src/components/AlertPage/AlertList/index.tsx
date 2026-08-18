import { alertService } from '@/lib/AlertService/alert-service';
import type { AlertModel } from '@/models/alert-model';
import { AlertListTable, type AlertListRow } from './AlertListTable';
import { getCurrentUser } from '@/lib/AuthService/auth-service';

export async function AlertList() {
  const user = await getCurrentUser();
  if (!user) return null;

  const alerts = await alertService.getUserAlertsCached(user.id);
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
