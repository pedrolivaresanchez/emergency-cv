'use server';

import { createClient } from '../../lib/supabase/server';

export type PuntoDeRecogida = {
  name: string | null | undefined;
  type: string;
  location: string | null | undefined;
  city: string | null;
  contact_name: string | null;
  contact_phone: string | null | undefined;
  accepted_items: string[];
  urgent_needs: string | null;
  status: string;
};

export async function getPuntosDeRecogida() {
  const supabase = await createClient();
  return await supabase.from('collection_points').select('*').order('created_at', { ascending: false });
}

export async function insertPuntoDeRecogida(puntosDeRecgida: PuntoDeRecogida[]) {
  const supabase = await createClient();
  return await supabase.from('collection_points').insert(puntosDeRecgida);
}
