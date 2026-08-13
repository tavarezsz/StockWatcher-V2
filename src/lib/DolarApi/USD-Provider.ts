import { formatPrice, formatVariation } from '@/utils/formatters';
import { cacheLife } from 'next/cache';

type DolarPrice = {
  price: string;
  lastDayVariation: number;
};

export async function getCurrentUsdPrice(): Promise<DolarPrice> {
    "use cache"
    cacheLife("hours")

  const response = await fetch('https://br.dolarapi.com/v1/cotacoes/usd');
  const data = await response.json();

  const lastClose = data?.fechoAnterior;
 
  const price = data?.compra ?? lastClose;

  const lastDayVariation = ((price - lastClose) / lastClose) * 100;

  return{
    price: formatPrice(price),
    lastDayVariation: lastDayVariation
  }
}

getCurrentUsdPrice();
