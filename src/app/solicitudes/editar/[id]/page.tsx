import RequestHelp from '@/components/RequestHelp';
import Unauthorized from '@/components/Unauthorized';
import { helpRequestService } from '@/lib/service';
import { createClient } from '@/lib/supabase/server';

export default async function EditarSolicitud({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: session } = await supabase.auth.getUser();
  if (session.user === null) {
    return <Unauthorized />;
  }
  const request = await helpRequestService.getOne(Number(id));

  return (
    <RequestHelp
      title="Editar solicitud de ayuda"
      submitType="edit"
      data={request}
      id={id}
      button={['Editar solicitud', 'Editando solicitud...']}
      redirect="/solicitudes"
    />
  );
}
