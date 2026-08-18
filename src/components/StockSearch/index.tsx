'use client';

import Link from 'next/link';
import {
  LoaderCircleIcon,
  SearchIcon,
  TrendingUpIcon,
  XIcon,
} from 'lucide-react';
import {
  type FormEvent,
  useEffect,
  useId,
  useRef,
  useState,
  useTransition,
} from 'react';
import { createPortal } from 'react-dom';
import { searchStocksAction } from '@/actions/stock/search-stocks';
import type { SearchResultModel } from '@/models/search-result-model';
import { formatPrice } from '@/utils/formatters';
import { getStockInitials } from '@/utils/getStockInitials';
import { getStockHref } from '@/utils/stockRoute';

type StockSearchProps = {
  triggerVariant?: 'sidebar' | 'icon';
};

export function StockSearch({
  triggerVariant = 'sidebar',
}: StockSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [term, setTerm] = useState('');
  const [results, setResults] = useState<SearchResultModel[]>([]);
  const [error, setError] = useState<string>();
  const [hasSearched, setHasSearched] = useState(false);
  const [isPending, startTransition] = useTransition();
  const titleId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    inputRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape' && !isPending) setIsOpen(false);
    }

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, isPending]);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);

    startTransition(async () => {
      const response = await searchStocksAction(term);
      setResults(response.results);
      setError(response.error);
      setHasSearched(true);
    });
  }

  function closeDialog() {
    if (!isPending) setIsOpen(false);
  }

  return (
    <>
      {triggerVariant === 'icon' ? (
        <button
          type='button'
          aria-label='Buscar ativo'
          onClick={() => setIsOpen(true)}
          className='flex size-10 items-center justify-center rounded-xl text-gray-500 transition hover:bg-green-50 hover:text-green-600'
        >
          <SearchIcon size={20} />
        </button>
      ) : (
        <button
          type='button'
          onClick={() => setIsOpen(true)}
          className='m-5 flex items-center gap-2 rounded-lg bg-background-sec p-3 text-sm text-gray-600 transition hover:text-green-700'
        >
          <SearchIcon size={16} />
          <span>Buscar ativo...</span>
        </button>
      )}

      {isOpen &&
        createPortal(
          <div
            className='fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-5 pt-[10vh] backdrop-blur-xs'
            onMouseDown={event => {
              if (event.target === event.currentTarget) closeDialog();
            }}
          >
            <section
              role='dialog'
              aria-modal='true'
              aria-labelledby={titleId}
              className='flex max-h-[80vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-2xl'
            >
              <div className='flex items-start justify-between gap-4 border-b border-border p-6'>
                <div>
                  <h2 id={titleId} className='text-lg font-bold text-primary'>
                    Buscar ações
                  </h2>
                  <p className='mt-1 text-sm text-gray-500'>
                    Pesquise pelo ticker ou nome da empresa.
                  </p>
                </div>
                <button
                  type='button'
                  aria-label='Fechar busca'
                  disabled={isPending}
                  onClick={closeDialog}
                  className='flex size-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-primary disabled:opacity-40'
                >
                  <XIcon size={18} />
                </button>
              </div>

              <form onSubmit={handleSearch} className='flex gap-3 p-6 pb-4'>
              <label className='flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-border px-4 focus-within:border-green-600'>
                <SearchIcon className='shrink-0 text-gray-400' size={18} />
                <input
                  ref={inputRef}
                  value={term}
                  onChange={event => setTerm(event.target.value)}
                  aria-label='Ticker ou nome da empresa'
                  placeholder='Ex.: PETR4 ou Petrobras'
                  autoComplete='off'
                  disabled={isPending}
                  className='h-12 w-full bg-transparent text-sm text-primary outline-none placeholder:text-gray-400'
                />
              </label>
              <button
                type='submit'
                disabled={isPending || term.trim().length < 2}
                className='flex h-12 items-center gap-2 rounded-xl bg-green-600 px-5 text-sm font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50'
              >
                {isPending && <LoaderCircleIcon className='animate-spin' size={17} />}
                Buscar
              </button>
              </form>

              <div className='min-h-48 overflow-y-auto px-6 pb-6'>
              {isPending ? (
                <SearchMessage message='Buscando ativos...' loading />
              ) : error ? (
                <SearchMessage message={error} />
              ) : hasSearched && results.length === 0 ? (
                <SearchMessage message='Nenhum ativo encontrado para essa busca.' />
              ) : results.length > 0 ? (
                <div className='grid gap-3 sm:grid-cols-2'>
                  {results.map(stock => (
                    <SearchResultCard
                      key={stock.symbol}
                      stock={stock}
                      onSelect={() => setIsOpen(false)}
                    />
                  ))}
                </div>
              ) : (
                <SearchMessage message='Os resultados aparecerão aqui.' />
              )}
              </div>
            </section>
          </div>,
          document.body,
        )}
    </>
  );
}

function SearchResultCard({
  stock,
  onSelect,
}: {
  stock: SearchResultModel;
  onSelect: () => void;
}) {
  const displaySymbol = stock.symbol.replace(/\.SA$/i, '');
  const description = stock.sector || stock.industry || 'Ação listada na B3';

  return (
    <Link
      href={getStockHref(stock.symbol)}
      onClick={onSelect}
      className='flex min-w-0 items-center gap-3 rounded-xl border border-border p-4 transition hover:border-green-300 hover:bg-green-50/40'
    >
      <span className='flex size-11 shrink-0 items-center justify-center rounded-xl bg-green-100 text-sm font-bold text-green-700'>
        {getStockInitials(stock.name || displaySymbol)}
      </span>
      <div className='min-w-0 flex-1'>
        <div className='flex items-center justify-between gap-3'>
          <p className='font-bold text-primary'>{displaySymbol}</p>
          {typeof stock.price === 'number' && (
            <p className='shrink-0 text-sm font-bold text-primary'>
              {formatPrice(stock.price)}
            </p>
          )}
        </div>
        <p className='truncate text-sm text-gray-500'>
          {stock.name || displaySymbol}
        </p>
        <p className='mt-1 truncate text-xs text-gray-400'>{description}</p>
      </div>
    </Link>
  );
}

function SearchMessage({
  message,
  loading = false,
}: {
  message: string;
  loading?: boolean;
}) {
  return (
    <div className='flex min-h-48 flex-col items-center justify-center gap-3 text-center text-sm text-gray-500'>
      {loading ? (
        <LoaderCircleIcon className='animate-spin text-green-600' size={24} />
      ) : (
        <TrendingUpIcon className='text-gray-300' size={28} />
      )}
      <p>{message}</p>
    </div>
  );
}
