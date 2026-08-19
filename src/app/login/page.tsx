import { LoginForm } from '@/components/Auth/LoginForm';

export default function LoginPage() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-background-sec p-6'>
      <section className='w-full max-w-md rounded-2xl border border-border bg-white p-8 shadow-sm'>
        <div className='mb-7'>
          <p className='mb-2 text-sm font-semibold text-green-600'>
            StockWatcher
          </p>
          <h1 className='text-2xl font-bold text-primary'>Acesse sua conta</h1>
          <p className='mt-2 text-sm text-gray-500'>
            Entre para acompanhar sua carteira e seus alertas.
          </p>
        </div>

        <LoginForm />
      </section>
    </div>
  );
}
