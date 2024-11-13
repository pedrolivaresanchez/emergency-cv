import { redirect } from 'next/navigation';
import { Provider } from '@supabase/auth-js';
import { ReactNode } from 'react';
import { signInWithOAuth } from '@/lib/actions';

type SocialButtonProps = {
  provider: Provider;
  children: ReactNode;
  redirectUrl?: string;
};
export default function SocialButton({ provider, redirectUrl, children }: SocialButtonProps) {
  const baseUrl =
    process.env.NEXT_PUBLIC_ENV === 'production' ? process.env.NEXT_PUBLIC_BASE_URL! : 'http://127.0.0.1:3000';
  const handleLogin = async (provider: Provider) => {
    const { data, error } = await signInWithOAuth({
      provider,
      options: {
        redirectTo: `${baseUrl + redirectUrl}`,
      },
    });
    if (error) {
      console.error('Error al iniciar sesión con proveedor:', error.message);
      return;
    }

    if (data?.url) return redirect(data.url);
  };

  return (
    <button
      type="button"
      className={`text-center w-full py-3 px-4 text-white rounded-lg font-semibold bg-red-500 hover:opacity-90`}
      onClick={() => handleLogin(provider)}
    >
      {children}
    </button>
  );
}
