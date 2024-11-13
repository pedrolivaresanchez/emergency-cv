'use server';

import { createClient } from '../../../lib/supabase/server';

export type FiltroOfertas = {
  ayuda: string;
  pueblo: string;
  paginacion: {
    currentPage: number;
    itemsPerPage: number;
  };
};

export async function getOfertas(filter: FiltroOfertas) {
  const supabase = await createClient();
  // Comenzamos la consulta
  const query = supabase.from('help_requests').select('*', { count: 'exact' }).eq('type', 'ofrece');

  // Solo agregar filtro de ayuda si no es "todos"
  if (filter.ayuda !== 'todas') {
    query.contains('help_type', [filter.ayuda]);
  }

  // Solo agregar filtro de pueblo si no es "todos"
  if (filter.pueblo !== 'todos') {
    query.eq('town_id', filter.pueblo); // Filtra por el ID del pueblo
  }

  query.neq('status', 'finished');
  // Ejecutar la consulta con paginación
  return await query
    .range(
      (filter.paginacion.currentPage - 1) * filter.paginacion.itemsPerPage,
      filter.paginacion.currentPage * filter.paginacion.itemsPerPage - 1,
    )
    .order('created_at', { ascending: false });
}
