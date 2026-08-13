
export function timeDifInMinutes(timestamp: string | Date): number {
  const data = new Date(timestamp);
  const agora = new Date();

  if (Number.isNaN(data.getTime())) {
    throw new Error("Timestamp inválido");
  }

  return Math.floor((agora.getTime() - data.getTime()) / 60_000);
}