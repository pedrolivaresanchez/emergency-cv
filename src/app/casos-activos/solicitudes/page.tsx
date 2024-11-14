import { Suspense } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/database';
import { Solicitudes } from '.';
import { HelpRequestData, HelpRequestDataWithAssignmentCount } from '@/types/Requests';
import { getAllAssignments } from '@/lib/actions';

export const dynamic = 'force-dynamic';

function parseData(
  data: Database['public']['Tables']['help_requests']['Row'][],
  assignments: { id: string; help_request_id: string, people_count: number }[],
): HelpRequestDataWithAssignmentCount[] {
  return data.map((d) => {
    // Remove unused properties to reduce the payload size
    const { coordinates, crm_status, resources, user_id, ...rest } = d;
    const asignees_count = assignments.find((d) => d.help_request_id === d.id)?.people_count;
    return {
      ...rest,
      // Fix the coordinates to 3 decimals so locations have a 100m precision
      latitude: Number(d.latitude?.toFixed(3)),
      longitude: Number(d.longitude?.toFixed(3)),
      asignees_count,
    } ;
  });
}

const getData = async (supabase: SupabaseClient<Database>) => {
  const { error, data } = await supabase.from('help_requests').select().eq('type', 'necesita');
  const { data: assignments, error: assignmentError } = await getAllAssignments();

  if (error) {
    throw new Error('Error fetching solicita:', error);
  }
  if (assignmentError) {
    throw new Error('Error fetching assignments:', assignmentError);
  }

  return parseData(data, assignments);
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
