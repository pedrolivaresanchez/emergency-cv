import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeComment } from '@/lib/actions';
import { toast } from 'sonner';
import { useSession } from '@/context/SessionProvider';
import { HelpRequestComment } from '@/types/Requests';

interface DeleteCommentFormProps {
  comment: HelpRequestComment;
}

export default function CommentForm({ comment }: DeleteCommentFormProps) {
  const queryClient = useQueryClient();
  const { user } = useSession();

  const removeCommentMutation = useMutation({
    mutationFn: async () => removeComment(comment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', { request_id: comment.help_request_id }] });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Error al eliminar el comentario');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    removeCommentMutation.mutate();
  };

  if (!user) return null;

  return (
    <button
      onClick={handleSubmit}
      className="w-full text-center rounded-xl px-4 py-2 font-semibold text-white sm:w-auto transition-all bg-red-500 hover:bg-red-600"
    >
      {removeCommentMutation.isPending ? 'Eliminando...' : 'Eliminar'}
    </button>
  );
}
