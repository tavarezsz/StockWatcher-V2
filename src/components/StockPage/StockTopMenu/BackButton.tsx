'use client';

import { ArrowLeftIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function BackButton() {
  const router = useRouter();

  return (
    <button
      type='button'
      aria-label='Voltar'
      onClick={() => router.back()}
      className='inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-50 hover:text-primary'
    >
      <ArrowLeftIcon size={18} />
    </button>
  );
}
