import type { Metadata } from 'next';
import Link from 'next/link';
import { ForgotPasswordForm } from '@/components/Auth/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Recuperar senha',
  description: 'Solicite um link para redefinir sua senha',
};

export default function ForgotPasswordPage() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-background-sec p-6'>
      <section className='w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8'>
        <div className='mb-7'>
          <p className='mb-2 text-sm font-semibold text-green-600'>
            StockWatcher
          </p>
          <h1 className='text-2xl font-bold text-primary'>Recuperar senha</h1>
          <p className='mt-2 text-sm leading-relaxed text-gray-500'>
            Informe seu e-mail e enviaremos um link para cadastrar uma nova
            senha.
          </p>
        </div>

        <ForgotPasswordForm />

        <Link
          href='/login'
          prefetch={false}
          className='mt-5 block text-center text-sm font-medium text-green-700 hover:text-green-800'
        >
          Voltar para o login
        </Link>
      </section>
    </div>
  );
}
