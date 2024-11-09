import { NextRequest } from 'next/server';
import { createServerRoleClient } from '@/lib/supabase/serverrole';

export async function GET(req: NextRequest) {
	const url = new URL(req.url);
	const searchParams: any = url.searchParams;

	const accepted_items = searchParams.get('accepted') || null;

	const supabase = await createServerRoleClient();
	// const { data: dataUser, error: errorUser } = await supabase.auth.getUser();
	// if (errorUser || !dataUser?.user) {
	//   return Response.json({ message: 'Not logged.', errorUser });
	// }

	const query = supabase
		.from('collection_points')
		.select('*')

	if (accepted_items !== null) {
		query.contains('accepted_items', [accepted_items]);
	}

	const { data, error } = await query.order('created_at', { ascending: false });


	if (error) {
		return Response.json({ error });
	} else {
		return Response.json({ data });
	}
	return Response.json({ message: 'Error' });
}