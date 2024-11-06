import { createClient } from '@/lib/supabase/server';
import OfferHelp from '../../../../components/OfferHelp';

const getRequest = async (id) => {
  const supabase = await createClient();
  const { data, error } = await supabase.from('help_requests').select('*').eq('id', id).single();
  if (error) {
    throw new Error(error);
  }
  return data;
};

export default async function EditarSolicitud({ params }) {
  const { id } = await params;
  const request = await getRequest(id);
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
