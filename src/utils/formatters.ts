const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const variationFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const brazilTimeZone = 'America/Sao_Paulo';

const timeFormatter = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: brazilTimeZone,
});

const calendarDayFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  timeZone: brazilTimeZone,
});

const fullDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  timeZone: brazilTimeZone,
});

export function formatPrice(value: number) {
  return currencyFormatter.format(Math.abs(value));
}

export function formatVariation(value: number) {
  return variationFormatter.format(value);
}

export function formatLastUpdate(value: Date | string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const dayDifference =
    getCalendarDayNumber(new Date()) - getCalendarDayNumber(date);
  const time = timeFormatter.format(date);

  if (dayDifference === 0) {
    return `Hoje, ${time}`;
  }

  if (dayDifference === 1) {
    return `Ontem, ${time}`;
  }

  return `${fullDateFormatter.format(date)}, ${time}`;
}

function getCalendarDayNumber(date: Date) {
  const parts = calendarDayFormatter.formatToParts(date);
  const year = Number(parts.find(part => part.type === 'year')?.value);
  const month = Number(parts.find(part => part.type === 'month')?.value);
  const day = Number(parts.find(part => part.type === 'day')?.value);

  return Date.UTC(year, month - 1, day) / 86_400_000;
}
