import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import {
  ChartPieIcon,
  LayoutDashboardIcon,
  BellIcon,
  CogIcon,
  CircleQuestionMarkIcon,
  SearchIcon,
} from 'lucide-react';

const titleClasses = 'text-xs text-gray-400 font-semibold py-2 px-3';
const linkClasses = clsx(
  'flex items-center text-sm text-gray-500 font-medium py-2.5 px-3 rounded-lg gap-2',
  'hover:text-green-600 transition',
);

export default function Home() {
  return (
    <div className='flex'>
      <div></div>
    </div>
  );
}
