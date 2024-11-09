import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  // Acceder a los parámetros de búsqueda
  const url = new URL(req.url);
  const searchParams: any = url.searchParams;

  const help_type = searchParams.get('type') || null;
  const town_id = searchParams.get('town') || null;
  const urgency = searchParams.get('urgency') || null;
  const currentPage = searchParams.get('page') ?? 1;
  const itemsPerPage = 10;

  const supabase = await createServerRoleClient();
  // const { data: dataUser, error: errorUser } = await supabase.auth.getUser();
  // if (errorUser || !dataUser?.user) {
  //   return Response.json({ message: 'Not logged.', errorUser });
  // }
	const query = supabase
    .from('help_requests')
    .select(
      'id, created_at, name, location, description, urgency, number_of_people, contact_info, additional_info->special_situations, status, resources, latitude, longitude, coordinates, help_type, people_needed, other_help,town_id',
      { count: 'exact' },
    )
    .eq('type', 'necesita');

  if (help_type !== null) {
    query.contains('help_type', [help_type]);
  }

  if (town_id !== null) {
    query.eq('town_id', town_id);
  }

  if (urgency !== null) {
    query.eq('urgency', urgency);
  }

  query.neq('status', 'finished');

  const { data, count, error } = await query
    .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1)
    .order('created_at', { ascending: false });

  if (error) {
    return Response.json({ error });
  }
  const countResponse = count ?? 0;
  return Response.json({ data, count: countResponse });
}