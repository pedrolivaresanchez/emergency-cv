'use client';

import HelpRequestForm, { HelpRequestFormData } from './HelpRequestForm';
import { helpRequestService } from '@/lib/service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { HelpRequestData, HelpRequestUpdate } from '@/types/Requests';

type EditHelpRequestProps = {
  request: HelpRequestData;
};

function formToDatabaseMap(request: HelpRequestData, formData: HelpRequestFormData): HelpRequestUpdate {
  return {
    description: formData.descripcion,
    resources: null,
    urgency: formData.urgencia,
    number_of_people: formData.numeroPersonas,
    town_id: formData.pueblo,
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
    contact_info: formData.telefono,
    additional_info: {
      email: formData.email,
      consent: formData.consentimiento,
      special_situations: formData.situacionEspecial,
    },
  };
}

export default function EditHelpRequest({ request }: EditHelpRequestProps) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (data: HelpRequestFormData) => helpRequestService.createRequest(formToDatabaseMap(request, data)),
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
    <>
      <h1 className="text-2xl font-bold mb-6">Editar solicitud de ayuda</h1>
      <HelpRequestForm
        submitMutation={mutation.mutateAsync}
        isSubmitting={mutation.isPending}
        buttonText={['Guardar cambios', 'Guardando...']}
      />
    </>
  );
}
