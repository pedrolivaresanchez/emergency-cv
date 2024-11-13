'use server';

import { createClient } from '../../lib/supabase/server';

export type PuntoDeEntrega = {
  name: string;
  location: string;
  city: string;
  contact_name: string | null;
  contact_phone: string | null | undefined;
  contact_email: string | null;
  vehicle_type: string | null;
  cargo_type: string | null;
  schedule: string | null;
  additional_info: string | null;
  latitude: number | null;
  longitude: number | null;
  status: string;
};

export async function getPuntosDeEntrega() {
  const supabase = await createClient();
  return await supabase.from('delivery_points').select('*').order('created_at', { ascending: false });
}

export async function createPuntoDeEntrega(puntosDeEntrega: PuntoDeEntrega[]) {
  const supabase = await createClient();
  return await supabase.from('delivery_points').insert(puntosDeEntrega);
}
