import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    return Response.json({ message: 'Not logged.' });
  }
  const metadata = data.user.user_metadata;
  if (!metadata.telefono) {
    return Response.json({ message: 'No phone registered to this account.' });
  }
  const registeredPost = await supabase
    .from('help_requests')
    .select('id')
    .ilike('contact_info', '%' + metadata.telefono + '%');
  return Response.json({ registeredPost });
}
