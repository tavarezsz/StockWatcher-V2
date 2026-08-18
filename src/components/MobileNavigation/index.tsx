'use client';

import Link from 'next/link';
import { BellIcon, ChartPieIcon, CircleHelpIcon, HouseIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const navigationItems = [
  { href: '/', label: 'Início', icon: HouseIcon },
  { href: '/wallet', label: 'Carteira', icon: ChartPieIcon },
  { href: '/alerts', label: 'Alertas', icon: BellIcon },
  { href: '/about', label: 'Ajuda', icon: CircleHelpIcon },
];

export function MobileNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label='Navegação principal'
      className='fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/95 px-3 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden'
    >
      <div className='mx-auto grid h-18 max-w-lg grid-cols-4'>
        {navigationItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === '/' ? pathname === href : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? 'page' : undefined}
              className={clsx(
                'flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors',
                isActive ? 'text-green-600' : 'text-gray-400 hover:text-gray-600',
              )}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
