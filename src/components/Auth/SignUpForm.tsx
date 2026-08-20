'use client';

import { useActionState } from 'react';
import { signUpAction, type SignUpActionState } from '@/actions/auth/sign-up';

const initialState: SignUpActionState = { errors: [] };
const inputClasses =
  'rounded-lg border border-border bg-white px-3 py-2.5 text-primary outline-none focus:border-green-600';

export function SignUpForm() {
  const [state, formAction, isPending] = useActionState(
    signUpAction,
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
          className={inputClasses}
        />
      </label>

      <label className='flex flex-col gap-1.5 text-sm text-gray-600'>
        Senha
        <input
          name='password'
          type='password'
          autoComplete='new-password'
          minLength={8}
          required
          className={inputClasses}
        />
        <span className='text-xs text-gray-400'>Mínimo de 8 caracteres.</span>
      </label>

      <label className='flex flex-col gap-1.5 text-sm text-gray-600'>
        Confirmar senha
        <input
          name='confirmPassword'
          type='password'
          autoComplete='new-password'
          minLength={8}
          required
          className={inputClasses}
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

      {state.message ? (
        <p
          role='status'
          className='rounded-lg bg-green-50 px-3 py-2 text-sm leading-relaxed text-green-700'
        >
          {state.message}
        </p>
      ) : (
        <button
          type='submit'
          disabled={isPending}
          className='rounded-lg bg-green-600 px-4 py-2.5 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60'
        >
          {isPending ? 'Criando conta...' : 'Criar conta'}
        </button>
      )}
    </form>
  );
}
