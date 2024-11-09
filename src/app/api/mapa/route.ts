import { NextRequest } from 'next/server';
import { createServerRoleClient } from '@/lib/supabase/serverrole';

export async function GET(req: NextRequest) {
	return Response.json({ message: '' });
}