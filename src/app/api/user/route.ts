import { createServerRoleClient } from '@/lib/supabase/server_role';

export async function GET() {
  const supabase = await createServerRoleClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    return Response.json({ message: 'Not logged.', error });
  }
  return Response.json({ data });
}
