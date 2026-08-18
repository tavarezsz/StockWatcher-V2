'use client';

import { DeleteAlertButton } from '@/components/RecentAlerts/DeleteAlertButton';
import type {
  AlertModel,
  TargetCondition,
  TargetValueType,
} from '@/models/alert-model';
import { formatPrice, formatVariation } from '@/utils/formatters';
import { SearchIcon } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { getStockHref } from '@/utils/stockRoute';

export type AlertListRow = {
  id?: string;
  stockSymbol: string;
  targetValue: number;
  targetValueType: TargetValueType;
  targetCondition: TargetCondition;
  status: AlertModel['status'];
  createdAt: string;
};

type AlertListTableProps = {
  rows: AlertListRow[];
};

type StatusFilter = 'all' | 'disparado' | 'ativo';
type PaginationItem = number | 'ellipsis-left' | 'ellipsis-right';

const ITEMS_PER_PAGE = 5;

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  timeZone: 'America/Sao_Paulo',
});

const statusConfig: Record<
  AlertModel['status'],
  { label: string; classes: string }
> = {
  ativo: {
    label: 'Ativo',
    classes: 'bg-green-100 text-green-600',
  },
  disparado: {
    label: 'Disparado',
    classes: 'border border-border bg-background-sec text-gray-500',
  },
  pausado: {
    label: 'Pausado',
    classes: 'bg-gray-100 text-gray-500',
  },
};

const filters: { label: string; value: StatusFilter }[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Disparados', value: 'disparado' },
  { label: 'Ativos', value: 'ativo' },
];

