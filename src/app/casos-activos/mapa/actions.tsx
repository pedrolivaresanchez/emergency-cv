'use server';

import { createClient } from '../../../lib/supabase/server';

export type FiltroMapa = {
  urgencia: string;
  tipoAyuda: string;
  pueblo: string;
  acepta: string;
};

export async function getMapPoints(filter: FiltroMapa) {
  const supabase = await createClient();
  const query = supabase.from('help_requests').select('*').eq('type', 'necesita');
  if (filter.tipoAyuda !== 'todas') {
    query.contains('help_type', [filter.tipoAyuda]);
  }
  if (filter.urgencia !== 'todas') {
    query.eq('urgency', filter.urgencia);
  }

  query.neq('status', 'finished');

  const { data, error } = await query.order('created_at', { ascending: false });

  const pickupQuery = supabase.from('collection_points').select('*', { count: 'exact' });
  if (filter.acepta !== 'todos') {
    query.contains('accepted_items', [filter.acepta]);
  }

  return await pickupQuery.order('created_at', { ascending: false });
}
