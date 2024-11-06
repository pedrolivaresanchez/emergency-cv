'use client';

import { useState, useEffect } from 'react';
import { HeartHandshake } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import Pagination from '@/components/Pagination';
import { useRouter, useSearchParams } from 'next/navigation';
import { tiposAyudaOptions } from '@/helpers/constants';
import { useTowns } from '../../context/TownProvider';
import { useSession } from '../../context/SessionProvider';
import OfferCard from '../../components/OfferCard';
import Link from 'next/link';

export default function ListaSolicitudes() {
  const session = useSession();

  const searchParams = useSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const [currentCount, setCurrentCount] = useState(0);
  const towns = useTowns();

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
        const query = supabase
          .from('help_requests')
          .select('*', { count: 'exact' })
          .eq('type', 'ofrece')
          .contains('additional_info', { email: session.user.email });
        // Solo agregar filtro si no es "todos"
        if (filtroData.pueblo !== 'todos') {
          query.eq('town_id', filtroData.pueblo);
        }

        // Solo agregar filtro si no es "todas"
        if (filtroData.urgencia !== 'todas') {
          query.eq('urgency', filtroData.urgencia);
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
      <div className="space-y-6 mx-auto max-w-7xl px-4 sm:px-6 mt-10">
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
            <select
              value={filtroData.pueblo}
              onChange={(e) => changeDataFilter('pueblo', e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 shadow-sm"
            >
              <option value="todos">Todos los pueblos</option>
              {towns.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid gap-4">
          {data.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg border border-gray-300 text-center flex justify-center items-center p-10 flex-col gap-5">
              <p className="text-gray-700 text-lg font-medium">
                {filtroData.urgencia === 'todas' && filtroData.tipoAyuda === 'todas' && filtroData.pueblo === 'todos'
                  ? 'No se encontraron solicitudes de ayuda correspondientes a tu cuenta.'
                  : 'No se encontraron solicitudes que coincidan con los filtros.'}
              </p>
              <Link
                href="/ofrecer-ayuda"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2 whitespace-nowrap"
              >
                <HeartHandshake className="w-5 h-5" />
                Ofrecer ayuda
              </Link>
            </div>
          ) : (
            data.map((caso) => (
              <OfferCard
                isHref={true}
                key={caso.id}
                caso={caso}
                button={{ text: 'Editar', link: '/ofertas/editar/' }}
                isEdit={true}
              />
            ))
          )}
        </div>
        <div className="flex items-center justify-center">
          <Pagination currentPage={currentPage} totalPages={numPages(currentCount)} onPageChange={changePage} />
        </div>
      </div>
    </>
  );
}
