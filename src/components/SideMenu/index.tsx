'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import {
  ChartPieIcon,
  LayoutDashboardIcon,
  BellIcon,
  CogIcon,
  CircleQuestionMarkIcon,
} from 'lucide-react';
import { PushNotificationButton } from '@/components/PushNotificationButton';
import { createClient } from '@/lib/supabase/client';
import { StockSearch } from '@/components/StockSearch';
import { SignOutButton } from '@/components/SignOutButton';

const titleClasses = 'text-xs text-gray-400 font-semibold py-2 px-3';
const linkClasses = clsx(
  'flex items-center text-sm text-gray-500 font-medium py-2.5 px-3 rounded-lg gap-2',
  'hover:text-green-600 transition',
);

export function SideMenu() {
  const [loggedUser, setLoggedUser] = useState('USUÁRIO');

  useEffect(() => {
    const supabase = createClient();

    void supabase.auth.getClaims().then(({ data }) => {
      setLoggedUser(data?.claims?.email ?? 'USUÁRIO');
    });
  }, []);

  return (
    <div className='flex flex-col border-r border-border min-h-screen'>
      <Link
        href='/'
        prefetch={false}
        className='text-xl font-bold text-primary p-6 border-b  border-t border-border h-[78px]'
      >
        StockWatcher
      </Link>
      <div className='flex flex-1 flex-col'>
        <StockSearch />
        <div className='flex flex-col px-3'>
          <div className='flex flex-col'>
            <h3 className={titleClasses}>CARTEIRA</h3>
            <Link href='/' prefetch={false} className={linkClasses}>
              <LayoutDashboardIcon size={16} /> <p>Painel Geral</p>
            </Link>
            <Link href='/wallet' prefetch={false} className={linkClasses}>
              <ChartPieIcon size={16} /> <p> Minha Carteira</p>
            </Link>
            <Link href='/alerts' prefetch={false} className={linkClasses}>
              <BellIcon size={16} /> <p> Configurar Alertas</p>
            </Link>
          </div>
          <div className='flex flex-col'>
            <h3 className={titleClasses}>FERRAMENTAS</h3>
            <Link href='/settings' prefetch={false} className={linkClasses}>
              <CogIcon size={16} /> <p>Configurações</p>
            </Link>
            <Link href='/about' prefetch={false} className={linkClasses}>
              <CircleQuestionMarkIcon size={16} /> <p>Ajuda</p>
            </Link>
          </div>
        </div>
        <div className='mt-auto'>
          <div className='border-t border-border p-3'>
            <PushNotificationButton />
          </div>
          <div className='flex items-center justify-between gap-2 border-t border-border p-4 text-sm text-primary'>
            <span className='min-w-0 truncate' title={loggedUser}>
              {loggedUser}
            </span>
            <SignOutButton />
          </div>
        </div>
      </div>
    </div>
  );
}
