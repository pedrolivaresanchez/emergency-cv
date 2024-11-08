'use client';
import { Suspense, useEffect } from 'react';
import Login from '../../components/auth/Login';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/lib/service';

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
      const { data: session } = await authService.getSessionUser();
      if (session.user) {
        router.push(redirect);
      }
    }
    fetchSession();
  });

  return (
    <section className="mx-6 lg:m-16">
      <Login onSuccessCallback={() => router.push(redirect)} redirectUrl={redirect} />
    </section>
  );
}
