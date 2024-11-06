import { createClient } from '@/lib/supabase/server';
import RequestHelp from '@/components/RequestHelp';
import Unauthorized from '../../../../components/Unauthorized';

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
    .eq('type', 'necesita')
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
