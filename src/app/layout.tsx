import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SideMenu } from '@/components/SideMenu';
import { TopMenu } from '@/components/TopMenu';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'StockWatcher',
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
          <TopMenu />
          <main className='flex-1'>{children}</main>
        </div>
      </body>
    </html>
  );
}
