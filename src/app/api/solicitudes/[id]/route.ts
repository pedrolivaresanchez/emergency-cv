import { createServerRoleClient } from '@/lib/supabase/serverrole';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;

  const supabase = await createServerRoleClient();
  // const { data: dataUser, error: errorUser } = await supabase.auth.getUser();
  // if (errorUser || !dataUser?.user) {
  //   return Response.json({ message: 'Not logged.', errorUser });
  // }

  const { data, error } = await supabase
    .from('help_requests')
    .select(
      'id, created_at, name, location, description, urgency, number_of_people, contact_info, additional_info->special_situations, status, resources, latitude, longitude, coordinates, help_type, people_needed, other_help,town_id',
      { count: 'exact' },
    )
    .eq('id', id)
    .limit(1)
    .select();

  if (error) {
    return Response.json({ error });
  }
  return Response.json({ data });
}
