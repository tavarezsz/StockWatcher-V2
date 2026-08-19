'use client';

import { formatPrice, formatVariation } from '@/utils/formatters';
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MinusIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { LastUpdate } from '../../WalletSummary/LastUpdate';
import { DeleteAssetButton } from './DeleteAssetButton';
import { EditAssetButton } from './EditAssetButton';
import { getStockHref } from '@/utils/stockRoute';

export type WalletAssetRow = {
  itemId: string;
  symbol: string;
  name: string;
  initials: string;
  quantity: number;
  referencePrice: number;
  currentPrice: number;
  variation: number;
  total: number;
  result: number;
};

type WalletAssetsTableProps = {
  rows: WalletAssetRow[];
  updatedAt?: string;
};

type SortKey =
  | 'quantity'
  | 'referencePrice'
  | 'currentPrice'
  | 'total'
  | 'result';

type SortDirection = 'asc' | 'desc';

const ITEMS_PER_PAGE = 5;

export function WalletAssetsTable({
  rows,
  updatedAt,
}: WalletAssetsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDirection, setSortDirection] =
    useState<SortDirection>('desc');
  const [page, setPage] = useState(1);

  const sortedRows = useMemo(() => {
    if (!sortKey) return rows;

    return rows
      .map((row, index) => ({ row, index }))
      .sort((first, second) => {
        const difference = first.row[sortKey] - second.row[sortKey];

        if (difference === 0) return first.index - second.index;
        return sortDirection === 'asc' ? difference : -difference;
      })
      .map(({ row }) => row);
  }, [rows, sortDirection, sortKey]);

  const totalPages = Math.max(1, Math.ceil(rows.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const visibleRows = sortedRows.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  function handleSort(key: SortKey) {
    setPage(1);

    if (sortKey === key) {
      setSortDirection((direction) =>
        direction === 'desc' ? 'asc' : 'desc',
      );
      return;
    }

    setSortKey(key);
    setSortDirection('desc');
  }

  function handleMobileSort(key: SortKey | '') {
    setPage(1);
    setSortKey(key || null);
    setSortDirection('desc');
  }

  return (
    <section className='overflow-hidden rounded-2xl border border-border bg-white'>
      <div className='flex items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5'>
        <h2 className='text-lg font-bold text-primary'>Meus ativos</h2>
        <div className='flex min-w-0 items-center gap-1.5 lg:hidden'>
          <label className='sr-only' htmlFor='mobile-wallet-sort'>
            Ordenar ativos por
          </label>
          <select
            id='mobile-wallet-sort'
            value={sortKey ?? ''}
            onChange={event =>
              handleMobileSort(event.target.value as SortKey | '')
            }
            className='min-w-0 max-w-36 rounded-lg border border-border bg-background-sec px-2.5 py-2 text-xs text-gray-600 outline-none focus:border-green-500 sm:max-w-44'
          >
            <option value=''>Ordenar por</option>
            <option value='quantity'>Quantidade</option>
            <option value='referencePrice'>Referência</option>
            <option value='currentPrice'>Preço atual</option>
            <option value='total'>Total</option>
            <option value='result'>Resultado</option>
          </select>
          <button
            type='button'
            aria-label={
              sortDirection === 'asc' ? 'Ordem crescente' : 'Ordem decrescente'
            }
            title={
              sortDirection === 'asc' ? 'Ordem crescente' : 'Ordem decrescente'
            }
            disabled={!sortKey}
            onClick={() =>
              setSortDirection(direction =>
                direction === 'asc' ? 'desc' : 'asc',
              )
            }
            className='flex size-9 shrink-0 items-center justify-center rounded-lg border border-border text-green-600 transition hover:bg-green-50 disabled:cursor-not-allowed disabled:text-gray-300'
          >
            {sortDirection === 'asc' ? (
              <ArrowUpIcon size={15} />
            ) : (
              <ArrowDownIcon size={15} />
            )}
          </button>
        </div>
        <p className='hidden text-xs text-gray-400 lg:block'>
          Clique em uma coluna para ordenar
        </p>
      </div>

      {rows.length === 0 ? (
        <div className='flex min-h-40 items-center justify-center border-t border-border px-6 text-sm text-gray-500'>
          Sua carteira ainda não possui ativos.
        </div>
      ) : (
        <>
          <div className='divide-y divide-border border-t border-border lg:hidden'>
            {visibleRows.map(row => (
              <WalletAssetMobileCard key={row.itemId} row={row} />
            ))}
          </div>

          <div className='hidden overflow-x-auto border-t border-border lg:block'>
            <table className='w-full min-w-[920px] border-collapse text-left'>
          <thead>
            <tr className='border-b border-border text-[11px] font-semibold uppercase text-muted'>
              <th className='px-5 py-4 sm:px-6'>Ativo</th>
              <SortableHeader
                label='Qtd'
                sortKey='quantity'
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                label='Referência'
                sortKey='referencePrice'
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                label='Preço atual'
                sortKey='currentPrice'
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                label='Total'
                sortKey='total'
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                label='Resultado'
                sortKey='result'
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />
              <th className='px-5 py-4 text-right sm:px-6'>Ações</th>
            </tr>
          </thead>

          <tbody>
            {visibleRows.map((row) => (
              <WalletAssetTableRow key={row.itemId} row={row} />
            ))}
          </tbody>
            </table>
          </div>
        </>
      )}

      <div className='flex min-h-16 items-center justify-between gap-4 border-t border-border px-5 py-4 sm:px-6'>
        <p className='text-xs italic text-gray-400'>
          {updatedAt ? <LastUpdate updatedAt={updatedAt} /> : 'Sem atualização'}
        </p>

        {rows.length > 0 && (
          <div className='flex items-center gap-4'>
            <PaginationButton
              label='Página anterior'
              disabled={currentPage === 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
            >
              <ChevronLeftIcon size={19} />
            </PaginationButton>

            <span className='text-xs font-semibold text-primary'>
              {currentPage} de {totalPages}
            </span>

            <PaginationButton
              label='Próxima página'
              disabled={currentPage === totalPages}
              onClick={() =>
                setPage((value) => Math.min(totalPages, value + 1))
              }
            >
              <ChevronRightIcon size={19} />
            </PaginationButton>
          </div>
        )}
      </div>
    </section>
  );
}

function WalletAssetMobileCard({ row }: { row: WalletAssetRow }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <article className='p-4'>
      <div className='flex items-start justify-between gap-3'>
        <Link
          href={getStockHref(row.symbol)}
          prefetch={false}
          className='group flex min-w-0 items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2'
        >
          <span className='flex size-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-sm font-semibold text-green-600'>
            {row.initials}
          </span>
          <div className='min-w-0'>
            <p className='font-bold text-primary transition-colors group-hover:text-green-600'>
              {row.symbol}
            </p>
            <p className='truncate text-xs text-muted'>{row.name}</p>
          </div>
        </Link>
        <div className='flex shrink-0 items-center'>
          <EditAssetButton
            id={row.itemId}
            stockSymbol={row.symbol}
            quantity={row.quantity}
            referencePrice={row.referencePrice}
          />
          <DeleteAssetButton id={row.itemId} />
        </div>
      </div>

      <div className='mt-4 flex items-end justify-between gap-3'>
        <div>
          <p className='text-[10px] font-semibold uppercase tracking-wide text-gray-400'>
            Preço atual
          </p>
          <div className='flex flex-wrap items-center gap-2'>
            <p className='text-lg font-bold text-primary'>
              {formatPrice(row.currentPrice)}
            </p>
            <DailyVariation variation={row.variation} />
          </div>
        </div>
        <ResultBadge value={row.result} />
      </div>

      <button
        type='button'
        aria-expanded={isExpanded}
        onClick={() => setIsExpanded(expanded => !expanded)}
        className='flex w-full items-center justify-center gap-1 pt-2.5 text-xs font-medium text-gray-400 transition hover:text-green-600'
      >
        {isExpanded ? 'Ocultar detalhes' : 'Ver detalhes'}
        <ChevronDownIcon
          size={15}
          className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      {isExpanded && (
        <dl className='mt-2 grid grid-cols-3 gap-2 rounded-xl bg-background-sec p-3'>
          <WalletMetric label='Quantidade' value={String(row.quantity)} />
          <WalletMetric
            label='Referência'
            value={formatPrice(row.referencePrice)}
          />
          <WalletMetric label='Total' value={formatPrice(row.total)} />
        </dl>
      )}
    </article>
  );
}

function WalletMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className='min-w-0'>
      <dt className='text-[9px] font-semibold uppercase tracking-wide text-gray-400 sm:text-[10px]'>
        {label}
      </dt>
      <dd className='mt-0.5 break-words text-xs font-semibold text-primary sm:text-sm'>
        {value}
      </dd>
    </div>
  );
}

