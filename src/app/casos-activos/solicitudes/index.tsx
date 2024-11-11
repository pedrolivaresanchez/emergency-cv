'use client';

import { useEffect, useState, useCallback } from 'react';
// import { supabase } from '@/lib/supabase/client';
import { matchSorter } from 'match-sorter';
import { useRouter, useSearchParams } from 'next/navigation';
import ListadoSolicitudes from './listado';
import MapaSolicitudes from './mapa';
import { FilterType, HelpRequestDataClean } from './types';
import { useTowns } from '@/context/TownProvider';
import { TabNavigationCount } from '@/components/TabNavigation';

type DataFilter = { keys: (keyof HelpRequestDataClean)[]; value: string };
function getDataFiltered(data: HelpRequestDataClean[], filters: DataFilter[]) {
  if (!filters || !filters.length) {
    return data;
  }

  return filters.reduceRight((results, { value, keys }) => matchSorter(results, value, { keys }), data);
}

type SolicitudesProps = {
  count: TabNavigationCount
  data: HelpRequestDataClean[];
};

export function Solicitudes({ data, count }: SolicitudesProps) {
  const { towns } = useTowns();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [dataFiltered, setDataFiltered] = useState<HelpRequestDataClean[]>(data);

  const [filtersData, setFiltersData] = useState({
    search: searchParams.get('search') || '',
    urgencia: searchParams.get('urgencia') || 'todas',
    tipoAyuda: searchParams.get('tipoAyuda') || 'todas',
    pueblo: searchParams.get('pueblo') || 'todos',
    soloSinAsignar: searchParams.get('soloSinAsignar') || 'false',
  });

  const updateFilter = useCallback(
    (filter: FilterType, value: string | number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(filter, value.toString());
      router.push(`?${params.toString()}`);
    },
    [searchParams, router],
  );

  const changeDataFilter = useCallback(
    (type: FilterType, newFilter: string) => {
      setFiltersData((prev) => ({
        ...prev,
        [type]: newFilter,
      }));
      updateFilter(type, newFilter);
    },
    [updateFilter],
  );

  useEffect(() => {
    const town = towns.find((t) => t.id === parseInt(filtersData.pueblo));
    const filters: DataFilter[] = [
      {
        keys: ['description'],
        value: filtersData.search,
      },
      { keys: ['location'], value: town?.name || '' },
    ];
    setDataFiltered(getDataFiltered(data, filters));
  }, [data, filtersData, towns]);

  return (
    <div className="grid grid-cols-2">
      <ListadoSolicitudes data={dataFiltered} count={count} filtersData={filtersData} onDataFilterChange={changeDataFilter} />
      <MapaSolicitudes data={dataFiltered} />
    </div>
  );
}