export function AlertListTable({ rows }: AlertListTableProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filteredRows = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleUpperCase('pt-BR');

    return rows.filter((row) => {
      const matchesStatus =
        statusFilter === 'all' || row.status === statusFilter;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        row.stockSymbol.toLocaleUpperCase('pt-BR').includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [rows, search, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRows.length / ITEMS_PER_PAGE),
  );
  const currentPage = Math.min(page, totalPages);
  const firstItemIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleRows = filteredRows.slice(
    firstItemIndex,
    firstItemIndex + ITEMS_PER_PAGE,
  );
  const paginationItems = getPaginationItems(currentPage, totalPages);

  function handleFilterChange(filter: StatusFilter) {
    setStatusFilter(filter);
    setPage(1);
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  return (
    <section className='overflow-hidden rounded-xl border border-border bg-white'>
      <div className='flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6'>
        <div className='flex items-center gap-1' aria-label='Filtrar alertas'>
          {filters.map(filter => {
            const isSelected = statusFilter === filter.value;

            return (
              <button
                key={filter.value}
                type='button'
                aria-pressed={isSelected}
                onClick={() => handleFilterChange(filter.value)}
                className={`cursor-pointer rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-green-50 text-green-600'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-primary'
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <label className='relative block w-full sm:max-w-72'>
          <span className='sr-only'>Buscar alerta pelo ticker</span>
          <SearchIcon
            size={15}
            className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
          />
          <input
            type='search'
            value={search}
            onChange={event => handleSearchChange(event.target.value)}
            placeholder='Filtrar por ticker...'
            className='w-full rounded-lg border border-border bg-background-sec py-2.5 pl-9 pr-3 text-sm text-primary outline-none transition-colors placeholder:text-gray-400 focus:border-green-500'
          />
        </label>
      </div>

      <div className='overflow-x-auto border-t border-border'>
        <table className='w-full min-w-200 table-fixed border-collapse text-left'>
          <thead>
            <tr className='border-b border-border text-[11px] font-semibold uppercase tracking-wide text-gray-400'>
              <th className='w-[20%] px-5 py-3 sm:px-6'>Ativo</th>
              <th className='w-[24%] px-4 py-3'>Condição</th>
              <th className='w-[17%] px-4 py-3'>Valor alvo</th>
              <th className='w-[17%] px-4 py-3'>Criado em</th>
              <th className='w-[14%] px-4 py-3'>Status</th>
              <th className='w-[8%] whitespace-nowrap px-3 py-3 text-right sm:px-4'>
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((alert, index) => (
              <AlertTableRow
                key={alert.id ?? `${alert.stockSymbol}-${index}`}
                alert={alert}
              />
            ))}
          </tbody>
        </table>

        {filteredRows.length === 0 && (
          <div className='flex min-h-40 items-center justify-center px-6 text-sm text-gray-500'>
            Nenhum alerta encontrado.
          </div>
        )}
      </div>

      <div className='flex min-h-16 flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6'>
        <p className='text-xs text-gray-500'>
          {filteredRows.length > 0
            ? `Mostrando ${firstItemIndex + 1}-${Math.min(
                firstItemIndex + ITEMS_PER_PAGE,
                filteredRows.length,
              )} de ${filteredRows.length} alertas`
            : 'Mostrando 0 alertas'}
        </p>

        {filteredRows.length > 0 && (
          <nav className='flex items-center gap-1.5' aria-label='Paginação'>
            <PaginationButton
              disabled={currentPage === 1}
              onClick={() => setPage(currentPage - 1)}
            >
              Anterior
            </PaginationButton>

            {paginationItems.map(item =>
              typeof item === 'number' ? (
                <button
                  key={item}
                  type='button'
                  aria-label={`Ir para a página ${item}`}
                  aria-current={item === currentPage ? 'page' : undefined}
                  onClick={() => setPage(item)}
                  className={`flex size-8 cursor-pointer items-center justify-center rounded-md text-xs font-semibold transition-colors ${
                    item === currentPage
                      ? 'bg-green-600 text-white'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-primary'
                  }`}
                >
                  {item}
                </button>
              ) : (
                <span
                  key={item}
                  className='px-1 text-xs text-gray-400'
                  aria-hidden='true'
                >
                  ···
                </span>
              ),
            )}

            <PaginationButton
              disabled={currentPage === totalPages}
              onClick={() => setPage(currentPage + 1)}
            >
              Próximo
            </PaginationButton>
          </nav>
        )}
      </div>
    </section>
  );
}

function AlertTableRow({ alert }: { alert: AlertListRow }) {
  const status = statusConfig[alert.status];
  const displaySymbol = alert.stockSymbol.replace(/\.SA$/i, '');

  return (
    <tr className='border-b border-border text-sm last:border-b-0'>
      <td className='px-5 py-3.5 sm:px-6'>
        <Link
          href={getStockHref(alert.stockSymbol)}
          className='font-bold text-primary transition-colors hover:text-green-600'
        >
          {displaySymbol}
        </Link>
      </td>
      <td className='px-4 py-3.5 text-gray-600'>
        {formatAlertCondition(alert)}
      </td>
      <td className='px-4 py-3.5 font-semibold text-primary'>
        {formatTargetValue(alert)}
      </td>
      <td className='px-4 py-3.5 text-gray-500'>
        {dateFormatter.format(new Date(alert.createdAt))}
      </td>
      <td className='px-4 py-3.5'>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.classes}`}
        >
          <span className='size-1.5 rounded-full bg-current' />
          {status.label}
        </span>
      </td>
      <td className='px-3 py-3.5 text-right sm:px-4'>
        <DeleteAlertButton alertId={alert.id} />
      </td>
    </tr>
  );
}

function formatAlertCondition(alert: AlertListRow) {
  if (alert.targetValueType === 'variationDay') {
    return alert.targetCondition === 'above'
      ? 'Variação diária acima de'
      : 'Variação diária abaixo de';
  }

  return alert.targetCondition === 'above'
    ? 'Preço acima de'
    : 'Preço abaixo de';
}

function formatTargetValue(alert: AlertListRow) {
  if (alert.targetValueType === 'variationDay') {
    return `${formatVariation(Math.abs(alert.targetValue))}%`;
  }

  return formatPrice(alert.targetValue);
}

type PaginationButtonProps = {
  children: React.ReactNode;
  disabled: boolean;
  onClick: () => void;
};

function PaginationButton({
  children,
  disabled,
  onClick,
}: PaginationButtonProps) {
  return (
    <button
      type='button'
      disabled={disabled}
      onClick={onClick}
      className='cursor-pointer rounded-lg border border-border px-3 py-2 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-primary disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-white'
    >
      {children}
    </button>
  );
}

function getPaginationItems(
  currentPage: number,
  totalPages: number,
): PaginationItem[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 'ellipsis-right', totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [
      1,
      'ellipsis-left',
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    'ellipsis-left',
    currentPage,
    'ellipsis-right',
    totalPages,
  ];
}
