'use client';

import HelpRequestForm, { HelpRequestFormData } from './HelpRequestForm';
import { createIfNotExists, createRequest } from '@/lib/actions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { HelpRequestInsert } from '@/types/Requests';
import { useSession } from '@/context/SessionProvider';
import { User } from '@supabase/auth-js';

function formToDatabaseMap(user: User, formData: HelpRequestFormData): HelpRequestInsert {
  return {
    description: formData.descripcion,
    resources: null,
    urgency: formData.urgencia,
    number_of_people: formData.numeroPersonas,
    town_id: formData.town_id,
    user_id: user.id,
    type: 'necesita',
    help_type: formData.tiposAyuda,
    latitude: formData.coordinates?.lat,
    longitude: formData.coordinates?.lng,
    status: formData.status,
    location: formData.ubicacion,
    name: formData.nombre,
    contact_info: formData.telefono,
    additional_info: {
      email: user.email || user.user_metadata?.email,
      consent: formData.consentimiento,
      special_situations: formData.situacionEspecial,
    },
  };
}

export default function CreateHelpRequest() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user } = useSession();

  const mutation = useMutation({
    mutationFn: async (data: HelpRequestFormData) => {
      if (!user) throw 'Sesión no iniciada';
      let town_id = data.town_id;
      if (data.pueblo !== '') {
        const { data: townResponse, error: townError } = await createIfNotExists(data.pueblo);
        if (townError) throw townError;
        town_id = townResponse[0].id;
      }

      return createRequest(formToDatabaseMap(user, { ...data, town_id: town_id }));
    },
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
    <div className="space-y-6 bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-2xl font-bold mb-6">Solicitar ayuda</h1>
      <HelpRequestForm
        submitMutation={mutation.mutateAsync}
        isSubmitting={mutation.isPending}
        buttonText={['Enviar solicitud', 'Enviando solicitud...']}
      />
    </div>
  );
}
