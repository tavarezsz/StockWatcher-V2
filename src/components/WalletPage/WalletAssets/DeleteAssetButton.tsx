'use client'
import { useState, useTransition, useEffect } from "react";
import {toast} from 'react-toastify'
import { Dialog } from "@/components/atoms/Dialog";
import { Trash2Icon } from "lucide-react";
import { deleteAssetAction } from "@/actions/wallet/delete-asset";

type DeleteAssetButonProps = {
    id: string
}

export function DeleteAssetButton({ id }: DeleteAssetButonProps) {

  if(!id) return null

  const [isPending, startTransition] = useTransition();
  const [showDialog, setShowDialog] = useState(false);

  async function handleClick() {
    setShowDialog(true);
  }

  async function handleConfirm() {
    toast.dismiss();

    startTransition(async () => {
      const result = await deleteAssetAction(id!);
      if (result.error) {
        toast.error(result.error);
        return;
      }

      setShowDialog(false);
      toast.success('Item removido com sucesso!');
    });
  }

  return (
    <>
    <button
      type='button'
      aria-label='Remover ação da carteira'
      data-alert-id={id}
      disabled={!id || isPending}
      onClick={handleClick}
      className='inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40'
    >
      <Trash2Icon size={15} />
    </button>
    {showDialog && (
      <Dialog
        isVisible={showDialog}
        title='Remover ação'
        content="Tem ceteza que deseja remover esta ação da sua carteira? Essa ação não pode ser desfeita"
        onCancel={() => setShowDialog(false)}
        onConfirm={handleConfirm}
        disabled={isPending}
      />
    )}
    </>
  );
}