type SortableHeaderProps = {
  label: string;
  sortKey: SortKey;
  activeKey: SortKey | null;
  direction: SortDirection;
  onSort: (key: SortKey) => void;
};

function SortableHeader({
  label,
  sortKey,
  activeKey,
  direction,
  onSort,
}: SortableHeaderProps) {
  const isActive = activeKey === sortKey;
  const Icon = !isActive
    ? ArrowUpDownIcon
    : direction === 'asc'
      ? ArrowUpIcon
      : ArrowDownIcon;

  return (
    <th
      className='px-5 py-4'
      aria-sort={
        isActive
          ? direction === 'asc'
            ? 'ascending'
            : 'descending'
          : 'none'
      }
    >
      <button
        type='button'
        className='group flex items-center gap-1.5 transition-colors hover:text-primary cursor-pointer'
        onClick={() => onSort(sortKey)}
      >
        {label}
        <Icon
          size={13}
          className={isActive ? 'text-green-600' : 'text-gray-300'}
        />
      </button>
    </th>
  );
}

function WalletAssetTableRow({ row }: { row: WalletAssetRow }) {
  return (
    <tr className='border-b border-border last:border-b-0'>
      <td className='px-5 py-4 sm:px-6'>
        <Link
          href={getStockHref(row.symbol)}
          prefetch={false}
          className='group flex w-fit items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2'
        >
          <span className='flex size-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-sm font-semibold text-green-600'>
            {row.initials}
          </span>
          <div className='min-w-0'>
            <p className='font-bold text-primary transition-colors group-hover:text-green-600'>
              {row.symbol}
            </p>
            <p className='max-w-40 truncate text-xs text-muted transition-colors group-hover:text-gray-600'>
              {row.name}
            </p>
          </div>
        </Link>
      </td>
      <td className='px-5 py-4 text-sm text-gray-700'>{row.quantity}</td>
      <td className='px-5 py-4 text-sm text-gray-500'>
        {formatPrice(row.referencePrice)}
      </td>
      <td className='px-5 py-4'>
        <div className='flex items-center gap-2 whitespace-nowrap'>
          <span className='text-sm font-bold text-primary'>
            {formatPrice(row.currentPrice)}
          </span>
          <DailyVariation variation={row.variation} />
        </div>
      </td>
      <td className='px-5 py-4 text-sm font-bold text-primary'>
        {formatPrice(row.total)}
      </td>
      <td className='px-5 py-4'>
        <ResultBadge value={row.result} />
      </td>
      <td className='px-5 py-4 text-right text-sm text-gray-400 sm:px-6'>
        <EditAssetButton
          id={row.itemId}
          stockSymbol={row.symbol}
          quantity={row.quantity}
          referencePrice={row.referencePrice}
        />
        <DeleteAssetButton id={row.itemId}/>
      </td>
    </tr>
  );
}

