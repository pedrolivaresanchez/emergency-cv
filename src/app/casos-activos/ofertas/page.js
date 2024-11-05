'use client';

import { useState, useEffect } from 'react';
import { MapPin, Phone, Calendar, User, HeartHandshake, Users, Truck, Search, Package, MapPinIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Pagination from '@/components/Pagination';
import { tiposAyudaOptions } from '@/helpers/constants';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Ofertas({ towns }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentCount, setCurrentCount] = useState(0);

  const itemsPerPage = 10;
  const numPages = (count) => {
    return Math.ceil(count / itemsPerPage) || 0;
  };

  const updateFilter = (filter, value) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(filter, value);
    router.push(`?${params.toString()}`);
  };

  const [filtroData, setFiltroData] = useState({
    ayuda: searchParams.get('acepta') || 'todas',
  });

  const changeDataFilter = (type, newFilter) => {
    setFiltroData((prev) => ({
      ...prev,
      [type]: newFilter,
    }));
    updateFilter(type, newFilter);
  };

  function changePage(newPage) {
    setCurrentPage(newPage);
    updateFilter('page', newPage);
  }

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Comenzamos la consulta
        const query = supabase.from('help_requests').select('*', { count: 'exact' }).eq('type', 'ofrece');

        // Solo agregar filtro si no es "todos"
        if (filtroData.ayuda !== 'todas') {
          query.contains('help_type', [filtroData.ayuda]);
        }

        // Ejecutar la consulta con paginación
        const { data, count, error } = await query
          .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1)
          .order('created_at', { ascending: false });

        if (error) {
          console.log('Error fetching solicitudes:', error);
          setData([]);
        } else {
          setData(data || []);
          setCurrentCount(count);
        }
      } catch (err) {
        console.log('Error general:', err);
        setError('Error de conexión.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [filtroData, currentPage]);

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
            value={filtroData.ayuda}
            onChange={(e) => changeDataFilter('ayuda', e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 shadow-sm"
          >
            <option value="todas">Todas las ofertas</option>
            {Object.entries(tiposAyudaOptions).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid gap-4">
        {data.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg border border-gray-300 text-center flex justify-center items-center p-10 flex-col gap-5">
            <p className="text-gray-700 text-lg font-medium">
              No se encontraron solicitudes que coincidan con los filtros.
            </p>

            <button
              onClick={() => {
                setShowModal(true);
              }}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2 whitespace-nowrap"
            >
              <HeartHandshake className="w-5 h-5" />
              Ofrecer ayuda a {filtroData.pueblo === 'todos' ? '' : towns[filtroData.pueblo - 1].name}
            </button>
          </div>
        ) : (
          data.map((caso) => (
            <div
              key={caso.id}
              className="bg-white p-4 rounded-lg shadow-lg border-l-4 border-green-500 overflow-hidden"
            >
              <div className="flex justify-between mb-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap mr-2 bg-purple-300`}>
                  Referencia: {caso.id}
                </span>
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap bg-green-100 text-green-800">
                  {caso.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <h3 className="text-lg font-bold text-green-600">
                  <div className="flex items-start gap-2">
                    <HeartHandshake className="h-5 w-5 flex-shrink-0 mt-1" />
                    <div className="break-words">
                      Ofrece:{' '}
                      {Array.isArray(caso.help_type)
                        ? caso.help_type
                            .map((tipo) => {
                              return tiposAyudaOptions[tipo] || tipo;
                            })
                            .join(', ')
                        : 'Ayuda general'}
                    </div>
                  </div>
                </h3>
                {caso.name && (
                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 flex-shrink-0 mt-1" />
                    <span className="break-words">
                      <span className="font-semibold">Nombre:</span> {caso.name}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2 text-sm">
                {caso.contact_info && (
                  <div className="flex items-start gap-2">
                    <Phone className="h-4 w-4 text-gray-500 flex-shrink-0 mt-1" />
                    <span className="break-words">
                      <span className="font-semibold">Teléfono:</span>{' '}
                      {typeof caso.contact_info === 'string' ? caso.contact_info : JSON.parse(caso.contact_info).phone}
                    </span>
                  </div>
                )}

                {caso.resources && (
                  <>
                    {(() => {
                      let resources;
                      try {
                        resources = typeof caso.resources === 'string' ? JSON.parse(caso.resources) : caso.resources;

                        return resources.vehicle ? (
                          <div className="flex items-start gap-2">
                            <Truck className="h-4 w-4 text-gray-500 flex-shrink-0 mt-1" />
                            <span className="break-words">
                              <span className="font-semibold">Vehículo:</span> {resources.vehicle}
                            </span>
                          </div>
                        ) : null;
                      } catch (e) {
                        return null;
                      }
                    })()}
                  </>
                )}

                {caso.location && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0 mt-1" />
                    <span className="break-words">
                      <span className="font-semibold">Ubicación:</span> {caso.location}
                    </span>
                  </div>
                )}

                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0 mt-1" />
                  <span className="break-words">
                    <span className="font-semibold">Fecha:</span>{' '}
                    {new Date(caso.created_at).toLocaleDateString() +
                      ' ' +
                      new Date(caso.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {caso.description && (
                <div className="mt-4 bg-gray-50 p-3 rounded">
                  <span className="font-semibold block mb-1">Comentarios:</span>
                  <p className="text-gray-700 break-words">{caso.description}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <div className="flex items-center justify-center">
        <Pagination currentPage={currentPage} totalPages={numPages(currentCount)} onPageChange={changePage} />
      </div>
    </>
  );
}
