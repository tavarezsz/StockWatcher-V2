import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ToastifyContainer } from '@/components/ToastifyContainer';
import { Suspense } from 'react';
import { AppShell } from '@/components/AppShell';

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
      <body className={`${inter.variable} min-h-screen`}>
        <Suspense fallback={<main className='min-h-screen bg-background-sec' />}>
          <AppShell>{children}</AppShell>
        </Suspense>
        <ToastifyContainer />
      </body>
    </html>
  );
}
