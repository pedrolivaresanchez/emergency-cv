'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import { AlertTriangle, ArrowLeft, Calendar, MapPin, MapPinned, Megaphone, Phone, Users } from 'lucide-react';
import SolicitudCard from '@/components/SolicitudCard';

export default function CasoDetalle() {
  const params = useParams();
  const { id } = params;
  const [caso, setCaso] = useState(null);
  const [towns, setTowns] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchCaso() {
      const { data, error } = await supabase.from('help_requests').select('*').eq('id', id).single();
      if (error) {
        console.error('Error fetching caso:', error);
      } else {
        setCaso(data);
      }
      setLoading(false);
    }
    async function fetchTowns() {
      const { data, error } = await supabase.from('towns').select('id, name').order('id', { ascending: true });
      if (error) {
        console.error('Error fetching towns:', error);
        return;
      }
      setTowns(data);
    }
    fetchCaso();
    fetchTowns();
  }, [id]);
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  if (!caso) {
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
      <SolicitudCard towns={towns} key={caso.id} caso={caso} />
    </div>
  );
}
