'use client';

import Link from "next/link";

export default function Tab({ children, ...props}) {
    return (
        <Link
        href={props.href}
        className={`flex flex-col items-center justify-center py-3 px-2 rounded-lg transition-colors ${
            props.isPath
            ? `bg-${props.color}-500 text-white`
            : 'bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900'
        }`}
      >
        { children }
      </Link>
    )
}