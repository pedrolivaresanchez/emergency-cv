'use client';
import OfferHelp from '@/components/OfferHelp';
import { supabase } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

export default function OfrecerAyuda() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      setSession(session);
    });
  }, []);

  return session ? (
    <OfferHelp sessionProp={session} />
  ) : (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );
}
