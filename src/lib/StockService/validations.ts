import type { StockInstanceDTO } from '@/models/wallet-model';
import { z } from 'zod';

const quantitySchema = z.preprocess(
  parseNumericInput,
  z
    .number({ error: 'Informe uma quantidade válida' })
    .finite('Informe uma quantidade válida')
    .positive('A quantidade deve ser maior que zero'),
);

const referencePriceSchema = z.preprocess(
  parseNumericInput,
  z
    .number({ error: 'Informe um preço de referência válido' })
    .finite('Informe um preço de referência válido')
    .positive('O preço de referência deve ser maior que zero'),
);

export const addToWalletSchema: z.ZodType<StockInstanceDTO> = z
  .object({
    stockSymbol: z
      .string({ error: 'Informe o código da ação' })
      .trim()
      .min(1, 'Informe o código da ação')
      .max(20, 'Código da ação inválido')
      .regex(
        /^[A-Z0-9]+(?:[.-][A-Z0-9]+)*$/i,
        'Código da ação inválido',
      )
      .transform(symbol => symbol.toUpperCase()),
    quantity: quantitySchema,
    referencePrice: referencePriceSchema,
  })
  .strict();

function parseNumericInput(value: unknown) {
  if (typeof value !== 'string') return value;

  const trimmedValue = value.trim();

  if (trimmedValue === '') return undefined;

  const normalizedValue = trimmedValue.includes(',')
    ? trimmedValue.replace(/\./g, '').replace(',', '.')
    : trimmedValue;

  return Number(normalizedValue);
}
