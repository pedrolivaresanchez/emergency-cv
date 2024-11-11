import { Suspense } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/database';
import { Solicitudes } from '.';
import { HelpRequestData } from '@/types/Requests';
import { HelpRequestDataClean } from './types';

export const dynamic = 'force-dynamic';

function parseData(data: Database['public']['Tables']['help_requests']['Row'][]): HelpRequestDataClean[] {
  // TODO: return only the data needed and remove latitude and longitude precision
  return data as HelpRequestDataClean[];
  // return data.map(d => ({
  //   id: d.id,
  //   latitude: d.latitude,
  //   longitude: d.longitude,
  // }))
}

const getData = async (supabase: SupabaseClient<Database>) => {
  const { error, data } = await supabase.from('help_requests').select().eq('type', 'necesita');

  if (error) {
    throw new Error('Error fetching solicita:', error);
  }

  return parseData(data);
};

const getCount = async (supabase: SupabaseClient<Database>) => {
  const { count: solicitaCount, error: solicitaError } = await supabase
    .from('help_requests')
    .select('id', { count: 'exact' })
    .eq('type', 'necesita');

  const { count: ofreceCount, error: ofreceError } = await supabase
    .from('help_requests')
    .select('id', { count: 'exact' })
    .eq('type', 'ofrece');

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

export default async function SolicitudesPage() {
  const supabase = await createClient();
  const data = await getData(supabase);
  const count = await getCount(supabase);
  console.log('🚀 ~ SolicitudesPage ~ data:', data);

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      }
    >
      <Solicitudes data={data} count={count} />
    </Suspense>
  );
}
