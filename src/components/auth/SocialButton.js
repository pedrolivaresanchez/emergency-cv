import { supabase } from '@/lib/supabase';
import { redirect } from 'next/navigation';

export default function SocialButton({ provider, children }) {
  const providersBg = {
    google: 'red-500',
  };

  const handleLogin = async (provider) => {
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
      className={`text-center w-full py-3 px-4 text-white rounded-lg font-semibold bg-${providersBg[provider]} hover:opacity-90`}
      onClick={() => handleLogin(provider)}
    >
      {children}
    </button>
  );
}
