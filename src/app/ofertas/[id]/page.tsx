'use client';

import { useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import OfferCard from '@/components/OfferCard';
import { useQuery } from '@tanstack/react-query';
import { SelectedHelpData } from '@/types/Requests';
import { getOne } from '../actions';

export default function CasoDetalle() {
  const params = useParams();
  const { id } = params;
  const {
    data: request,
    isLoading,
    error,
  } = useQuery<SelectedHelpData>({
    queryKey: ['help_requests', { id: id }],
    queryFn: () => getOne(Number(id)),
  });
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  if (error || request === undefined) {
    return (
      <div className="space-y-6 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex justify-start">
          <button
            className="flex flex-row items-center px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            onClick={() => history.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </button>
        </div>
        <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700">No se encontró la oferta.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6 mx-auto max-w-7xl px-4 sm:px-6">
      <div className="flex justify-start">
        <button
          className="flex flex-row items-center px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          onClick={() => history.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </button>
      </div>
      <OfferCard caso={request} showLink={false} showEdit={true} />
    </div>
  );
}
