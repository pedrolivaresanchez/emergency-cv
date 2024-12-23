'use client';
import { Suspense, useEffect } from 'react';
import Login from '../../components/auth/Login';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';
import { useSession } from '../../context/SessionProvider';

export default function AUthPage() {
  return (
    <Suspense>
      <Auth />
    </Suspense>
  );
}

function Auth() {
  const session = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  useEffect(() => {
    if (session.user) {
      router.push(redirect);
    }
  }, [session]);

  return (
    <section className="mx-6 lg:m-16">
      <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded mb-4">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
          <div>
            <p className="text-red-700 text-sm mt-1">Debes registrarte para crear una publicacion.</p>
            <p className="text-red-900 text-sm mt-1 font-medium">
              Por dificultades tecnicas, por favor escríbenos a info@ajudadana.es
            </p>
          </div>
        </div>
      </div>
      <Login onSuccessCallback={() => router.push(redirect)} redirectUrl={redirect} />
    </section>
  );
}
