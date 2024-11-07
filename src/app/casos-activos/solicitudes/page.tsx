import React from 'react';

import { createClient } from '@/lib/supabase/server';
import { PageFilters, SearchParams } from './types';
import { DEFAULT_FITLERS, ITEMS_PER_PAGE } from './constants';
import { townsService } from '@/lib/service';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { searchParams2Filters } from './utils';
import { PageContent } from './_components/PageContent';

async function fetchData(
  supabase: SupabaseClient<Database>,
  { currentPage, pueblo, tipoAyuda, urgencia, soloSinVoluntarios }: PageFilters,
) {
  // Comenzamos la consulta
  const query = supabase.from('help_requests').select('*', { count: 'exact' }).eq('type', 'necesita');

  // Solo agregar filtro si no es "todos"
  if (tipoAyuda !== 'todas') {
    query.contains('help_type', [tipoAyuda]);
  }

  // Solo agregar filtro si no es "todos"
  if (pueblo !== 'todos') {
    query.eq('town_id', pueblo);
  }

  // Solo agregar filtro si no es "todas"
  if (urgencia !== 'todas') {
    query.eq('urgency', urgencia);
  }

  // Solo agregar filtro si el checkbox esta activado
  if (!!soloSinVoluntarios) {
    query.eq('asignees_count', 0);
  }

  query.neq('status', 'finished');
  // Ejecutar la consulta con paginación
  const { data, count, error } = await query
    .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1)
    .order('created_at', { ascending: false });

  return {
    data,
    count,
  };
}

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams | undefined> }) {
  const supabase = await createClient();

  let filters: PageFilters;
  const searchParameters = await searchParams;
  if (!searchParameters) {
    filters = DEFAULT_FITLERS;
  } else {
    filters = searchParams2Filters(searchParameters);
  }

  const { count, data } = await fetchData(supabase, filters);
  const towns = await townsService.getTowns(supabase);

  return <PageContent currentCount={count || 0} data={data} filters={filters} towns={towns} />;
}
