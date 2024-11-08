'use client';

import { Suspense, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import Pagination from '@/components/Pagination';
import { tiposAyudaOptions } from '@/helpers/constants';
import { useRouter, useSearchParams } from 'next/navigation';
import OfferCard from '@/components/OfferCard';
import { HelpRequestData } from '@/types/Requests';

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
  const {} = router;

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [data, setData] = useState<HelpRequestData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(Number(searchParams.get('page')) || 1);
  const [currentCount, setCurrentCount] = useState<number>(0);

  const itemsPerPage = 10;
  const numPages = (count: number) => {
    return Math.ceil(count / itemsPerPage) || 0;
  };

  const updateFilter = (filter: 'ayuda' | 'page', value: string | number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(filter, value.toString());
    router.push(`?${params.toString()}`);
  };

  const [filtroData, setFiltroData] = useState({
    ayuda: searchParams.get('acepta') || 'todas',
  });

  const changeDataFilter = (type: 'ayuda', newFilter: string) => {
    setFiltroData((prev) => ({
      ...prev,
      [type]: newFilter,
    }));
    updateFilter(type, newFilter);
  };

  function changePage(newPage: number) {
    setCurrentPage(newPage);
    updateFilter('page', newPage);
  }

  useEffect(() => {
    async function fetchData() {
      const url = process.env.NEXT_PUBLIC_BASE_URL + '/api/ofertas/?';
      try {
        setLoading(true);
        setError(null);
        const filter = [];

        if (filtroData.ayuda !== 'todas') {
          filter.push('type=' + filtroData.ayuda);
        }
        filter.push('page=' + currentPage);
        const filterUrl = url + filter.join('&');
        const response = await fetch(filterUrl);
        if (!response.ok) {
          console.log(`Error fetching solicitudes: ${response.status}`);
          setData([]);
        } else {
          const { data, count } = await response.json();
          setData(data || []);
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
        <p className="font-bold text-md">Filtros</p>
        <div className="flex flex-col sm:flex-row gap-2 w-full justify-end">
          <select
            value={filtroData.ayuda}
            onChange={(e) => changeDataFilter('ayuda', e.target.value)}
            className="px-4 py-2 rounded-lg w-full sm:w-auto border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 shadow-sm"
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
              No se encontraron ofertas que coincidan con los filtros.
            </p>
          </div>
        ) : (
          data.map((caso) => <OfferCard caso={caso} showLink={true} key={caso.id} />)
        )}
      </div>
      <div className="flex items-center justify-center">
        <Pagination currentPage={currentPage} totalPages={numPages(currentCount)} onPageChange={changePage} />
      </div>
    </>
  );
}
