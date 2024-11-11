import { HelpRequestAssignmentData, HelpRequestComment, HelpRequestData } from '@/types/Requests';
import { useQuery } from '@tanstack/react-query';
import { helpRequestService } from '@/lib/service';
import { useSession } from '@/context/SessionProvider';
import SolicitudComment from '@/components/Comments/SolicitudComment';
import CommentForm from '@/components/Comments/CommentForm';
import { useRole } from '@/context/RoleProvider';

type SolicitudCommentsProps = {
  request: HelpRequestData;
};

export default function SolicitudComments({ request }: SolicitudCommentsProps) {
  const {
    data: comments,
    isLoading,
    error,
  } = useQuery<HelpRequestComment[]>({
    queryKey: ['comments', { request_id: request.id }],
    queryFn: () => helpRequestService.getComments(request.id),
  });

  const { user } = useSession();
  const role = useRole();
  const isAdmin = role === 'admin';

  const {
    data: assignments,
    isLoading: isLoadingAssignments,
    error: errorAssignments,
  } = useQuery<HelpRequestAssignmentData[]>({
    queryKey: ['help_request_assignments', { id: request.id }],
    queryFn: () => helpRequestService.getAssignments(request.id),
  });

  if (!user) return null;

  if (isLoading || isLoadingAssignments)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error || comments === undefined || errorAssignments || assignments === undefined) {
    return (
      <div className="space-y-6 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700">Error al cargar los comentarios</p>
        </div>
      </div>
    );
  }

  const userAssignment = assignments.find((x) => x.user_id === user?.id);
  const userIsAssigned = !!userAssignment;
  const userIsOwner = user.id === request.user_id;

  if (!userIsAssigned && !isAdmin && !userIsOwner) return null;

  return (
    <div className="space-y-4 pl-12 xl:pl-24">
      {comments.map((comment) => (
        <SolicitudComment comment={comment} key={comment.id} />
      ))}
      <CommentForm helpRequestId={request.id} />
    </div>
  );
}
