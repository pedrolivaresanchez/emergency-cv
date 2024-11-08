'use client';
import { useEffect } from 'react';
import Login from '../../components/auth/Login';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/service';

export default function AuthPage() {
  const router = useRouter();

  useEffect(() => {
    async function fetchSession() {
      const { data: session } = await authService.getSessionUser();
      if (session.user) {
        router.push('/');
      }
    }
    fetchSession();
  });

  return (
    <section className="mx-6 lg:m-16">
      <Login onSuccessCallback={() => (window.location.href = '/')} />
    </section>
  );
}
