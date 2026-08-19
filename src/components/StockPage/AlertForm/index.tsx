'use client';

import { createAlertAction } from '@/actions/alert/create-alert';
import { InputCurrency } from '@/components/atoms/InputCurrency';
import { InputSelect } from '@/components/atoms/InputSelect';
import { useActionState, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

type AlertFormProps = {
  symbol: string;
};

const triggerOptions = [
  'Preço acima',
  'Preço abaixo',
  'Variação acima',
  'Variação abaixo',
] as const;

type TriggerOption = (typeof triggerOptions)[number];

export function AlertForm({ symbol }: AlertFormProps) {
  const [trigger, setTrigger] = useState<TriggerOption>('Preço acima');

  const [state, formAction, isPending] = useActionState(createAlertAction, {
    formState: {
      status: 'ativo',
      stockSymbol: symbol,
      targetValue: 0,
      targetValueType: 'value',
      targetCondition: 'above',
      createdAt: new Date(),
    },
    errors: [],
  });

  const handledState = useRef(state);

  useEffect(() => {
    if (handledState.current === state) return;

    handledState.current = state;

    if (state.errors.length > 0) {
      toast.dismiss();
      state.errors.forEach(error => toast.error(error));
      return;
    }

    if (state.sucess) {
      toast.dismiss();
      toast.success('Alerta criado com sucesso');
    }
  }, [state]);

  useEffect(() => {
    const valueType = state.formState.targetValueType;
    const condition = state.formState.targetCondition;

    const preservedTrigger =
      valueType === 'variationDay'
        ? condition === 'above'
          ? 'Variação acima'
          : 'Variação abaixo'
        : condition === 'above'
          ? 'Preço acima'
          : 'Preço abaixo';

    setTrigger(preservedTrigger);
  }, [state.formState.targetCondition, state.formState.targetValueType]);

  if (!symbol) return null;

  const isVariation = trigger.startsWith('Variação');
  const targetValueType = isVariation ? 'variationDay' : 'value';
  const targetCondition = trigger.endsWith('acima') ? 'above' : 'below';

  return (
    <section className='flex w-full flex-col gap-5 rounded-2xl border border-border bg-white p-5 sm:p-6'>
        <div className='flex flex-col gap-1'>
            <p className='font-bold text-primary text-lg'>Configurar Alerta</p>
            <p className='text-muted text-xs '>Seja notificado quando o preço mudar</p>
        </div>
      <form action={formAction} className='flex flex-col gap-4'>
        <InputSelect
          labelText='Tipo de gatilho'
          options={[...triggerOptions]}
          value={trigger}
          onChange={event => setTrigger(event.target.value as TriggerOption)}
          disabled={isPending}
        />
        <InputCurrency
          key={`${targetValueType}-${state.formState.targetValue}`}
          labelText={isVariation ? 'Variação alvo' : 'Preço alvo'}
          format={isVariation ? 'percentage' : 'currency'}
          initialValue={state.formState.targetValue}
          name='targetValue'
          required
          disabled={isPending}
        />
        <input type='hidden' name='stockSymbol' value={symbol} />
        <input type='hidden' name='targetValueType' value={targetValueType} />
        <input type='hidden' name='targetCondition' value={targetCondition} />

        <button
          type='submit'
          disabled={isPending}
          className='cursor-pointer w-full h-12 bg-green-600 text-white text-sm font-bold rounded-xl hover:bg-green-700 transition disabled:cursor-not-allowed disabled:opacity-60'
        >
          {isPending ? 'Criando alerta...' : 'Criar Alerta de Monitoramento'}
        </button>
      </form>
    </section>
  );
}
