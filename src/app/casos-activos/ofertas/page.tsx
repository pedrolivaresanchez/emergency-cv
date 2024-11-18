'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import Pagination from '@/components/Pagination';
import { tiposAyudaOptions } from '@/helpers/constants';
import { useRouter, useSearchParams } from 'next/navigation';
import OfferCard from '@/components/OfferCard';
import { useTowns } from '@/context/TownProvider';
import { HelpRequestData } from '@/types/Requests';
import { getOfertas } from './actions';
import { useDebouncedValue } from '@/helpers/hooks';

export const dynamic = 'force-dynamic';

export default function OfertasPage() {
  return (
    <Suspense>
      <Ofertas />
    </Suspense>
  );
}

function Ofertas() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { towns } = useTowns();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [data, setData] = useState<HelpRequestData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(Number(searchParams.get('page')) || 1);
  const [currentCount, setCurrentCount] = useState<number>(0);
  const [search, setSearch] = useState<string>('');
  const debouncedSearch = useDebouncedValue(search, 500);
  
  const itemsPerPage = 10;
  const numPages = (count: number) => {
    return Math.ceil(count / itemsPerPage) || 0;
  };
  
  const updateFilter = useCallback(
    (filter: 'ayuda' | 'pueblo' | 'search' | 'page', value: string | number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(filter, value.toString());
      if (filter !== 'page') {
        setCurrentPage(1);
        params.set('page', '1');
      }
      router.push(`?${params.toString()}`);
    },
    [router, searchParams],
  );
  
  const [filtroData, setFiltroData] = useState({
    ayuda: searchParams.get('acepta') || 'todas',
    pueblo: searchParams.get('pueblo') || 'todos',
    search: searchParams.get('search') || '',
  });
  
  const changeDataFilter = useCallback(
    (type: 'ayuda' | 'pueblo' | 'search', newFilter: string) => {
      setFiltroData((prev) => ({
        ...prev,
        [type]: newFilter,
      }));
      updateFilter(type, newFilter);
    },
    [updateFilter],
  );

  useEffect(() => {
    if (debouncedSearch !== filtroData.search) {
      changeDataFilter('search', debouncedSearch);
    }    
  }, [debouncedSearch, changeDataFilter, filtroData.search]);


  function changePage(newPage: number) {
    setCurrentPage(newPage);
    updateFilter('page', newPage);
  }

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const { data, error, count } = await getOfertas({
          ...filtroData,
          paginacion: {
            itemsPerPage,
            currentPage,
          },
        });

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

  const sortedTowns = towns.slice().sort((a, b) => (a.name ?? '').localeCompare(b.name ?? '')); // Organizamos de A-Z los nombres de los pueblos obtenidos.

  return (
    <>
      {/* FILTROS  */}
      <div className="flex flex-col sm:flex-row gap-2 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 w-full justify-end">
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="busqueda">Búsqueda</label>
            <input
              id="busqueda"
              autoFocus={search !== ''}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              className="text-sm px-4 py-2 rounded-lg w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 shadow-sm"
            />
          </div>
          {/* Filtro de Ayuda */}
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="busqueda">Ofertas</label>
            <select
              value={filtroData.ayuda}
              onChange={(e) => changeDataFilter('ayuda', e.target.value)}
              className="px-4 py-2 rounded-lg w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 shadow-sm"
            >
              <option value="todas">Todas</option>
              {Object.entries(tiposAyudaOptions).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro de Pueblo */}
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="busqueda">Pueblos</label>
            <select
              value={filtroData.pueblo}
              onChange={(e) => changeDataFilter('pueblo', e.target.value)}
              className="px-4 py-2 rounded-lg w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 shadow-sm"
            >
              <option value="todos">Todos</option>
              {sortedTowns.map((town) => (
                <option key={town.id} value={town.id}>
                  {town.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="grid gap-4">
        {data.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg border border-gray-300 text-center flex justify-center items-center p-10 flex-col gap-5">
            <p className="text-gray-700 text-lg font-medium">
              No se encontraron ofertas que coincidan con los filtros.
            </p>
          </div>
        ) : (
          data.map((caso) => (
            <OfferCard caso={caso} showLink={true} showEdit={true} key={caso.id} highlightedText={filtroData.search} />
          ))
        )}
      </div>
      <div className="flex items-center justify-center">
        <Pagination currentPage={currentPage} totalPages={numPages(currentCount)} onPageChange={changePage} />
      </div>
    </>
  );
}
