'use server';

import { createClient } from '../../../lib/supabase/server';
import { helpDataSelectFields } from '../../../types/Requests';

export type FiltroSolicitudes = {
  urgencia: string;
  tipoAyuda: string;
  pueblo: string;
  soloSinAsignar: string;
  paginacion: {
    itemsPerPage: number;
    currentPage: number;
  };
};

export async function getSolicitudes(filter: FiltroSolicitudes) {
  const supabase = await createClient();
  const query = supabase
    .from('help_requests_with_assignment_count')
    .select(helpDataSelectFields as '*', { count: 'exact' })
    .eq('type', 'necesita');

  // Solo agregar filtro si no es "todos"
  if (filter.tipoAyuda !== 'todas') {
    query.contains('help_type', [filter.tipoAyuda]);
  }

  // Solo agregar filtro si no es "todos"
  if (filter.pueblo !== 'todos') {
    query.eq('town_id', filter.pueblo);
  }

  // Solo agregar filtro si no es "todas"
  if (filter.urgencia !== 'todas') {
    query.eq('urgency', filter.urgencia);
  }

  // Solo agregar filtro si es true
  if (filter.soloSinAsignar === 'true') {
    query.eq('assignments_count', 0);
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
