'use client'
import Link from 'next/link';
import clsx from 'clsx';
import {
  ChartPieIcon,
  LayoutDashboardIcon,
  BellIcon,
  CogIcon,
  CircleQuestionMarkIcon,
  SearchIcon,
} from 'lucide-react';

const titleClasses = 'text-xs text-gray-400 font-semibold py-2 px-3';
const linkClasses = clsx(
  'flex items-center text-sm text-gray-500 font-medium py-2.5 px-3 rounded-lg gap-2',
  'hover:text-green-600 transition',
);

const loggedUser = 'ANONIMO';

export function SideMenu() {
  return (
    <div className='flex flex-col border-r border-border min-h-screen'>
      <Link
        href='/'
        className='text-xl font-bold text-primary p-6 border-b  border-t border-border h-[78px]'
      >
        StockWatcher
      </Link>
      <div className='flex flex-1 flex-col'>
        <div className='flex items-center gap-2 rounded-lg text-sm text-gray-600 m-5 p-3 border-border bg-background-sec'>
          <SearchIcon size={16} />
          <p>Bucar ativo...</p>
        </div>
        <div className='flex flex-col px-3'>
          <div className='flex flex-col'>
            <h3 className={titleClasses}>CARTEIRA</h3>
            <Link href='/' className={linkClasses}>
              <LayoutDashboardIcon size={16} /> <p>Painel Geral</p>
            </Link>
            <Link href='/wallet' className={linkClasses}>
              <ChartPieIcon size={16} /> <p> Minha Carteira</p>
            </Link>
            <Link href='/alerts' className={linkClasses}>
              <BellIcon size={16} /> <p> Configurar Alertas</p>
            </Link>
          </div>
          <div className='flex flex-col'>
            <h3 className={titleClasses}>FERRAMENTAS</h3>
            <Link href='/' className={linkClasses}>
              <CogIcon size={16} /> <p>Configurações</p>
            </Link>
            <Link href='/' className={linkClasses}>
              <CircleQuestionMarkIcon size={16} /> <p>Ajuda</p>
            </Link>
          </div>
        </div>
        <div className='mt-auto p-4 text-sm text-primary border-t border-border'>
          {loggedUser}
        </div>
      </div>
    </div>
  );
}
