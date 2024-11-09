import { NextRequest, NextResponse } from 'next/server';
import { createServerRoleClient } from '@/lib/supabase/serverrole';

export async function GET(req: NextRequest) {
	try {
		// Acceder a los parámetros de búsqueda
		const url = new URL(req.url);
		const searchParams = url.searchParams;

		const help_type = searchParams.get('type');
		const town_id = searchParams.get('town');
		const urgency = searchParams.get('urgency');
		const currentPage = parseInt(searchParams.get('page') ?? '1');
		const itemsPerPage = 10;

		const supabase = await createServerRoleClient();

		// Primero verificamos que el cliente se creó correctamente
		if (!supabase) {
			console.error('Error creating Supabase client');
			return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
		}

		// Iniciamos la query base
		let query = supabase
			.from('help_requests')
			.select(
				'id, created_at, name, location, description, urgency, number_of_people, contact_info, additional_info->special_situations, status, resources, latitude, longitude, coordinates, help_type, people_needed, other_help, town_id',
				{ count: 'exact' }
			);

		// Agregamos los filtros solo si los valores no son null
		if (help_type) {
			console.log('Filtering by help_type:', help_type);
			query = query.contains('help_type', [help_type]);
		}

		if (town_id) {
			console.log('Filtering by town_id:', town_id);
			query = query.eq('town_id', town_id);
		}

		if (urgency) {
			console.log('Filtering by urgency:', urgency);
			query = query.eq('urgency', urgency);
		}

		// Aplicamos el filtro de status
		query = query.neq('status', 'finished');

		// Calculamos el rango
		const from = (currentPage - 1) * itemsPerPage;
		const to = from + itemsPerPage - 1;

		console.log(`Fetching range: ${from} to ${to}`);

		// Ejecutamos la query
		const { data, count, error } = await query
			.range(from, to)
			.order('created_at', { ascending: false });

		// Manejamos los errores específicamente
		if (error) {
			console.error('Supabase error:', error);
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		// Verificamos si tenemos datos
		if (!data || data.length === 0) {
			console.log('No data found with current filters');
			return NextResponse.json({ data: [], count: 0 });
		}

		return NextResponse.json({
			data,
			count: count ?? 0,
			page: currentPage,
			totalPages: Math.ceil((count ?? 0) / itemsPerPage)
		});

	} catch (error) {
		console.error('Unexpected error:', error);
		return NextResponse.json(
			{ error: 'An unexpected error occurred' },
			{ status: 500 }
		);
	}
}