'use client';

import Link from 'next/link';
import { useActionState, useEffect, useRef } from 'react';
import {
  resetPasswordAction,
  type ResetPasswordState,
} from '@/actions/auth/reset-password';

const initialState: ResetPasswordState = { errors: [] };

export function ResetPasswordForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(
    resetPasswordAction,
    initialState,
  );

  useEffect(() => {
    if (state.message) formRef.current?.reset();
  }, [state.message]);

  if (state.message) {
    return (
      <div className='flex flex-col gap-4'>
        <p
          role='status'
          className='rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700'
        >
          {state.message}
        </p>
        <Link
          href='/'
          prefetch={false}
          className='rounded-lg bg-green-600 px-4 py-2.5 text-center font-semibold text-white transition hover:bg-green-700'
        >
          Ir para o painel
        </Link>
      </div>
    );
  }

  return (
    <form ref={formRef} action={formAction} className='flex flex-col gap-4'>
      <label className='flex flex-col gap-1.5 text-sm text-gray-600'>
        Nova senha
        <input
          name='password'
          type='password'
          autoComplete='new-password'
          minLength={8}
          required
          className='rounded-lg border border-border bg-white px-3 py-2.5 text-primary outline-none focus:border-green-600'
        />
      </label>

      <label className='flex flex-col gap-1.5 text-sm text-gray-600'>
        Confirmar nova senha
        <input
          name='confirmPassword'
          type='password'
          autoComplete='new-password'
          minLength={8}
          required
          className='rounded-lg border border-border bg-white px-3 py-2.5 text-primary outline-none focus:border-green-600'
        />
      </label>

      {state.errors.length > 0 && (
        <div
          role='alert'
          className='rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600'
        >
          {state.errors.map(error => (
            <p key={error}>{error}</p>
          ))}
        </div>
      )}

      <button
        type='submit'
        disabled={isPending}
        className='rounded-lg bg-green-600 px-4 py-2.5 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60'
      >
        {isPending ? 'Redefinindo...' : 'Redefinir senha'}
      </button>
    </form>
  );
}
