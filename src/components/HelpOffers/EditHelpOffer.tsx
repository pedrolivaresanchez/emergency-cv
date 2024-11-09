'use client';

import HelpOfferForm, { HelpOfferFormData } from './HelpOfferForm';
import { helpRequestService } from '@/lib/service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { HelpRequestData, HelpRequestUpdate } from '@/types/Requests';

type EditHelpOfferProps = {
  request: HelpRequestData;
};

function formToDatabaseMap(request: HelpRequestData, formData: HelpOfferFormData): HelpRequestUpdate {
  return {
    description: formData.comentarios,
    resources: {
      radius: formData.radio,
      vehicle: formData.vehiculo,
      availability: formData.disponibilidad,
    },
    town_id: formData.pueblo,
    id: request.id,
    user_id: request.user_id,
    type: request.type,
    other_help: formData.otraAyuda,
    help_type: formData.tiposAyuda,
    status: formData.status,
    location: formData.ubicacion,
    created_at: request.created_at,
    name: formData.nombre,
    contact_info: formData.telefono,
    additional_info: {
      email: request.additional_info.email,
      experience: formData.experiencia,
    },
  };
}

export default function EditHelpOffer({ request }: EditHelpOfferProps) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (data: HelpOfferFormData) =>
      helpRequestService.editRequest(formToDatabaseMap(request, data), request.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['help_requests'] });
      router.push(`/ofertas/${request.id}`);
    },
    onError: (e) => {
      console.error('Error al editar la oferta de ayuda', e);
      toast.error('Error al editar la oferta :(');
    },
  });
  return (
    <div className="space-y-6 bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-2xl font-bold mb-6">Editar oferta de ayuda</h1>
      <HelpOfferForm
        data={request}
        submitMutation={mutation.mutateAsync}
        buttonText={['Guardar cambios', 'Guardando...']}
      />
    </div>
  );
}
