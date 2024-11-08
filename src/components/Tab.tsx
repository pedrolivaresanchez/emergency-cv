'use client';

import Link from 'next/link';
import { PropsWithChildren } from 'react';
import { usePathname } from 'next/navigation';

type Props = {
  color: 'red' | 'green' | 'orange';
  href: string;
};

export default function Tab({ children, ...props }: PropsWithChildren<Props>) {
  const pathname = usePathname();
  const isSelected = pathname === props.href;
  return (
    <Link
      href={props.href}
      className={`flex flex-col items-center justify-center py-3 px-2 rounded-lg transition-colors ${
        isSelected
          ? `bg-${props.color}-500 text-white`
          : 'bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900'
      }`}
    >
      {children}
    </Link>
  );
}
