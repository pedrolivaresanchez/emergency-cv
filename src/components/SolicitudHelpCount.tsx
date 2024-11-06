import { HelpRequestAssignmentData } from '@/types/Requests';
import { useQuery } from '@tanstack/react-query';
import { helpRequestService } from '@/lib/service';
import { Spinner } from '@/components/Spinner';

type SolicitudHelpCountProps = {
  id: number;
};

export default function SolicitudHelpCount({ id }: SolicitudHelpCountProps) {
  const {
    data: assignments,
    isLoading,
    error,
  } = useQuery<HelpRequestAssignmentData[]>({
    queryKey: ['help_request_assignments', { id: id }],
    queryFn: () => helpRequestService.getAssignments(id),
  });

  if (isLoading) return <Spinner />;

  if (error || assignments === undefined) return <></>;

  const volunteers = assignments.length;

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap mr-2 ${volunteers === 0 ? 'bg-red-300' : 'bg-green-300'}`}
    >
      Voluntarios: {volunteers}
    </span>
  );
}
