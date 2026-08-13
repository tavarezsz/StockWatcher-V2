'use client';

import { timeDifInMinutes } from '@/utils/timeDifMinutes';
import { useEffect, useState } from 'react';

type LastUpdateProps = {
  updatedAt: string;
};

export function LastUpdate({ updatedAt }: LastUpdateProps) {
  const [minutes, setMinutes] = useState<number | null>(null);

  useEffect(() => {
    function updateMinutes() {
      setMinutes(timeDifInMinutes(updatedAt));
    }

    updateMinutes();
    const intervalId = window.setInterval(updateMinutes, 60_000);

    return () => window.clearInterval(intervalId);
  }, [updatedAt]);

  if (minutes === null) {
    return <span>atualizando...</span>;
  }

  return <span>atualizado há {minutes} min</span>;
}
