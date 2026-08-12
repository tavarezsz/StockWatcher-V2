import YahooFinance from 'yahoo-finance2';
import { marketDataProvider } from '.';

async function getB3Volume() {
 return await marketDataProvider.getIbovIndicators()
}

console.log(await getB3Volume());
