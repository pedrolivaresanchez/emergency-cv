import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    return Response.json({ message: 'Not logged.', error });
  }
  return Response.json({ data });
}
