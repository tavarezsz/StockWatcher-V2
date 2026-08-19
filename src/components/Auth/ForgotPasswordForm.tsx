'use client';

import { useActionState } from 'react';
import {
  requestPasswordResetAction,
  type RequestPasswordResetState,
} from '@/actions/auth/request-password-reset';

const initialState: RequestPasswordResetState = { errors: [] };

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(
    requestPasswordResetAction,
    initialState,
  );

  return (
    <form action={formAction} className='flex flex-col gap-4'>
      <label className='flex flex-col gap-1.5 text-sm text-gray-600'>
        E-mail
        <input
          name='email'
          type='email'
          autoComplete='email'
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

      {state.message && (
        <p
          role='status'
          className='rounded-lg bg-green-50 px-3 py-2 text-sm leading-relaxed text-green-700'
        >
          {state.message}
        </p>
      )}

      <button
        type='submit'
        disabled={isPending || Boolean(state.message)}
        className='rounded-lg bg-green-600 px-4 py-2.5 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60'
      >
        {isPending ? 'Enviando...' : 'Enviar instruções'}
      </button>
    </form>
  );
}
