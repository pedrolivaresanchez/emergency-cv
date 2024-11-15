import { Suspense } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/database';
import { Solicitudes } from '.';
import { getAllAssignments } from '@/lib/actions';
import { HelpRequestData, HelpRequestDataWAssignmentCount } from '../../../types/Requests';

export const dynamic = 'force-dynamic';

type Assignment = { id: number; help_request_id: number };

function parseData(data: HelpRequestData[], assignments: Assignment[]): HelpRequestDataWAssignmentCount[] {
  const assignmentCountMap: { [key: string]: number } = {};
  for (const assignment of assignments) {
    if (!assignmentCountMap[assignment.help_request_id]) {
      assignmentCountMap[assignment.help_request_id] = 1;
    } else {
      assignmentCountMap[assignment.help_request_id] += 1;
    }
  }

  return data.map((d) => {
    // Remove unused properties to reduce the payload size
    const { coordinates, location, ...rest } = d;
    return {
      ...rest,
      // Fix the coordinates to 3 decimals so locations have a 100m precision
      latitude: Number(d.latitude?.toFixed(3)),
      longitude: Number(d.longitude?.toFixed(3)),
      help_request_assignment_count: assignmentCountMap[rest.id] || 0,
    };
  });
}

const getData = async (supabase: SupabaseClient<Database>) => {
  const { error, data } = await supabase
    .from('help_requests')
    .select('*')
    .eq('type', 'necesita')
    .order('created_at', { ascending: false });
  const { data: assignments, error: assignmentError } = await getAllAssignments();

  if (error) {
    throw new Error('Error fetching solicita:', error);
  }
  if (assignmentError) {
    throw new Error('Error fetching assignments:', assignmentError);
  }

  return parseData(data as HelpRequestData[], assignments);
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
