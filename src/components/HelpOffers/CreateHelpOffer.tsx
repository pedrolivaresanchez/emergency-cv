'use client';

import HelpOfferForm, { HelpOfferFormData } from './HelpOfferForm';
import { helpRequestService } from '@/lib/service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { HelpRequestInsert } from '@/types/Requests';
import { useSession } from '@/context/SessionProvider';

function formToDatabaseMap(userId: string | null, formData: HelpOfferFormData): HelpRequestInsert {
  return {
    description: formData.comentarios,
    resources: {
      radius: formData.radio,
      vehicle: formData.vehiculo,
      availability: formData.disponibilidad,
    },
    town_id: formData.pueblo,
    user_id: userId,
    type: 'ofrece',
    other_help: formData.otraAyuda,
    help_type: formData.tiposAyuda,
    status: formData.status,
    location: formData.ubicacion,
    name: formData.nombre,
    contact_info: formData.telefono,
    additional_info: {
      email: formData.email,
      experience: formData.experiencia,
    },
  };
}

export default function CreateHelpOffer() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const session = useSession();

  const mutation = useMutation({
    mutationFn: (data: HelpOfferFormData) =>
      helpRequestService.createRequest(formToDatabaseMap(session.user?.id ?? null, data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['help_requests'] });
      router.push('/casos-activos/ofertas');
    },
    onError: (e) => {
      console.error('Error al crear la oferta de ayuda', e);
      toast.error('Error al crear la oferta :(');
    },
  });

  return <HelpOfferForm submitMutation={mutation.mutateAsync} buttonText={['Ofrecer ayuda', 'Enviando...']} />;
}
