import Link from 'next/link';
import { ArrowLeftIcon, SearchXIcon } from 'lucide-react';

export default function NotFound() {
  return (
    <div className='flex min-h-[calc(100dvh-8.5rem)] items-center justify-center p-4 sm:p-6 lg:min-h-[calc(100dvh-78px)] lg:p-8'>
      <section className='w-full max-w-lg rounded-2xl border border-border bg-white px-6 py-10 text-center shadow-sm sm:px-10 sm:py-12'>
        <div className='mx-auto flex size-14 items-center justify-center rounded-2xl bg-green-50 text-green-600'>
          <SearchXIcon size={27} />
        </div>

        <p className='mt-6 text-sm font-bold uppercase tracking-widest text-green-600'>
          Erro 404
        </p>
        <h1 className='mt-2 text-2xl font-black text-primary sm:text-3xl'>
          Página não encontrada
        </h1>
        <p className='mx-auto mt-3 max-w-sm text-sm leading-6 text-gray-500 sm:text-base'>
          A página que você tentou acessar não existe ou não está mais
          disponível.
        </p>

        <Link
          href='/'
          className='mt-7 inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-700'
        >
          <ArrowLeftIcon size={17} />
          Voltar ao painel
        </Link>
      </section>
    </div>
  );
}
