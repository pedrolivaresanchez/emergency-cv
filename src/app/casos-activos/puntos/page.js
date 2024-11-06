'use client';

import { useState, useEffect } from 'react';
import { MapPin, Phone, Calendar, User, HeartHandshake, Users, Truck, Search, Package, MapPinIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { tiposAyudaAcepta } from '@/helpers/constants';
import Pagination from '@/components/Pagination';
import { useRouter, useSearchParams } from 'next/navigation';
import PickupPoint from '@/components/PickupPoint';
import { useTowns } from '@/context/TownProvider';

export default function Puntos() {
  const towns = useTowns();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentCount, setCurrentCount] = useState(0);
  const [cityOptions, setCityOptions] = useState([]);

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
    acepta: searchParams.get('acepta') || 'todos',
    ciudad: searchParams.get('ciudad') || 'todas',
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
    async function fetchCities() {
      try {
        setError(null);

        // Comenzamos la consulta
        const query = supabase.from('distinct_collection_cities').select('city');

        // Ejecutar la consulta
        const { data, count, error } = await query;
        if (error) {
          console.log('Error fetching ciudades:', error);
          setCityOptions([]);
        } else {
          const trimmedCities = data.map((punto) => punto.city?.trim());
          const cities = [...new Set(trimmedCities)].sort();
          setCityOptions(cities || []);
          setCurrentCount(count);
        }
      } catch (err) {
        console.log('Error general:', err);
        setError('Error de conexión.');
      }
    }

    fetchCities();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Comenzamos la consulta
        const query = supabase.from('collection_points').select('*', { count: 'exact' });

        // Solo agregar filtro si no es "todos"
        if (filtroData.ayuda !== 'todas') {
          query.contains('accepted_items', [filtroData.ayuda]);
        }

        if (filtroData.ciudad !== 'todas') {
          query.ilike('city', filtroData.ciudad);
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
        <div className="flex flex-col sm:flex-row gap-2 items-center w-full justify-end">
          <h2 className="font-semibold">Se acepta:</h2>
          <select
            value={filtroData.ayuda}
            onChange={(e) => changeDataFilter('ayuda', e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 shadow-sm"
          >
            <option value="todas">Acepta todo</option>
            {tiposAyudaAcepta.map((acepta) => (
              <option key={acepta} value={acepta}>
                {acepta}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 items-center w-full justify-end">
          <h2 className="font-semibold">Ciudad:</h2>
          <select
            value={filtroData.ciudad}
            onChange={(e) => changeDataFilter('ciudad', e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 shadow-sm"
          >
            <option value="todas">Todas las ciudades</option>
            {cityOptions.map((city, i) => (
              <option key={i} value={city}>
                {city}
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
              Crear punto de ayuda en {filtroData.ciudad === 'todos' ? '' : filtroData.ciudad}
            </button>
          </div>
        ) : (
          data.map((punto) => <PickupPoint key={`pickup-point-${punto.id}`} point={punto} />)
        )}
      </div>
      <div className="flex items-center justify-center">
        <Pagination currentPage={currentPage} totalPages={numPages(currentCount)} onPageChange={changePage} />
      </div>
    </>
  );
}
