import { HelpRequestAssignmentData } from '@/types/Requests';
import { useQuery } from '@tanstack/react-query';
import { helpRequestService } from '@/lib/service';
import { Spinner } from '@/components/Spinner';

type SolicitudHelpCountProps = {
  id: number;
  people: any;
};

export default function SolicitudHelpCount({ id, people }: SolicitudHelpCountProps) {
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

  const volunteerPercentage = (volunteers / people) * 100;

  let colorClass: string;

  if (volunteerPercentage < 33) {
    colorClass = 'bg-red-100 text-red-800';
  } else if (volunteerPercentage >= 33 && volunteerPercentage < 66) {
    colorClass = 'bg-yellow-100 text-yellow-800';
  } else {
    colorClass = 'bg-green-100 text-green-800';
  }
  return (
    <div className={`flex items-center justify-center rounded-full px-4 py-2 ${colorClass}`}>
      <span className={`text-sm font-bold`}>{volunteers} VOLUNTARIOS</span>
    </div>
  );
}
