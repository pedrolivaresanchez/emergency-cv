import { NextRequest } from 'next/server';
import { createServerRoleClient } from '@/lib/supabase/serverrole';

export async function GET(req: NextRequest) {
  // Acceder a los parámetros de búsqueda
  const url = new URL(req.url);
  const searchParams: any = url.searchParams;

  const help_type = searchParams.get('type');
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
      'id, created_at,name,location,description,contact_info,additional_info->experience,status,resources,help_type,town_id,other_help',
      { count: 'exact' },
    )
    .eq('type', 'ofrece');

  if (help_type !== null) {
    query.contains('help_type', [help_type]);
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