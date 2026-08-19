'use client';

import { DeleteAlertButton } from '@/components/RecentAlerts/DeleteAlertButton';
import type { AlertModel } from '@/models/alert-model';
import { formatPrice, formatVariation } from '@/utils/formatters';

type AlertCardProps = {
  alert: AlertModel;
};

const createdAtFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
});

export function AlertCard({ alert }: AlertCardProps) {
  const alertValue =
    alert.targetValueType === 'value'
      ? formatPrice(alert.targetValue)
      : formatVariation(alert.targetValue);

  const cardText = `${alert.targetCondition === 'above' ? 'Acima de' : 'Abaixo de'} ${alertValue}${alert.targetValueType === 'variationDay' ? '% no dia' : ''}`;
  const createdAt = createdAtFormatter.format(new Date(alert.createdAt));

  return (
    <div className='flex min-w-0 justify-between gap-2 rounded-xl border border-border bg-white p-3'>
      <div className='min-w-0'>
        <p className='break-words text-sm font-bold text-primary'>{cardText}</p>
        <p className='text-muted text-xs'>Criado em {createdAt}</p>
      </div>
      <DeleteAlertButton alertId={alert.id}/>
    </div>
  );
}
