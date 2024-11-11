import { CheckCircle, Phone, User } from 'lucide-react';
import { HelpRequestComment } from '@/types/Requests';
import { useSession } from '@/context/SessionProvider';
import Link from 'next/link';
import DeleteCommentButton from './DeleteCommentButton';
import { useRole } from '@/context/RoleProvider';

type SolicitudCommentProps = {
  comment: HelpRequestComment;
};

export default function SolicitudComment({ comment }: SolicitudCommentProps) {
  const { user } = useSession();
  const role = useRole();
  const isAdmin = role === 'admin';
  const isMyComment = comment.user_id === user?.id;
  return (
    <div key={comment.id} className="rounded-2xl bg-white shadow-lg ring-1 ring-gray-900/5 p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-row items-center gap-4">
          <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
            <User className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-lg">{comment.user_name}</span>
            <span className="text-sm text-gray-500">
              {new Date(comment.created_at!).toLocaleDateString()}{' '}
              {new Date(comment.created_at!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
        <div className={'flex-1'} />
        <Link
          href={`tel:${comment.user_phone}`}
          className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-800"
        >
          <Phone className="h-4 w-4" />
          <span className="text-sm font-semibold">{comment.user_phone}</span>
        </Link>

        {comment.is_solved && (
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-800">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-semibold">Caso solucionado</span>
          </div>
        )}
      </div>
      <div className="my-4">
        <p className="text-gray-700" style={{ wordBreak: 'break-word' }}>
          {comment.comment}
        </p>
      </div>
      <div className={'flex justify-end'}>{(isMyComment || isAdmin) && <DeleteCommentButton comment={comment} />}</div>
    </div>
  );
}
