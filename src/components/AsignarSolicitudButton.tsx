'use client';

import { useSession } from '@/context/SessionProvider';
import { HelpRequestAssignmentData, HelpRequestData } from '@/types/Requests';
import { helpRequestService } from '@/lib/service';
import { MouseEvent, useCallback, useEffect, useState } from 'react';
import { Spinner } from '@/components/Spinner';
import Link from 'next/link';

type AsignarSolicitudButtonProps = {
  helpRequest: HelpRequestData;
};

export default function AsignarSolicitudButton({ helpRequest }: AsignarSolicitudButtonProps) {
  const session = useSession();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [assignments, setAssignments] = useState<HelpRequestAssignmentData[]>([]);

  const userAssignment = assignments.find((x) => x.user_id === session?.user.id);
  const userIsAssigned = !!userAssignment;

  const fetchAssignments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await helpRequestService.getAssignments(helpRequest.id);
      setAssignments(data);
    } finally {
      setLoading(false);
    }
  }, [helpRequest.id, setAssignments]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  async function handleSubmit(e: MouseEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!session) return;

    try {
      await helpRequestService.assign({
        help_request_id: helpRequest.id,
        user_id: session.user.id,
        phone_number: session.user.user_metadata.telefono!,
      });
    } catch (error: any) {
      console.error('Error al asignarte', error);
      setError(error.message || 'Error al asignarte a esta solicitud de ayuda');
    } finally {
      setLoading(false);
      fetchAssignments();
    }
  }
  async function handleCancel(e: MouseEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!session) return;
    if (!userAssignment) return;

    try {
      await helpRequestService.unassign(userAssignment.id);
    } catch (error: any) {
      console.error('Error al asignarte', error);
      setError(error.message || 'Error al asignarte a esta solicitud de ayuda');
    } finally {
      setLoading(false);
      fetchAssignments();
    }
  }

  if (loading) return <Spinner />;

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
          Cancelar ayuda :(
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
