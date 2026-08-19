'use client';

import { formatPrice, formatVariation } from '@/utils/formatters';
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
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

  return (
    <section className='overflow-hidden rounded-2xl border border-border bg-white'>
      <div className='flex items-center justify-between gap-4 px-5 py-5 sm:px-6'>
        <h2 className='text-lg font-bold text-primary'>Meus ativos</h2>
        <p className='hidden text-xs text-gray-400 sm:block'>
          Clique em uma coluna para ordenar
        </p>
      </div>

      <div className='overflow-x-auto border-t border-border'>
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

        {rows.length === 0 && (
          <div className='flex min-h-40 items-center justify-center px-6 text-sm text-gray-500'>
            Sua carteira ainda não possui ativos.
          </div>
        )}
      </div>

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
  const isPositive = row.result > 0;
  const isNegative = row.result < 0;
  const resultClasses = isPositive
    ? 'bg-green-50 text-green-600'
    : isNegative
      ? 'bg-red-50 text-red-600'
      : 'bg-gray-100 text-gray-500';
  const ResultIcon = isPositive
    ? ArrowUpIcon
    : isNegative
      ? ArrowDownIcon
      : MinusIcon;

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
        <span
          className={`inline-flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-1 text-xs font-semibold ${resultClasses}`}
        >
          <ResultIcon size={13} />
          {formatPrice(row.result)}
        </span>
      </td>
      <td className='px-5 py-4 text-right text-sm text-gray-400 sm:px-6'>
        <EditAssetButton id={row.itemId} stockSymbol={row.symbol} quantity={row.quantity} referencePrice={row.referencePrice}/>
        <DeleteAssetButton id={row.itemId}/>
      </td>
    </tr>
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
