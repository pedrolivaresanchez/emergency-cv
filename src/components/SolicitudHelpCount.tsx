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

  let colorClass: string;

  if (volunteers === 0) {
    colorClass = 'bg-red-100 text-red-800';
  } else {
    colorClass = 'bg-green-100 text-green-800';
  }
  return (
    <div className={`flex items-center justify-center rounded-full px-4 py-2 ${colorClass}`}>
      <span className={`text-sm font-bold`}>{volunteers} VOLUNTARIOS</span>
    </div>
  );
}
