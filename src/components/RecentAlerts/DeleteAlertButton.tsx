'use client';

import { Trash2Icon } from 'lucide-react';
import { useState, useTransition } from 'react';
import { Dialog } from '../atoms/Dialog';
import { deleteAlertAction } from '@/actions/alert/delete-alert';
import { toast } from 'react-toastify';

type DeleteAlertButtonProps = {
  alertId?: string;
};

export function DeleteAlertButton({ alertId }: DeleteAlertButtonProps) {

  if(!alertId) return null

  const [isPending, startTransition] = useTransition();
  const [showDialog, setShowDialog] = useState(false);

  async function handleClick() {
    setShowDialog(true);
  }

  async function handleConfirm() {
    toast.dismiss();

    startTransition(async () => {
      const result = await deleteAlertAction(alertId!);
      if (result.error) {
        toast.error(result.error);
        return;
      }

      setShowDialog(false);
      toast.success('Alerta apagado com sucesso!');
    });
  }

  return (
    <>
    <button
      type='button'
      aria-label='Excluir alerta'
      data-alert-id={alertId}
      disabled={!alertId || isPending}
      onClick={handleClick}
      className='inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40'
    >
      <Trash2Icon size={15} />
    </button>
    {showDialog && (
      <Dialog
        isVisible={showDialog}
        title='Deletar alerta'
        content="Tem ceteza que deseja deletar este alerta? Essa ação não pode ser desfeita"
        onCancel={() => setShowDialog(false)}
        onConfirm={handleConfirm}
        disabled={isPending}
      />
    )}
    </>
  );
}
