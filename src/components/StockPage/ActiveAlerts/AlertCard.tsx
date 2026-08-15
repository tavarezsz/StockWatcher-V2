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
    <div className='flex bg-white border border-border rounded-xl p-3 justify-between'>
      <div>
        <p className='text-primary text-sm font-bold'>{cardText}</p>
        <p className='text-muted text-xs'>Criado em {createdAt}</p>
      </div>
      <DeleteAlertButton alertId={alert.id}/>
    </div>
  );
}
