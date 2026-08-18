'use client';

import { InputCurrency } from '@/components/atoms/InputCurrency';
import { InputText } from '@/components/atoms/InputText';
import type { StockInstanceDTO } from '@/models/wallet-model';
import clsx from 'clsx';
import { XIcon } from 'lucide-react';
import { useActionState, useEffect, useId, useRef } from 'react';
import { toast } from 'react-toastify';

export type StockInstanceDialogState = {
  formState: StockInstanceDTO;
  errors: string[];
  sucess?: true;
};

type StockInstanceFormAction = (
  state: StockInstanceDialogState,
  formData: FormData,
) => Promise<StockInstanceDialogState>;

type StockInstanceDialogProps = {
  action: StockInstanceFormAction;
  initialValue: StockInstanceDTO;
  isVisible?: boolean;
  mode?: 'add' | 'edit';
  stockInstanceId?: string;
  onClose: () => void;
  title?: string;
  description?: string;
  submitLabel?: string;
  successMessage?: string;
};

const dialogContent = {
  add: {
    title: 'Adicionar à carteira',
    description:
      'Informe o preço de compra e a quantidade que deseja adicionar.',
    submitLabel: 'Adicionar',
    successMessage: 'A ação foi adicionada à sua carteira',
  },
  edit: {
    title: 'Editar ativo',
    description: 'Atualize o preço de compra e a quantidade deste ativo.',
    submitLabel: 'Salvar alterações',
    successMessage: 'O ativo foi atualizado com sucesso',
  },
} as const;

export function StockInstanceDialog({
  action,
  initialValue,
  isVisible = true,
  mode = 'add',
  stockInstanceId,
  onClose,
  title,
  description,
  submitLabel,
  successMessage,
}: StockInstanceDialogProps) {
  const content = dialogContent[mode];
  const titleId = useId();
  const descriptionId = useId();
  const [state, formAction, isPending] = useActionState(action, {
    formState: initialValue,
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
      toast.success(successMessage ?? content.successMessage);
      onClose();
    }
  }, [content.successMessage, onClose, state, successMessage]);

  useEffect(() => {
    if (!isVisible) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape' && !isPending) onClose();
    }

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isPending, isVisible, onClose]);

  if (!isVisible) return null;

  function handleClose() {
    if (!isPending) onClose();
  }

  return (
    <div
      className={clsx(
        'fixed inset-0 z-50 bg-black/50 backdrop-blur-xs',
        'flex items-center justify-center p-4 sm:p-6',
      )}
      onClick={handleClose}
    >
      <div
        className='relative flex max-h-[calc(100dvh-2rem)] w-full max-w-lg flex-col gap-6 overflow-y-auto rounded-xl bg-white p-5 text-left shadow-lg shadow-black/30 sm:p-6'
        role='dialog'
        aria-modal='true'
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onClick={event => event.stopPropagation()}
      >
        <button
          type='button'
          aria-label='Fechar'
          disabled={isPending}
          onClick={handleClose}
          className='absolute right-4 top-4 inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40'
        >
          <XIcon size={18} />
        </button>

        <div className='pr-8'>
          <h2 id={titleId} className='font-semibold text-primary'>
            {title ?? content.title}
          </h2>
          <p id={descriptionId} className='mt-1 text-sm text-gray-500'>
            {description ?? content.description}
          </p>
        </div>

        <form action={formAction} className='flex flex-col gap-5'>
          <input
            type='hidden'
            name='stockSymbol'
            value={initialValue.stockSymbol}
          />
          {stockInstanceId && (
            <input type='hidden' name='itemId' value={stockInstanceId} />
          )}

          <div className='flex flex-col gap-3'>
            <InputCurrency
              labelText='Preço de compra'
              name='referencePrice'
              initialValue={initialValue.referencePrice}
              disabled={isPending}
            />
            <InputText
              labelText='Quantidade'
              placeholder='0'
              type='number'
              defaultValue={initialValue.quantity || ''}
              disabled={isPending}
              min={0}
              name='quantity'
            />
          </div>

          <div className='flex justify-end gap-3'>
            <button
              type='button'
              disabled={isPending}
              onClick={handleClose}
              className='cursor-pointer rounded-lg border border-border px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50'
            >
              Cancelar
            </button>
            <button
              type='submit'
              disabled={isPending}
              className='cursor-pointer rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50'
            >
              {isPending ? 'Salvando...' : (submitLabel ?? content.submitLabel)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
