'use client';

import { useSession } from '@/context/SessionProvider';
import { HelpRequestAssignmentData, HelpRequestData, SelectedHelpData } from '@/types/Requests';
import { helpRequestService } from '@/lib/service';
import { MouseEvent } from 'react';
import { Spinner } from '@/components/Spinner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import Modal from '@/components/Modal';
import { useModal } from '@/context/ModalProvider';
import { useRouter } from 'next/navigation';

type AsignarSolicitudButtonProps = {
  helpRequest: SelectedHelpData;
};

export default function AsignarSolicitudButton({ helpRequest }: AsignarSolicitudButtonProps) {
  const { toggleModal } = useModal();
  const session = useSession();
  const userId = session.user?.id;
  const MODAL_NAME = `Solicitud-${helpRequest.id}`;
  const router = useRouter();

  const {
    data: assignments,
    isLoading,
    error,
  } = useQuery<HelpRequestAssignmentData[]>({
    queryKey: ['help_request_assignments', { id: helpRequest.id }],
    queryFn: () => helpRequestService.getAssignments(helpRequest.id),
  });

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
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['help_request_assignments'] });
      await queryClient.invalidateQueries({ queryKey: ['help_requests', { user_id: userId, type: 'necesita' }] });
      await router.push(`/solicitudes/${helpRequest.id}`);
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
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['help_request_assignments'] });
      await queryClient.invalidateQueries({ queryKey: ['help_requests', { user_id: userId, type: 'necesita' }] });
    },
    onError: (e) => {
      console.error('Error al asignarte a la petición de ayuda', e);
      toast.error('Error al asignarte :(');
    },
  });

  async function handleAcceptanceSubmit(e: MouseEvent) {
    e.preventDefault();
    toggleModal(MODAL_NAME, false);
    assignMutation.mutate();
  }
  async function handleSubmit(e: MouseEvent) {
    e.preventDefault();
    toggleModal(MODAL_NAME, true);
  }
  async function handleCancel(e: MouseEvent) {
    e.preventDefault();
    unassignMutation.mutate();
  }

  if (isLoading) return <Spinner />;
  if (error || assignments === undefined) return <></>;

  const userAssignment = assignments.find((x) => x.user_id === session.user?.id);
  const userIsAssigned = !!userAssignment;

  if (!session || !session.user)
    return (
      <button
        onClick={() => router.push(`/auth?redirect=${encodeURIComponent('/solicitudes/' + helpRequest.id)}`)}
        className="w-full text-center rounded-xl px-4 py-2 font-semibold text-white sm:w-auto transition-all bg-green-500 hover:bg-green-600"
      >
        Iniciar sesion para ayudar
      </button>
    );

  // Verifica el email dentro de additional_info utilizando un casting y encadenamiento opcional
  if (helpRequest.user_id === session.user.id) return null;

  return (
    <>
      {userIsAssigned ? (
        <button
          onClick={handleCancel}
          className="w-full text-center rounded-xl px-4 py-2 font-semibold text-white sm:w-auto transition-all bg-red-500 hover:bg-red-600"
        >
          Cancelar mi ayuda
        </button>
      ) : (
        <button
          onClick={handleSubmit}
          className="w-full text-center rounded-xl px-4 py-2 font-semibold text-white sm:w-auto transition-all bg-green-500 hover:bg-green-600"
        >
          Quiero ayudar
        </button>
      )}
      <Modal id={MODAL_NAME} allowClose={false}>
        <div className="bg-yellow-50 p-4 rounded">
          <h2 className="text-yellow-800 font-semibold mb-4">Quiero ayudar</h2>
          <p className="text-yellow-800">¿Te comprometes a atender esta solicitud?</p>
          <div className="mt-4 flex justify-end space-x-4">
            <button
              onClick={() => toggleModal(MODAL_NAME, false)}
              className="flex-1 bg-red-500 text-white py-3 px-4 rounded-lg font-semibold"
            >
              Rechazar
            </button>
            <button
              onClick={handleAcceptanceSubmit}
              className="flex-1 bg-green-500 text-white py-3 px-4 rounded-lg font-semibold"
            >
              Aceptar
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
