import OfferHelp from '@/components/OfferHelp';
import Unauthorized from '@/components/Unauthorized';
import { createClient } from '@/lib/supabase/server';
import { helpRequestService } from '@/lib/service';

export default async function EditarSolicitud({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: session } = await supabase.auth.getUser();
  if (session.user === null) {
    return <Unauthorized />;
  }
  const numberId = Number(id);
  const request = await helpRequestService.getOne(numberId);
  return (
    <OfferHelp
      title="Editar solicitud de ayuda"
      submitType="edit"
      data={request}
      id={numberId}
      button={['Editar oferta', 'Editando oferta...']}
      redirect="/ofertas"
    />
  );
}
