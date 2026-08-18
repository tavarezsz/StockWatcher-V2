'use client';

import { usePathname } from 'next/navigation';
import { SideMenu } from '@/components/SideMenu';
import { TopMenu } from '@/components/TopMenu';

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isAuthRoute = pathname === '/login' || pathname.startsWith('/auth/');

  if (isAuthRoute) {
    return <main className='min-h-screen bg-background-sec'>{children}</main>;
  }

  return (
    <div className='flex min-h-screen'>
      <aside className='sticky top-0 h-screen shrink-0 self-start overflow-y-auto'>
        <SideMenu />
      </aside>
      <div className='flex min-w-0 flex-1 flex-col'>
        <header className='sticky top-0 z-10 shrink-0 bg-background'>
          <TopMenu />
        </header>
        <main className='flex-1 bg-background-sec'>{children}</main>
      </div>
    </div>
  );
}
