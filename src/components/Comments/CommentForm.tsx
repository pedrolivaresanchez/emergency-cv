import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { helpRequestService } from '@/lib/actions';
import { toast } from 'sonner';
import { useSession } from '@/context/SessionProvider';

interface CommentFormProps {
  helpRequestId: number;
}

export default function CommentForm({ helpRequestId }: CommentFormProps) {
  const queryClient = useQueryClient();
  const [comment, setComment] = useState('');
  const [isSolved, setIsSolved] = useState(false);
  const { user } = useSession();

  const addCommentMutation = useMutation({
    mutationFn: async () => helpRequestService.addComment(helpRequestId, comment, isSolved),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', { request_id: helpRequestId }] });
      setComment('');
      setIsSolved(false);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Error al añadir el comentario');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCommentMutation.mutate();
  };

  if (!user) return null;

  return (
    <div className="rounded-2xl bg-white shadow-lg p-4 ring-1 ring-gray-900/5">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="comment" className="block font-medium text-gray-700">
            Añadir comentario
          </label>
          <textarea
            id="comment"
            name="comment"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mt-1 p-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Escribe tu comentario aquí..."
            required
          />
        </div>

        <div className="flex items-center">
          <input
            id="isSolved"
            type="checkbox"
            checked={isSolved}
            onChange={(e) => setIsSolved(e.target.checked)}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
          />
          <label htmlFor="isSolved" className="ml-2 text-sm text-gray-700">
            Marcar como caso solucionado
          </label>
          <div className={'flex-1'} />
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 shadow-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={addCommentMutation.isPending}
          >
            {addCommentMutation.isPending ? 'Enviando...' : 'Enviar'}
          </button>
        </div>
      </form>
    </div>
  );
}
