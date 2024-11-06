import { createClient } from '@/lib/supabase/server';
import OfferHelp from '@/components/OfferHelp';
import Unauthorized from '@/components/Unauthorized';

const getRequest = async (id) => {
  const supabase = await createClient();
  const { data: session, sessionError } = await supabase.auth.getUser();
  if (sessionError || !session?.user) {
    return 'unauthorized';
  }
  const { data, error } = await supabase
    .from('help_requests')
    .select('*')
    .eq('id', id)
    .eq('type', 'ofrece')
    .contains('additional_info', { email: session.user.email })
    .single();
  if (error) {
    throw new Error(error);
  }
  return data;
};

export default async function EditarSolicitud({ params }) {
  const { id } = await params;
  const request = await getRequest(id);
  if (request === 'unauthorized') {
    return <Unauthorized />;
  }
  return (
    <OfferHelp
      title="Editar solicitud de ayuda"
      submitType="edit"
      data={request}
      id={id}
      button={['Editar oferta', 'Editando oferta...']}
      redirect="/ofertas"
    />
  );
}
