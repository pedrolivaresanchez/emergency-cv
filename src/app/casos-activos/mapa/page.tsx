'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { tiposAyudaOptions } from '@/helpers/constants';
import Map, { PinMapa } from '@/components/map/map';
import PickupPoint from '@/components/PickupPoint';
import SolicitudCardMap from '@/components/SolicitudCardMap';

export default function MapaPage() {
  return (
    <Suspense>
      <Mapa />
    </Suspense>
  );
}

function Mapa() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [data, setData] = useState<PinMapa[]>([]);

  const updateFilter = (filter: any, value: any) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(filter, value);
    router.push(`?${params.toString()}`);
  };

  const [filtroData, setFiltroData] = useState({
    urgencia: searchParams.get('urgencia') || 'todas',
    tipoAyuda: searchParams.get('tipoAyuda') || 'todas',
    pueblo: searchParams.get('pueblo') || 'todos',
    acepta: searchParams.get('acepta') || 'todos',
  });

  const changeDataFilter = (type: any, newFilter: any) => {
    setFiltroData((prev) => ({
      ...prev,
      [type]: newFilter,
    }));
    updateFilter(type, newFilter);
  };

  useEffect(() => {
    function transformHelpRequestToMarker(request: any): PinMapa {
      return {
        urgency: request.urgency,
        latitude: request.latitude ?? 0,
        longitude: request.longitude ?? 0,
        id: request.id,
        popup: <SolicitudCardMap caso={request.id} />,
      };
    }

    function transformPickupRequestToMarker(point: any): PinMapa {
      return {
        urgency: point.urgency || 'baja',
        latitude: point.latitude ?? 0,
        longitude: point.longitude ?? 0,
        id: point.id,
        popup: <PickupPoint point={point} />,
      };
    }

    async function fetchData() {
      const url = process.env.NEXT_PUBLIC_BASE_URL + '/api/mapa/?';
      try {
        setLoading(true);
        setError(null);
        const filter = [];

        if (filtroData.tipoAyuda !== 'todas') {
          filter.push('type=' + filtroData.tipoAyuda);
        }
        if (filtroData.pueblo !== 'todos') {
          filter.push('town=' + filtroData.pueblo);
        }
        if (filtroData.urgencia !== 'todas') {
          filter.push('urgency=' + filtroData.urgencia);
        }
        if (filtroData.acepta !== 'todas') {
          filter.push('acepta=' + filtroData.acepta);
        }
        const filterUrl = url + filter.join('&');
        const response = await fetch(filterUrl);
        if (!response.ok) {
          console.log(`Error fetching solicitudes: ${response.status}`);
          setData([]);
        } else {
          const { data, count } = await response.json();
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
  }, [filtroData]);

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
        <Map markers={data} />
      </div>
    </>
  );
}
