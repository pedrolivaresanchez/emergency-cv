import { redirect } from 'next/navigation';
import { Provider } from '@supabase/auth-js';
import { ReactNode } from 'react';
import { signInWithOAuth } from '@/lib/actions';
import { BASE_URL } from '@/helpers/constants';

type SocialButtonProps = {
  provider: Provider;
  children: ReactNode;
  redirectUrl?: string;
};
export default function SocialButton({ provider, redirectUrl, children }: SocialButtonProps) {
  const handleLogin = async (provider: Provider) => {
    const { data, error } = await signInWithOAuth({
      provider,
      options: {
        redirectTo: `${BASE_URL + redirectUrl}`,
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
