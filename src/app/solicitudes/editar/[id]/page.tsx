import RequestHelp from '@/components/RequestHelp';
import { helpRequestService } from '@/lib/service';
export default async function EditarSolicitud({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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
