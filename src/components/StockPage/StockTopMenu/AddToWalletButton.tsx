'use client';
import { PlusIcon } from 'lucide-react';
import { useState, useActionState, useEffect } from 'react';
import clsx from 'clsx';
import { InputCurrency } from '@/components/atoms/InputCurrency';
import { InputText } from '@/components/atoms/InputText';
import { AddToWalletAction } from '@/actions/wallet/add-to-wallet';
import {toast} from 'react-toastify'

type AddToWalletButtonProps = {
  symbol: string;
};

export async function AddToWalletButton({ symbol }: AddToWalletButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const [state, formAction, isPending] = useActionState(AddToWalletAction, {
    formState: {
      stockSymbol: symbol,
      quantity: 0,
      referencePrice: 0,
    },
    errors: [],
  });

   useEffect(() => {
      if (state.errors.length > 0) {
        toast.dismiss();
        state.errors.forEach(error => toast.error(error));
      }
    }, [state.errors]);
  
    useEffect(() => {
      if (state.sucess) {
        setDialogOpen(false)
        toast.dismiss();
        toast.success('A ação foi adicionada a sua carteira');
      }
    }, [state]);

  return (
    <>
      <button
        onClick={() => setDialogOpen(true)}
        className='flex items-center py-2 px-3 bg-green-600 rounded-lg text-white gap-2 cursor-pointer hover:bg-green-700'
      >
        <PlusIcon size={16} /> <p className='text-sm'>Adicionar à Carteira</p>
      </button>
      {dialogOpen && (
        <div
          className={clsx(
            'fixed z-50 inset-0 bg-black/50 backdrop-blur-xs',
            'flex items-center justify-center',
          )}
          onClick={() => setDialogOpen(false)}
        >
          <div
            className={clsx(
              'bg-slate-100 p-6 rounded-lg max-w-2xl mx-6',
              'flex flex-col gap-6',
              'shadow-lg shadow-black/30 text-center',
            )}
            role='dialog'
            aria-modal={true}
            aria-labelledby='dialog-title'
            aria-describedby='dialog-description'
            onClick={e => e.stopPropagation()}
          >
            <p className='text-primary font-semibold'>
              {' '}
              Para adicionar a carteira Informe o preço de compra e quantidade
            </p>
            <form action={formAction} className='flex flex-col gap-4 text-left'>
              <div className='flex flex-col gap-2'>
                <input type='hidden' name='stockSymbol' value={symbol} />
                <InputCurrency
                  labelText='Preço de compra'
                  name='referencePrice'
                  disabled={isPending}
                />
                <InputText
                  labelText='Quantidade'
                  placeholder='0'
                  type='number'
                  disabled={isPending}
                  min={0}
                  name='quantity'
                />
              </div>
              <button
                type='submit'
                disabled={isPending}
                className='flex text-center justify-center items-center py-2 px-3 bg-green-600 rounded-lg text-white gap-2 cursor-pointer hover:bg-green-700'
              >
                Adicionar
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
