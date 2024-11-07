import React from 'react';

import { createClient } from '@/lib/supabase/server';
// @ts-expect-error
import TabNavigation from '@/components/TabNavigation';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
const getCount = async (supabase: SupabaseClient<Database>) => {
  const {
    data: solicitaData,
    count: solicitaCount,
    error: solicitaError,
  } = await supabase.from('help_requests').select('id', { count: 'exact' }).eq('type', 'necesita');

  const {
    data: ofreceData,
    count: ofreceCount,
    error: ofreceError,
  } = await supabase.from('help_requests').select('id', { count: 'exact' }).eq('type', 'ofrece');

  if (solicitaError) {
    throw new Error('Error fetching solicita:', solicitaError);
  }
  if (ofreceError) {
    throw new Error('Error fetching ofrece:', ofreceError);
  }

  return {
    solicitudes: solicitaCount || 0,
    ofertas: ofreceCount || 0,
  };
};

export default async function CasosActivosLayout({ children }) {
  const supabase = await createClient();
  const count = await getCount(supabase);
  return (
    <>
      <div className="space-y-6 mx-auto max-w-7xl px-4 sm:px-6">
        <TabNavigation count={count} />
        {children}
      </div>
    </>
  );
}
