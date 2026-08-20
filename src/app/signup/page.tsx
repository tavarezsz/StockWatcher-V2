import type { Metadata } from 'next';
import Link from 'next/link';
import { SignUpForm } from '@/components/Auth/SignUpForm';

export const metadata: Metadata = {
  title: 'Criar conta',
  description: 'Crie sua conta no StockWatcher',
};

export default function SignUpPage() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-background-sec p-6'>
      <section className='w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8'>
        <div className='mb-7'>
          <p className='mb-2 text-sm font-semibold text-green-600'>
            StockWatcher
          </p>
          <h1 className='text-2xl font-bold text-primary'>Crie sua conta</h1>
          <p className='mt-2 text-sm text-gray-500'>
            Comece a acompanhar sua carteira e configurar alertas.
          </p>
        </div>

        <SignUpForm />

        <p className='mt-6 text-center text-sm text-gray-500'>
          Já possui uma conta?{' '}
          <Link
            href='/login'
            prefetch={false}
            className='font-semibold text-green-700 hover:text-green-800'
          >
            Entrar
          </Link>
        </p>
      </section>
    </div>
  );
}
