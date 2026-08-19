import type { Metadata } from 'next';
import { ResetPasswordForm } from '@/components/Auth/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Redefinir senha',
  description: 'Cadastre uma nova senha para sua conta',
};

export default function ResetPasswordPage() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-background-sec p-6'>
      <section className='w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8'>
        <div className='mb-7'>
          <p className='mb-2 text-sm font-semibold text-green-600'>
            StockWatcher
          </p>
          <h1 className='text-2xl font-bold text-primary'>Nova senha</h1>
          <p className='mt-2 text-sm text-gray-500'>
            Escolha uma nova senha para acessar sua conta.
          </p>
        </div>

        <ResetPasswordForm />
      </section>
    </div>
  );
}
