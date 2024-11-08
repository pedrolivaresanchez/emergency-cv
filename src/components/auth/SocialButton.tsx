import { supabase } from '@/lib/supabase/client';
import { redirect } from 'next/navigation';
import { Provider } from '@supabase/auth-js';
import { ReactNode } from 'react';

type SocialButtonProps = {
  provider: Provider;
  children: ReactNode;
};
export default function SocialButton({ provider, children }: SocialButtonProps) {
  const handleLogin = async (provider: Provider) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
    });
    if (error) {
      console.error('Error al iniciar sesión con proveedor:', error.message);
      return;
    }

    if (data?.url) {
      return redirect(data.url);
    }
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
