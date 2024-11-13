'use client';
import { Suspense, useEffect } from 'react';
import Login from '../../components/auth/Login';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSessionUser } from '@/lib/actions';
import { AlertTriangle } from 'lucide-react';

export default function AUthPage() {
  return (
    <Suspense>
      <Auth />
    </Suspense>
  );
}

function Auth() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  useEffect(() => {
    async function fetchSession() {
      const { data: session } = await getSessionUser();
      if (session.user) {
        router.push(redirect);
      }
    }
    fetchSession();
  });

  return (
    <section className="mx-6 lg:m-16">
      <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded mb-4">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
          <div>
            <h2 className="text-red-800 font-bold">
              POR MOTIVOS DE SEGURIDAD HEMOS DESHABILITADO LAS PUBLICACIONES ANONIMAS
            </h2>
            <p className="text-red-700 text-sm mt-1">Ahora debes registrarte para crear una publicacion.</p>
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
