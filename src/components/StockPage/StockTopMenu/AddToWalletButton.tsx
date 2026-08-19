'use client';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { AddToWalletAction } from '@/actions/wallet/add-to-wallet';
import { StockInstanceDialog } from '@/components/atoms/StockInstanceDialog';
import { StockModel } from '@/models/stock-model';

type AddToWalletButtonProps = {
  stock: StockModel;
};

export function AddToWalletButton({ stock }: AddToWalletButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <button
        type='button'
        aria-label='Adicionar à carteira'
        onClick={() => setDialogOpen(true)}
        className='flex size-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-green-600 text-white hover:bg-green-700 sm:h-auto sm:w-auto sm:px-3 sm:py-2'
      >
        <PlusIcon size={16} />
        <span className='hidden text-sm sm:inline'>Adicionar à Carteira</span>
      </button>
      {dialogOpen && (
        <StockInstanceDialog
          action={AddToWalletAction}
          initialValue={{
            stockSymbol: stock.symbol,
            quantity: 0,
            referencePrice: stock.price,
          }}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </>
  );
}
