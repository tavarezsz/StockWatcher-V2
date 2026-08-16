'use client'
import { useState } from "react";
import { SquarePenIcon } from "lucide-react";
import { UpdateAssetAction } from "@/actions/wallet/update-asset";
import { StockInstanceDialog } from "@/components/atoms/StockInstanceDialog";
import { StockInstance } from "@/models/wallet-model";

type EditAssetButonProps = {
    id: string
    stockSymbol: string
    quantity: number
    referencePrice: number
}

export function EditAssetButton({ id, stockSymbol, quantity, referencePrice }: EditAssetButonProps) {

  if(!id || !stockSymbol) return null


const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
    <button
      type='button'
      aria-label='editar ação' 
      data-alert-id={id}
      onClick={() => setDialogOpen(true)}
      className='inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40'
    >
      <SquarePenIcon size={15} />
    </button>
    {dialogOpen && (
            <StockInstanceDialog
            stockInstanceId={id}
            successMessage="Ação atualizada com sucesso"
              action={UpdateAssetAction}
              initialValue={{
                stockSymbol: stockSymbol,
                quantity: quantity,
                referencePrice: referencePrice,
              }}
              mode="edit"
              onClose={() => setDialogOpen(false)}
            />
          )}
    </>
  );
}