'use client';

import HelpRequestForm, { HelpRequestFormData } from './HelpRequestForm';
import { helpRequestService } from '@/lib/service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { HelpRequestInsert } from '@/types/Requests';
import { useSession } from '@/context/SessionProvider';

function formToDatabaseMap(userId: string | null, formData: HelpRequestFormData): HelpRequestInsert {
  return {
    description: formData.descripcion,
    resources: null,
    urgency: formData.urgencia,
    number_of_people: formData.numeroPersonas,
    town_id: formData.pueblo,
    user_id: userId,
    type: 'necesita',
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

export default function CreateHelpRequest() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const session = useSession();

  const mutation = useMutation({
    mutationFn: (data: HelpRequestFormData) =>
      helpRequestService.createRequest(formToDatabaseMap(session.user?.id ?? null, data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['help_requests'] });
      router.push('/casos-activos/solicitudes');
    },
    onError: (e) => {
      console.error('Error al crear la solicitud de ayuda', e);
      toast.error('Error al crear la solicitud :(');
    },
  });

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Solicitar ayuda</h1>
      <HelpRequestForm
        submitMutation={mutation.mutateAsync}
        isSubmitting={mutation.isPending}
        buttonText={['Enviar solicitud', 'Enviando solicitud...']}
      />
    </>
  );
}
