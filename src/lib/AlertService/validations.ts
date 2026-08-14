import type { AlertModel } from '@/models/alert-model';
import { z } from 'zod';

export type CreateAlertInput = Pick<
  AlertModel,
  'stockSymbol' | 'targetValue' | 'targetValueType' | 'targetCondition'
>;

const targetValueSchema = z.preprocess(value => {
  if (typeof value !== 'string') return value;

  const normalizedValue = value.trim().replace(',', '.');
  return normalizedValue === '' ? undefined : Number(normalizedValue);
}, z.number({ error: 'Informe um valor alvo válido' }).finite('Informe um valor alvo válido'));

export const createAlertSchema: z.ZodType<CreateAlertInput> = z
  .object({
    stockSymbol: z
      .string({ error: 'Informe o código da ação' })
      .trim()
      .min(1, 'Informe o código da ação')
      .max(20, 'Código da ação inválido')
      .transform(symbol => symbol.toUpperCase()),
    targetValue: targetValueSchema,
    targetValueType: z.enum(['value', 'variationDay'], {
      error: 'Tipo de valor inválido',
    }),
    targetCondition: z.enum(['above', 'below'], {
      error: 'Condição do alerta inválida',
    }),
  })
  .strict()
  .superRefine((alert, context) => {
    if (alert.targetValueType === 'value' && alert.targetValue <= 0) {
      context.addIssue({
        code: 'custom',
        path: ['targetValue'],
        message: 'O preço alvo deve ser maior que zero',
      });
    }
  });
