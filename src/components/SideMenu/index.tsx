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
  LogOutIcon,
} from 'lucide-react';
import { PushNotificationButton } from '@/components/PushNotificationButton';
import { createClient } from '@/lib/supabase/client';
import { signOutAction } from '@/actions/auth/sign-out';
import { unsubscribeFromPushAction } from '@/actions/push/unsubscribe-push';
import { StockSearch } from '@/components/StockSearch';

const titleClasses = 'text-xs text-gray-400 font-semibold py-2 px-3';
const linkClasses = clsx(
  'flex items-center text-sm text-gray-500 font-medium py-2.5 px-3 rounded-lg gap-2',
  'hover:text-green-600 transition',
);

export function SideMenu() {
  const [loggedUser, setLoggedUser] = useState('USUÁRIO');
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    void supabase.auth.getUser().then(({ data }) => {
      setLoggedUser(data.user?.email ?? 'USUÁRIO');
    });
  }, []);

  async function handleSignOut() {
    setIsSigningOut(true);

    try {
      const registration = await navigator.serviceWorker?.getRegistration();
      const subscription = await registration?.pushManager.getSubscription();

      if (subscription) {
        await unsubscribeFromPushAction(subscription.endpoint);
        await subscription.unsubscribe();
      }
    } finally {
      await signOutAction();
    }
  }

  return (
    <div className='flex flex-col border-r border-border min-h-screen'>
      <Link
        href='/'
        className='text-xl font-bold text-primary p-6 border-b  border-t border-border h-[78px]'
      >
        StockWatcher
      </Link>
      <div className='flex flex-1 flex-col'>
        <StockSearch />
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
        <div className='mt-auto'>
          <div className='border-t border-border p-3'>
            <PushNotificationButton />
          </div>
          <div className='flex items-center justify-between gap-2 border-t border-border p-4 text-sm text-primary'>
            <span className='min-w-0 truncate' title={loggedUser}>
              {loggedUser}
            </span>
            <button
              type='button'
              title='Sair'
              aria-label='Sair da conta'
              disabled={isSigningOut}
              onClick={() => void handleSignOut()}
              className='rounded-md p-1.5 text-gray-500 transition hover:bg-background-sec hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50'
            >
              <LogOutIcon size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