function ResultBadge({ value }: { value: number }) {
  const isPositive = value > 0;
  const isNegative = value < 0;
  const classes = isPositive
    ? 'bg-green-50 text-green-600'
    : isNegative
      ? 'bg-red-50 text-red-600'
      : 'bg-gray-100 text-gray-500';
  const Icon = isPositive
    ? ArrowUpIcon
    : isNegative
      ? ArrowDownIcon
      : MinusIcon;

  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-1 text-xs font-semibold ${classes}`}
    >
      <Icon size={13} />
      {formatPrice(value)}
    </span>
  );
}

function DailyVariation({ variation }: { variation: number }) {
  const isPositive = variation > 0;
  const isNegative = variation < 0;
  const classes = isPositive
    ? 'text-green-600'
    : isNegative
      ? 'text-red-600'
      : 'text-gray-500';
  const Icon = isPositive
    ? ArrowUpIcon
    : isNegative
      ? ArrowDownIcon
      : MinusIcon;

  return (
    <span className={`flex items-center text-xs font-semibold ${classes}`}>
      <Icon size={13} />
      {formatVariation(Math.abs(variation))}%
    </span>
  );
}

type PaginationButtonProps = {
  children: React.ReactNode;
  disabled: boolean;
  label: string;
  onClick: () => void;
};

function PaginationButton({
  children,
  disabled,
  label,
  onClick,
}: PaginationButtonProps) {
  return (
    <button
      type='button'
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className='text-gray-500 transition-colors hover:text-primary disabled:cursor-not-allowed disabled:text-gray-200'
    >
      {children}
    </button>
  );
}
