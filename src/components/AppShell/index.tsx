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
      <div className='shrink-0'>
        <SideMenu />
      </div>
      <div className='flex min-w-0 flex-1 flex-col'>
        <TopMenu />
        <main className='flex-1 bg-background-sec'>{children}</main>
      </div>
    </div>
  );
}
