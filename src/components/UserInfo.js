import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LogIn } from 'lucide-react';
import { authService } from '@/lib/service';
import { usePathname } from 'next/navigation';

const UserProfile = () => {
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchSession() {
      const { data: session } = await authService.getSessionUser();
      if (session && session.user) {
        setUser(session.user);
      }
    }
    fetchSession();
  }, [pathname]);

  const handleLogout = async () => {
    const response = await authService.signOut();
    if (!response.error) {
      setUser(null);
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
    <div>
      <h2>Bienvenido, {user.user_metadata.full_name || user.user_metadata.nombre}</h2>
      <button onClick={() => handleLogout()} className="text-gray-600 hover:underline">
        Cerrar sesión
      </button>
    </div>
  );
};

export default UserProfile;
