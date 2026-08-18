'use server';

import { z } from 'zod';
import { getCurrentUser } from '@/lib/AuthService/auth-service';
import { stockService } from '@/lib/StockService/stock-service';
import type { SearchResultModel } from '@/models/search-result-model';

export type StockSearchResponse = {
  results: SearchResultModel[];
  error?: string;
};

const searchTermSchema = z
  .string()
  .trim()
  .min(2, 'Digite ao menos 2 caracteres')
  .max(40, 'A busca deve possuir no máximo 40 caracteres');

export async function searchStocksAction(
  term: unknown,
): Promise<StockSearchResponse> {
  const user = await getCurrentUser();

  if (!user) {
    return { results: [], error: 'Faça login para buscar ativos' };
  }

  const parsedTerm = searchTermSchema.safeParse(term);

  if (!parsedTerm.success) {
    return {
      results: [],
      error: parsedTerm.error.issues[0]?.message ?? 'Busca inválida',
    };
  }

  try {
    const results = await stockService.search(parsedTerm.data);

    return {
      results: results.slice(0, 8).map(stock => ({
        symbol: stock.symbol,
        name: stock.name,
        sector: stock.sector,
        industry: stock.industry,
        price: stock.price,
      })),
    };
  } catch (error) {
    console.error('Erro ao buscar ações', error);
    return { results: [], error: 'Não foi possível realizar a busca' };
  }
}
