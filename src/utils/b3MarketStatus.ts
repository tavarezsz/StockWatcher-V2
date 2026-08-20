const b3TimeZone = 'America/Sao_Paulo';
const closingGracePeriodMinutes = 10;

type TradingSession = {
  opensAt: number;
  closesAt: number;
};

type DatedTradingSession = TradingSession & {
  effectiveFrom: string;
};

type B3Calendar = {
  closedDates: ReadonlySet<string>;
  regularSessions: readonly DatedTradingSession[];
  specialSessions: ReadonlyMap<string, TradingSession>;
};

export type B3MarketStatus = {
  isOpen: boolean;
  reason:
    | 'open'
    | 'weekend'
    | 'holiday'
    | 'outside_trading_hours'
    | 'calendar_unavailable';
  localDate: string;
  localTime: string;
  session: {
    opensAt: string;
    closesAt: string;
    checksUntil: string;
  } | null;
};

// Atualizar a cada novo calendário anual ou mudança de grade publicada pela B3.
// Anos ausentes são tratados como mercado fechado para evitar chamadas indevidas.
const b3Calendars: Readonly<Record<number, B3Calendar>> = {
  2026: {
    closedDates: new Set([
      '2026-01-01',
      '2026-02-16',
      '2026-02-17',
      '2026-04-03',
      '2026-04-21',
      '2026-05-01',
      '2026-06-04',
      '2026-09-07',
      '2026-10-12',
      '2026-11-02',
      '2026-11-20',
      '2026-12-24',
      '2026-12-25',
      '2026-12-31',
    ]),
    regularSessions: [
      { effectiveFrom: '2026-01-01', opensAt: 10 * 60, closesAt: 18 * 60 },
      { effectiveFrom: '2026-03-09', opensAt: 10 * 60, closesAt: 17 * 60 },
    ],
    specialSessions: new Map([
      ['2026-02-18', { opensAt: 13 * 60, closesAt: 18 * 60 }],
    ]),
  },
};

const saoPauloDateFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: b3TimeZone,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
  weekday: 'short',
});

function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${String(hours).padStart(2, '0')}:${String(remainingMinutes).padStart(2, '0')}`;
}

function getRegularSession(
  calendar: B3Calendar,
  localDate: string,
): TradingSession {
  return calendar.regularSessions.reduce<TradingSession>(
    (currentSession, session) =>
      session.effectiveFrom <= localDate ? session : currentSession,
    calendar.regularSessions[0],
  );
}

export function getB3MarketStatus(now = new Date()): B3MarketStatus {
  const dateParts = Object.fromEntries(
    saoPauloDateFormatter
      .formatToParts(now)
      .filter(part => part.type !== 'literal')
      .map(part => [part.type, part.value]),
  );

  const year = Number(dateParts.year);
  const localDate = `${dateParts.year}-${dateParts.month}-${dateParts.day}`;
  const localTime = `${dateParts.hour}:${dateParts.minute}`;
  const calendar = b3Calendars[year];

  if (!calendar) {
    return {
      isOpen: false,
      reason: 'calendar_unavailable',
      localDate,
      localTime,
      session: null,
    };
  }

  if (dateParts.weekday === 'Sat' || dateParts.weekday === 'Sun') {
    return {
      isOpen: false,
      reason: 'weekend',
      localDate,
      localTime,
      session: null,
    };
  }

  if (calendar.closedDates.has(localDate)) {
    return {
      isOpen: false,
      reason: 'holiday',
      localDate,
      localTime,
      session: null,
    };
  }

  const tradingSession =
    calendar.specialSessions.get(localDate) ??
    getRegularSession(calendar, localDate);
  const currentMinutes = Number(dateParts.hour) * 60 + Number(dateParts.minute);
  const session = {
    opensAt: formatMinutes(tradingSession.opensAt),
    closesAt: formatMinutes(tradingSession.closesAt),
    checksUntil: formatMinutes(
      tradingSession.closesAt + closingGracePeriodMinutes,
    ),
  };

  if (
    currentMinutes < tradingSession.opensAt ||
    currentMinutes > tradingSession.closesAt + closingGracePeriodMinutes
  ) {
    return {
      isOpen: false,
      reason: 'outside_trading_hours',
      localDate,
      localTime,
      session,
    };
  }

  return {
    isOpen: true,
    reason: 'open',
    localDate,
    localTime,
    session,
  };
}
