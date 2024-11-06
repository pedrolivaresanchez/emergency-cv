'use client';

import { useSession } from '@/context/SessionProvider';
import { HelpRequestAssignment, HelpRequestData } from '@/types/Requests';
import { helpRequestService } from '@/lib/service';
import { MouseEvent } from 'react';
import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

type AsignarSolicitudButtonProps = {
  helpRequest: HelpRequestData;
  userAssignment: HelpRequestAssignment;
};

export default function AsignarSolicitudButton({ helpRequest, userAssignment }: AsignarSolicitudButtonProps) {
  const session = useSession();
  const queryClient = useQueryClient();

  const assignMutation = useMutation({
    mutationFn: async () => {
      if (!session.user) return;
      await helpRequestService.assign({
        help_request_id: helpRequest.id,
        user_id: session.user.id,
        phone_number: session.user.user_metadata.telefono!,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['help_request_assignments'] });
    },
    onError: (e) => {
      console.error('Error al asignarte a la petición de ayuda', e);
      toast.error('Error al asignarte :(');
    },
  });

  const unassignMutation = useMutation({
    mutationFn: async () => {
      if (!session.user) return;
      if (!userAssignment) return;
      await helpRequestService.unassign(userAssignment.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['help_request_assignments'] });
    },
    onError: (e) => {
      console.error('Error al asignarte a la petición de ayuda', e);
      toast.error('Error al asignarte :(');
    },
  });

  async function handleSubmit(e: MouseEvent) {
    e.preventDefault();
    assignMutation.mutate();
  }
  async function handleCancel(e: MouseEvent) {
    e.preventDefault();
    unassignMutation.mutate();
  }
  if (userAssignment == undefined) return <></>;
  const userIsAssigned = !!userAssignment;

  if (!session || !session.user)
    return (
      <Link href="/auth" className={`rounded-lg text-white py-2 px-4 w-full sm:w-auto text-center bg-green-500`}>
        Quiero ayudar
      </Link>
    );

  return (
    <>
      {userIsAssigned ? (
        <button
          onClick={handleCancel}
          className={`rounded-lg text-white py-2 px-4 w-full sm:w-auto text-center bg-red-500`}
        >
          Cancelar mi ayuda
        </button>
      ) : (
        <button
          onClick={handleSubmit}
          className={`rounded-lg text-white py-2 px-4 w-full sm:w-auto text-center bg-green-500`}
        >
          Quiero ayudar
        </button>
      )}
    </>
  );
}
