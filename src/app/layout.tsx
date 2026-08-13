import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SideMenu } from '@/components/SideMenu';
import { TopMenu } from '@/components/TopMenu';
import { ToastifyContainer } from '@/components/ToastifyContainer';
import { Suspense } from 'react';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'StockWtacher',
    template: ' %s | StockWatcher',
  },
  description: 'Seu novo app de controle de ações!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='pt-BR'>
      <body className={`${inter.variable} flex min-h-screen`}>
        <div className='shrink-0'>
          <SideMenu />
        </div>
        <div className='flex min-w-0 flex-1 flex-col'>
          <Suspense>
            <TopMenu />
          </Suspense>
          <main className='flex-1'>{children}</main>
        </div>
        <ToastifyContainer />
      </body>
    </html>
  );
}
