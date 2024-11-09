'use client';

import { Suspense, useEffect, useState, useCallback, ChangeEventHandler } from 'react';
import { supabase } from '@/lib/supabase/client';
import SolicitudCard from '@/components/SolicitudCard';
import Pagination from '@/components/Pagination';
import { useRouter, useSearchParams } from 'next/navigation';
import { tiposAyudaOptions } from '@/helpers/constants';
import { useTowns } from '@/context/TownProvider';
import { HelpRequestData } from '@/types/Requests';
import { Toggle } from '@/components/Toggle';

export const dynamic = 'force-dynamic';

export default function SolicitudesPage() {
  return (
    <Suspense>
      <Solicitudes />
    </Suspense>
  );
}

const itemsPerPage = 10;
const numPages = (count: number) => {
  return Math.ceil(count / itemsPerPage) || 0;
};
const isStringTrue = (str: string): boolean => str === 'true';

function Solicitudes() {
  const { towns } = useTowns();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [data, setData] = useState<HelpRequestData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(Number(searchParams.get('page')) || 1);
  const [currentCount, setCurrentCount] = useState<number>(0);
  const [filtroData, setFiltroData] = useState({
    urgencia: searchParams.get('urgencia') || 'todas',
    tipoAyuda: searchParams.get('tipoAyuda') || 'todas',
    pueblo: searchParams.get('pueblo') || 'todos',
    soloSinAsignar: searchParams.get('soloSinAsignar') || 'true',
  });

  const updateFilter = useCallback(
    (filter: 'urgencia' | 'tipoAyuda' | 'pueblo' | 'page' | 'soloSinAsignar', value: string | number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(filter, value.toString());
      router.push(`?${params.toString()}`);
    },
    [searchParams, router],
  );

  const changeDataFilter = useCallback(
    (type: 'urgencia' | 'tipoAyuda' | 'pueblo' | 'soloSinAsignar', newFilter: string) => {
      setFiltroData((prev) => ({
        ...prev,
        [type]: newFilter,
      }));
      updateFilter(type, newFilter);
    },
    [updateFilter],
  );

  const changePage = useCallback(
    (newPage: number) => {
      setCurrentPage(newPage);
      updateFilter('page', newPage);
    },
    [updateFilter],
  );

  const handleToggleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => changeDataFilter('soloSinAsignar', `${e.target.checked}`),
    [changeDataFilter],
  );

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Comenzamos la consulta
        const query = supabase.from('help_requests').select('*', { count: 'exact' }).eq('type', 'necesita');

        // Solo agregar filtro si no es "todos"
        if (filtroData.tipoAyuda !== 'todas') {
          query.contains('help_type', [filtroData.tipoAyuda]);
        }

        // Solo agregar filtro si no es "todos"
        if (filtroData.pueblo !== 'todos') {
          query.eq('town_id', filtroData.pueblo);
        }

        // Solo agregar filtro si no es "todas"
        if (filtroData.urgencia !== 'todas') {
          query.eq('urgency', filtroData.urgencia);
        }

        // Solo agregar filtro si es true
        if (isStringTrue(filtroData.soloSinAsignar)) {
          query.eq('asignees_count', 0);
        }

        query.neq('status', 'finished');
        // Ejecutar la consulta con paginación
        const { data, count, error } = await query
          .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1)
          .order('created_at', { ascending: false });

        if (error) {
          console.log('Error fetching solicitudes:', error);
          setData([]);
        } else {
          setData((data as HelpRequestData[]) || []);
          setCurrentCount(count ?? 0);
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
        <div className="flex flex-col space-y-3 w-full">
          <div className="flex flex-col sm:flex-row gap-2 w-full justify-end">
            <div className="flex flex-col justify-center">
              <p className="font-bold text-md">Filtros</p>
            </div>
            <select
              value={filtroData.tipoAyuda}
              onChange={(e) => changeDataFilter('tipoAyuda', e.target.value)}
              className="px-4 py-2 rounded-lg w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 shadow-sm"
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
              className="px-4 py-2 rounded-lg w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 shadow-sm"
            >
              <option value="todas">Todas las prioridades</option>
              <option value="alta">Alta prioridad</option>
              <option value="media">Media prioridad</option>
              <option value="baja">Baja prioridad</option>
            </select>
            <select
              value={filtroData.pueblo}
              onChange={(e) => changeDataFilter('pueblo', e.target.value)}
              className="px-4 py-2 rounded-lg w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 shadow-sm"
            >
              <option value="todos">Todos los pueblos</option>
              {towns.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-row flex-1 justify-end">
            <Toggle
              handleChange={handleToggleChange}
              checked={isStringTrue(filtroData.soloSinAsignar)}
              label="Sólo ofertas sin voluntarios"
            />
          </div>
        </div>
      </div>
      <div className="grid gap-4">
        {data.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg border border-gray-300 text-center flex justify-center items-center p-10 flex-col gap-5">
            <p className="text-gray-700 text-lg font-medium">
              No se encontraron solicitudes que coincidan con los filtros.
            </p>
          </div>
        ) : (
          data.map((caso) => <SolicitudCard format="small" showLink={true} showEdit={true} key={caso.id} caso={caso} />)
        )}
      </div>
      <div className="flex items-center justify-center">
        <Pagination currentPage={currentPage} totalPages={numPages(currentCount)} onPageChange={changePage} />
      </div>
    </>
  );
}
