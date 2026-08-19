'use client';

import clsx from 'clsx';
import { LogOutIcon, LoaderCircleIcon } from 'lucide-react';
import { useState } from 'react';
import { signOutAction } from '@/actions/auth/sign-out';
import { unsubscribeFromPushAction } from '@/actions/push/unsubscribe-push';

type SignOutButtonProps = {
  variant?: 'icon' | 'full';
};

export function SignOutButton({ variant = 'icon' }: SignOutButtonProps) {
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    if (isSigningOut) return;

    setIsSigningOut(true);

    try {
      const registration = await navigator.serviceWorker?.getRegistration();
      const subscription = await registration?.pushManager.getSubscription();

      if (subscription) {
        await unsubscribeFromPushAction(subscription.endpoint);
        await subscription.unsubscribe();
      }
    } catch (error) {
      // Uma falha na limpeza do push não deve impedir o encerramento da sessão.
      console.error('Erro ao remover inscrição push antes de sair', error);
    } finally {
      await signOutAction();
    }
  }

  return (
    <button
      type='button'
      title='Sair da conta'
      aria-label='Sair da conta'
      disabled={isSigningOut}
      onClick={() => void handleSignOut()}
      className={clsx(
        'flex items-center justify-center gap-2 font-semibold transition disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'full'
          ? 'w-full rounded-xl border border-red-200 bg-white px-4 py-3 text-sm text-red-600 hover:border-red-300 hover:bg-red-50 sm:w-auto'
          : 'rounded-md p-1.5 text-gray-500 hover:bg-background-sec hover:text-red-600',
      )}
    >
      {isSigningOut ? (
        <LoaderCircleIcon size={16} className='animate-spin' />
      ) : (
        <LogOutIcon size={16} />
      )}
      {variant === 'full' && (
        <span>{isSigningOut ? 'Saindo...' : 'Sair da conta'}</span>
      )}
    </button>
  );
}
