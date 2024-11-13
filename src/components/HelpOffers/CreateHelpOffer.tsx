'use client';

import HelpOfferForm, { HelpOfferFormData } from './HelpOfferForm';
import { helpRequestService } from '@/lib/actions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { HelpRequestInsert } from '@/types/Requests';
import { useSession } from '@/context/SessionProvider';
import { User } from '@supabase/auth-js';
import { HeartHandshake } from 'lucide-react';

function formToDatabaseMap(user: User, formData: HelpOfferFormData): HelpRequestInsert {
  return {
    description: formData.comentarios,
    resources: {
      radius: formData.radio,
      vehicle: formData.vehiculo,
      availability: formData.disponibilidad,
    },
    town_id: formData.pueblo,
    user_id: user.id,
    type: 'ofrece',
    other_help: formData.otraAyuda,
    help_type: formData.tiposAyuda,
    status: formData.status,
    location: formData.ubicacion,
    name: formData.nombre,
    contact_info: formData.telefono,
    additional_info: {
      email: user.email || user.user_metadata?.email,
      experience: formData.experiencia,
    },
  };
}

export default function CreateHelpOffer() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user } = useSession();

  const mutation = useMutation({
    mutationFn: (data: HelpOfferFormData) => {
      if (!user) throw 'Sesión no iniciada';
      return helpRequestService.createRequest(formToDatabaseMap(user, data));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['help_requests'] });
      router.push('/casos-activos/ofertas');
    },
    onError: (e) => {
      console.error('Error al crear la oferta de ayuda', e);
      toast.error('Error al crear la oferta :(');
    },
  });

  return (
    <div className="space-y-6 bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-2xl font-bold mb-6">Ofrecer ayuda</h1>
      <div className="bg-green-50 border-green-500 p-4 rounded">
        <div className="flex items-start">
          <HeartHandshake className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
          <div>
            <h2 className="text-green-800 font-semibold">Me apunto como voluntario</h2>
            <p className="text-green-700 text-sm mt-1">
              Al registrarte como voluntario, te comprometes a seguir las indicaciones de las autoridades y los
              protocolos establecidos.
            </p>
          </div>
        </div>
      </div>
      <HelpOfferForm submitMutation={mutation.mutateAsync} buttonText={['Ofrecer ayuda', 'Enviando...']} />
    </div>
  );
}
