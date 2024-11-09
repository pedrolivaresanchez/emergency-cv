
import { createServerRoleClient } from '@/lib/supabase/serverrole';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
	const supabase = await createServerRoleClient();
	const { data: dataUser, error: errorUser } = await supabase.auth.getUser();
	if (errorUser || !dataUser?.user) {
		return Response.json({ message: 'Not logged.', errorUser });
	}

	const { data, count, error } = await supabase
		.from('help_requests')
		.select('',
			{ count: 'exact' },
		)
		.eq('type', 'necesita')
		.eq('user_id', dataUser?.user.id)
		.select();

	if (error) {
		return Response.json({ error });
	}
	return Response.json({ count });
}
