import Unauthorized from '@/components/Unauthorized';
import { createClient } from '@/lib/supabase/server';
import { getOneWithCoords } from '@/lib/actions';
import EditHelpOffer from '@/components/HelpOffers/EditHelpOffer';

export default async function EditarSolicitud({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: session } = await supabase.auth.getUser();
  if (session.user === null) {
    return <Unauthorized />;
  }
  const numberId = Number(id);
  const request = await getOneWithCoords(numberId);
  return <EditHelpOffer request={request} />;
}
