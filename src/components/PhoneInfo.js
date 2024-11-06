import { useQuery } from '@tanstack/react-query';
import { helpRequestService } from '@/lib/service';
import { useSession } from '@/context/SessionProvider';

export default function PhoneInfo({ caseInfo }) {
  const session = useSession();

  const {
    data: assignments,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['help_request_assignments', { id: caseInfo.id }],
    queryFn: () => helpRequestService.getAssignments(caseInfo.id),
  });

  if (error || isLoading) return <></>;

  const userAssignment = assignments?.find((x) => x.user_id === session.user?.id);

  return (
    <span className="break-words">
      <span className="font-semibold">Contacto:</span>{' '}
      {!!userAssignment ? caseInfo.contact_info : 'Ayuda a esta persona para ver sus datos de contacto'}
    </span>
  );
}
