import { createClient } from '../../../lib/supabase/server';
import { helpDataSelectFields } from '../../../types/Requests';

export async function getSolicitud(id: string) {
  const supabase = await createClient();
  return await supabase
    .from('help_requests')
    .select(helpDataSelectFields as '*')
    .eq('id', id)
    .single();
}
