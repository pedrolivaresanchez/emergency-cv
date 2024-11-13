'use client';

import HelpRequestForm, { HelpRequestFormData } from './HelpRequestForm';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { HelpRequestData, HelpRequestUpdate } from '@/types/Requests';
import { formatPhoneNumber } from '@/helpers/utils';
import { editRequest, createIfNotExists } from '@/lib/actions';

type EditHelpRequestProps = {
  request: HelpRequestData;
};

function formToDatabaseMap(request: HelpRequestData, formData: HelpRequestFormData): HelpRequestUpdate {
  return {
    description: formData.descripcion,
    resources: null,
    urgency: formData.urgencia,
    number_of_people: formData.numeroPersonas,
    town_id: formData.town_id,
    id: request.id,
    user_id: request.user_id,
    type: request.type,
    created_at: request.created_at,
    help_type: formData.tiposAyuda,
    latitude: formData.coordinates?.lat,
    longitude: formData.coordinates?.lng,
    status: formData.status,
    location: formData.ubicacion,
    name: formData.nombre,
    contact_info: formatPhoneNumber(formData.telefono),
    additional_info: {
      email: request.additional_info.email,
      consent: request.additional_info.consent,
      special_situations: formData.situacionEspecial,
    },
  };
}

export default function EditHelpRequest({ request }: EditHelpRequestProps) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (data: HelpRequestFormData) => {
      let town_id = data.town_id;
      if (data.pueblo !== '') {
        const { data: townResponse, error: townError } = await createIfNotExists(data.pueblo);
        if (townError) throw townError;
        town_id = townResponse[0].id;
      }
      return editRequest(formToDatabaseMap(request, { ...data, town_id: town_id }), request.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['help_requests'] });
      router.push(`/solicitudes/${request.id}`);
    },
    onError: (e) => {
      console.error('Error al editar la solicitud de ayuda', e);
      toast.error('Error al editar la solicitud :(');
    },
  });

  return (
    <div className="space-y-6 bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-2xl font-bold mb-6">Editar solicitud de ayuda</h1>
      <HelpRequestForm
        request={request}
        submitMutation={mutation.mutateAsync}
        isSubmitting={mutation.isPending}
        buttonText={['Guardar cambios', 'Guardando...']}
      />
    </div>
  );
}
