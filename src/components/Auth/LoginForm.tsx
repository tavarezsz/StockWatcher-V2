'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { authenticateAction, type AuthActionState } from '@/actions/auth/authenticate';

const initialState: AuthActionState = { errors: [] };

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    authenticateAction,
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

      <label className='flex flex-col gap-1.5 text-sm text-gray-600'>
        Senha
        <input
          name='password'
          type='password'
          autoComplete='current-password'
          minLength={6}
          required
          className='rounded-lg border border-border bg-white px-3 py-2.5 text-primary outline-none focus:border-green-600'
        />
      </label>

      <Link
        href='/auth/forgot-password'
        prefetch={false}
        className='-mt-2 self-end text-sm font-medium text-green-700 hover:text-green-800'
      >
        Esqueci minha senha
      </Link>

      {state.errors.length > 0 && (
        <div className='rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600'>
          {state.errors.map(error => (
            <p key={error}>{error}</p>
          ))}
        </div>
      )}

      {state.message && (
        <p className='rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700'>
          {state.message}
        </p>
      )}

      <button
        name='intent'
        value='login'
        disabled={isPending}
        className='rounded-lg bg-green-600 px-4 py-2.5 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60'
      >
        {isPending ? 'Aguarde...' : 'Entrar'}
      </button>

      <button
        name='intent'
        value='signup'
        disabled={isPending}
        className='rounded-lg border border-green-600 px-4 py-2.5 font-semibold text-green-700 transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-60'
      >
        Criar conta
      </button>
    </form>
  );
}
