'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import SolicitudCard from '@/components/SolicitudCard';
import { useRouter, useSearchParams } from 'next/navigation';
import { tiposAyudaOptions } from '@/helpers/constants';
import Map from '@/components/map/map';
import ReactDOMServer from 'react-dom/server';

const PAIPORTA_LAT_LNG = [-0.41667, 39.42333];
const DEFAULT_ZOOM = 12;

export default function Mapa({ towns }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [data, setData] = useState([]);

  const updateFilter = (filter, value) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(filter, value);
    router.push(`?${params.toString()}`);
  };

  const [filtroData, setFiltroData] = useState({
    urgencia: searchParams.get('urgencia') || 'todas',
    tipoAyuda: searchParams.get('tipoAyuda') || 'todas',
    pueblo: searchParams.get('pueblo') || 'todos',
  });

  const changeDataFilter = (type, newFilter) => {
    setFiltroData((prev) => ({
      ...prev,
      [type]: newFilter,
    }));
    updateFilter(type, newFilter);
  };

  useEffect(() => {
    function transformHelpRequestToMarker(request) {
      return {
        urgency: request.urgency,
        coordinates: [request.longitude ?? 0, request.latitude ?? 0],
        width: '600px',
        descriptionHTML: ReactDOMServer.renderToString(<SolicitudCard isHref={true} towns={towns} caso={request} />),
      };
    }
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Comenzamos la consulta
        const query = supabase.from('help_requests').select('*').eq('type', 'necesita');

        if (filtroData.tipoAyuda !== 'todas') {
          query.contains('help_type', [filtroData.tipoAyuda]);
        }

        if (filtroData.urgencia !== 'todas') {
          query.eq('urgency', filtroData.urgencia);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) {
          console.log('Error fetching solicitudes:', error);
          setData([]);
        } else {
          const markers = data.map(transformHelpRequestToMarker);
          setData(markers || []);
        }
      } catch (err) {
        console.log('Error general:', err);
        setError('Error de conexión.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [filtroData, towns]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <>
      {/* FILTROS  */}
      <div className="flex flex-col sm:flex-row gap-2 items-center justify-between">
        <p className="font-bold text-md">Filtros</p>
        <div className="flex flex-col sm:flex-row gap-2 w-full justify-end">
          <select
            value={filtroData.tipoAyuda}
            onChange={(e) => changeDataFilter('tipoAyuda', e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 shadow-sm"
          >
            <option value="todas">Todas las necesidades</option>
            {Object.entries(tiposAyudaOptions).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
          <select
            value={filtroData.urgencia}
            onChange={(e) => changeDataFilter('urgencia', e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 shadow-sm"
          >
            <option value="todas">Todas las prioridades</option>
            <option value="alta">Alta prioridad</option>
            <option value="media">Media prioridad</option>
            <option value="baja">Baja prioridad</option>
          </select>
        </div>
      </div>
      <div className="grid gap-4">
        <Map markers={data} center={PAIPORTA_LAT_LNG} zoom={DEFAULT_ZOOM} />
      </div>
    </>
  );
}
