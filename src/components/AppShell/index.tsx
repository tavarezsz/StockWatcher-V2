'use client';

import { usePathname } from 'next/navigation';
import { SideMenu } from '@/components/SideMenu';
import { TopMenu } from '@/components/TopMenu';
import { MobileNavigation } from '@/components/MobileNavigation';
import { StockSearch } from '@/components/StockSearch';
import Link from 'next/link';
import { BellIcon } from 'lucide-react';

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isStockPage = pathname.startsWith('/stock/');
  const isPublicRoute =
    pathname === '/about' ||
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname.startsWith('/auth/');

  if (isPublicRoute) {
    return <main className='min-h-screen bg-background-sec'>{children}</main>;
  }

  return (
    <div className='flex min-h-screen'>
      <aside className='sticky top-0 hidden h-screen shrink-0 self-start overflow-y-auto lg:block'>
        <SideMenu />
      </aside>
      <div className='flex min-w-0 flex-1 flex-col'>
        {!isStockPage && (
          <header className='sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-border bg-white/95 px-4 backdrop-blur lg:hidden'>
            <Link href='/' prefetch={false} className='text-lg font-bold text-primary'>
              StockWatcher
            </Link>
            <div className='flex items-center gap-1'>
              <StockSearch triggerVariant='icon' />
              <Link
                href='/alerts'
                prefetch={false}
                aria-label='Ver alertas'
                className='flex size-10 items-center justify-center rounded-xl text-gray-500 transition hover:bg-green-50 hover:text-green-600'
              >
                <BellIcon size={20} />
              </Link>
            </div>
          </header>
        )}
        <header className='sticky top-0 z-10 hidden shrink-0 bg-background lg:block'>
          <TopMenu />
        </header>
        <main className='flex-1 bg-background-sec pb-18 lg:pb-0'>{children}</main>
      </div>
      <MobileNavigation />
    </div>
  );
}
