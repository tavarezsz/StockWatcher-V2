import { alertService } from '@/lib/AlertService/alert-service';
import type { AlertModel } from '@/models/alert-model';
import { formatPrice, formatVariation } from '@/utils/formatters';
import { DeleteAlertButton } from './DeleteAlertButton';

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

const statusConfig: Record<
  AlertModel['status'],
  { label: string; classes: string }
> = {
  ativo: {
    label: 'Ativo',
    classes: 'bg-green-100 text-green-600',
  },
  disparado: {
    label: 'Disparado',
    classes: 'border border-border bg-background-sec text-gray-500',
  },
  pausado: {
    label: 'Pausado',
    classes: 'bg-gray-100 text-gray-600',
  },
};

export async function RecentAlerts() {
  const alerts = await alertService.getUserAlertsCached(
    process.env.DEV_USER_ID || 'b7a4ece1-f5c5-49d6-b37b-454de642fb36',
  );

  const displayedAlerts = [...alerts]
    .sort(
      (first, second) =>
        new Date(second.updatedAt ?? second.createdAt).getTime() -
        new Date(first.updatedAt ?? first.createdAt).getTime(),
    )
    .slice(0, 5);
  const activeAlerts = alerts.filter(alert => alert.status === 'ativo').length;

  return (
    <section className='overflow-hidden rounded-xl border border-border bg-white p-6'>
      <div className='mb-5 flex items-center gap-3'>
        <h2 className='text-lg font-bold text-primary'>Alertas recentes</h2>
        <span className='flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-600'>
          <span className='size-1.5 rounded-full bg-green-600' />
          {activeAlerts} ativos
        </span>
      </div>

      {displayedAlerts.length > 0 ? (
        <div className='overflow-x-auto'>
          <table className='w-full min-w-175 table-fixed border-collapse text-left'>
            <thead>
              <tr className='border-b border-border text-[11px] font-semibold uppercase tracking-wide text-gray-400'>
                <th className='w-[25%] px-1 py-3'>Ativo</th>
                <th className='w-[22%] px-1 py-3'>Tipo</th>
                <th className='w-[16%] px-1 py-3'>Valor alvo</th>
                <th className='w-[16%] px-1 py-3'>Criação</th>
                <th className='w-[16%] px-1 py-3'>Status</th>
                <th className='w-[5%] px-1 py-3 text-right'>Ações</th>
              </tr>
            </thead>
            <tbody>
              {displayedAlerts.map((alert, index) => (
                <AlertRow
                  key={alert.id ?? `${alert.stockSymbol}-${index}`}
                  alert={alert}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className='py-8 text-center text-sm text-gray-500'>
          Nenhum alerta configurado.
        </p>
      )}
    </section>
  );
}

function AlertRow({ alert }: { alert: AlertModel }) {
  const status = statusConfig[alert.status];

  return (
    <tr className='border-b border-border text-sm last:border-b-0'>
      <td className='px-1 py-3.5 font-bold text-primary'>
        {alert.stockSymbol}
      </td>
      <td className='px-1 py-3.5 text-gray-600'>{formatAlertType(alert)}</td>
      <td className='px-1 py-3.5 font-medium text-primary'>
        {formatTargetValue(alert)}
      </td>
      <td className='px-1 py-3.5 text-gray-500'>
        {dateFormatter.format(new Date(alert.createdAt))}
      </td>
      <td className='px-1 py-3.5'>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.classes}`}
        >
          <span className='size-1.5 rounded-full bg-current' />
          {status.label}
        </span>
      </td>
      <td className='px-1 py-3.5 text-right'>
        <DeleteAlertButton alertId={alert.id} />
      </td>
    </tr>
  );
}

function formatAlertType(alert: AlertModel) {
  if (alert.targetValueType === 'variationDay') {
    return `Variação ${alert.targetCondition === 'above' ? '>' : '<'}`;
  }

  return alert.targetCondition === 'above'
    ? 'Preço acima de'
    : 'Preço abaixo de';
}

function formatTargetValue(alert: AlertModel) {
  if (alert.targetValueType === 'variationDay') {
    return `${formatVariation(alert.targetValue)}%`;
  }

  return formatPrice(alert.targetValue);
}
