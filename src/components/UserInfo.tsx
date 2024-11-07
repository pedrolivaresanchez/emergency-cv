'use client';

import Link from 'next/link';
import { LogIn } from 'lucide-react';
import { authService } from '@/lib/service';
import { useSession } from '@/context/SessionProvider';

export default function UserProfile() {
  const session = useSession();
  const user = session.user;

  const handleLogout = async () => {
    const response = await authService.signOut();
    if (!response.error) {
      window.location.href = '/';
    }
  };

  if (!user) {
    return (
      <Link
        href="/auth"
        className="w-full text-left transition-colors p-3 rounded-lg flex items-center gap-2 hover:bg-gray-50"
      >
        <LogIn className="h-5 w-5 text-gray-600" />
        Inicia sesión
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-4 px-2">
      {user.user_metadata.avatar_url ? (
        <img className="w-10 h-10 rounded-full" src={user.user_metadata.avatar_url} alt="Rounded avatar" />
      ) : (
        <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
          <svg
            className="absolute w-12 h-12 text-gray-400 -left-1"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
      )}
      <div className="font-medium">
        <div>{user.user_metadata.full_name || user.user_metadata.nombre}</div>
        <button onClick={handleLogout} className="text-gray-600 hover:underline">
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
