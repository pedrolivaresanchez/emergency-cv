import { NextRequest, NextResponse } from 'next/server';
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
    .select('*')
    .eq('type', 'necesita')
    .or(`contact_info.ilike.%${email}%,additional_info.cs.${JSON.stringify({ email: email })}`);
  return Response.json({ registeredPost });
}

export async function POST(request: NextRequest) {
  try {
    // Obtener los datos del formulario (multipart/form-data)
    const formData = await request.formData();

    // Obtener el ID desde el form-data
    const id = formData.get('id'); // Asumiendo que el campo 'id' se llama 'id'

    // Verificar que el ID esté presente
    if (!id) {
      return NextResponse.json({ error: 'El campo "id" es requerido' }, { status: 400 });
    }

    return NextResponse.json({
      message: 'Datos recibidos correctamente',
      id: id,
    });
  } catch (error) {
    console.error('Error procesando la solicitud:', error);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}
