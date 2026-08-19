'use client';

import { useActionState, useEffect, useRef } from 'react';
import {
  updatePasswordAction,
  type UpdatePasswordState,
} from '@/actions/auth/update-password';

const initialState: UpdatePasswordState = { errors: [] };
const inputClasses =
  'w-full rounded-xl border border-border bg-background-sec px-4 py-3 text-sm text-primary outline-none transition placeholder:text-gray-300 focus:border-green-600 focus:ring-2 focus:ring-green-600/10';

export function PasswordForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(
    updatePasswordAction,
    initialState,
  );

  useEffect(() => {
    if (state.message) formRef.current?.reset();
  }, [state.message]);

  return (
    <form ref={formRef} action={formAction} className='flex flex-col gap-4'>
      <label className='flex flex-col gap-1.5 text-sm text-gray-600'>
        Senha atual
        <input
          name='currentPassword'
          type='password'
          autoComplete='current-password'
          required
          className={inputClasses}
        />
      </label>

      <div className='grid gap-4 sm:grid-cols-2'>
        <label className='flex flex-col gap-1.5 text-sm text-gray-600'>
          Nova senha
          <input
            name='newPassword'
            type='password'
            autoComplete='new-password'
            minLength={8}
            required
            className={inputClasses}
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
            className={inputClasses}
          />
        </label>
      </div>

      {state.errors.length > 0 && (
        <div
          role='alert'
          className='rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600'
        >
          {state.errors.map(error => (
            <p key={error}>{error}</p>
          ))}
        </div>
      )}

      {state.message && (
        <p
          role='status'
          className='rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700'
        >
          {state.message}
        </p>
      )}

      <button
        type='submit'
        disabled={isPending}
        className='self-start rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60'
      >
        {isPending ? 'Alterando...' : 'Alterar senha'}
      </button>
    </form>
  );
}
