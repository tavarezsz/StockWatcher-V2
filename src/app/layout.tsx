import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SideMenu } from '@/components/SideMenu';

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
      <body className={`${inter.variable} flex`}>
        <div>
          <SideMenu />
        </div>
        <div>{children}</div>
      </body>
    </html>
  );
}
