import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    return Response.json({ message: 'Not logged.', error });
  }
  const email = data.user.email;
  const registeredPost = await supabase
    .from('help_requests')
    .select('id')
    .eq('type', 'ofrece')
    .or(`contact_info.ilike.%${email}%,additional_info.cs.${JSON.stringify({ email: email })}`);
  return Response.json({ registeredPost });
}
