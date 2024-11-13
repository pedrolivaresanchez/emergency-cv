'use client';
import { ArrowLeft } from 'lucide-react';
import SolicitudCard from '@/components/solicitudes/SolicitudCard';
import { useParams } from 'next/navigation';
import SolicitudComments from '@/components/Comments/SolicitudComments';
import { useEffect, useState } from 'react';
import { SelectedHelpData } from '../../../types/Requests';
import { getSolicitud } from './actions';

export default function CasoDetalle() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [data, setData] = useState<SelectedHelpData | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const { data: requestResponse, error } = await getSolicitud(id);
        setData(requestResponse as SelectedHelpData);
        setError(!!error);

        setLoading(false);
      } catch (err) {
        console.error('Error general:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  if (data === null) {
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
          <p className="text-red-700">No se encontró la solicitud.</p>
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
      <SolicitudCard caso={data} showLink={false} showEdit={true} />
      <SolicitudComments request={data} />
    </div>
  );
}
