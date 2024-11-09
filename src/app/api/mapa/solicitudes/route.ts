import { NextRequest } from 'next/server';
import { createServerRoleClient } from '@/lib/supabase/serverrole';

export async function GET(req: NextRequest) {
	const url = new URL(req.url);
	const searchParams: any = url.searchParams;

	const help_type = searchParams.get('type') || null;
	const urgency = searchParams.get('urgency') || null;

	const supabase = await createServerRoleClient();
	// const { data: dataUser, error: errorUser } = await supabase.auth.getUser();
	// if (errorUser || !dataUser?.user) {
	//   return Response.json({ message: 'Not logged.', errorUser });
	// }

	const query = supabase
		.from('help_requests')
		.select('id, user_id, latitude, created_at, longitude, resources, help_type, urgency, name,location, description, people_needed, additional_info->special_situations, status,other_help')
		.eq('type', 'necesita');

	if (help_type !== null) {
		query.contains('help_type', [help_type]);
	}
	if (urgency !== null) {
		query.eq('urgency', urgency);
	}

	query.neq('status', 'finished');

	const { data, error } = await query.order('created_at', { ascending: false });

	if (error) {
		return Response.json({ error });
	} else {
		return Response.json({ data });
	}
	return Response.json({ message: 'Error' });
}