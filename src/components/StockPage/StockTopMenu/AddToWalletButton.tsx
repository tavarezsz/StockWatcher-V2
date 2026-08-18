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
        onClick={() => setDialogOpen(true)}
        className='flex items-center py-2 px-3 bg-green-600 rounded-lg text-white gap-2 cursor-pointer hover:bg-green-700'
      >
        <PlusIcon size={16} /> <p className='text-sm'>Adicionar à Carteira</p>
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
