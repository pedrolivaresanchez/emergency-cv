'use client';

import { useEffect, useState, useCallback } from 'react';
import { matchSorter } from 'match-sorter';
import { useRouter, useSearchParams } from 'next/navigation';
import { FilterType } from './types';
import { useTowns } from '@/context/TownProvider';
import { TabNavigationCount } from '@/components/TabNavigation';
import Modal from '@/components/Modal';
import { MAP_MODAL_NAME } from '@/components/map/map';
import { HelpRequestData } from '@/types/Requests';
import SolicitudCard from '@/components/solicitudes/SolicitudCard';
import SolicitudList, { isStringTrue } from '@/components/solicitudes/SolicitudList';
import SolicitudMap from '@/components/solicitudes/SolicitudMap';

type DataFilter = { keys: (keyof HelpRequestData)[]; value: string };
function getDataFiltered(data: HelpRequestData[], filters: DataFilter[]) {
  if (!filters || !filters.length) {
    return data;
  }

  return filters.reduceRight(
    (results, { value, keys }) =>
      matchSorter(results, value, { keys, threshold: matchSorter.rankings.WORD_STARTS_WITH }),
    data,
  );
}

type SolicitudesProps = {
  count: TabNavigationCount;
  data: HelpRequestData[];
};

export function Solicitudes({ data, count }: SolicitudesProps) {
  const { towns } = useTowns();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedMarker, setSelectedMarker] = useState<HelpRequestData | null>(null);

  const [dataFiltered, setDataFiltered] = useState<HelpRequestData[]>(data);

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
      if (filter === 'soloSinAsignar') {
        router.push(`?${params.toString()}`);
      }
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
    const filters: DataFilter[] = [];
    if (filtersData.search) {
      filters.push({
        keys: ['description'],
        value: filtersData.search,
      });
    }
    if (filtersData.pueblo && filtersData.pueblo !== 'todos') {
      const town = towns.find((t) => t.id === parseInt(filtersData.pueblo));
      filters.push({ keys: ['location'], value: town?.name || '' });
    }
    if (filtersData.urgencia && filtersData.urgencia !== 'todas') {
      filters.push({ keys: ['urgency'], value: filtersData.urgencia });
    }
    if (filtersData.tipoAyuda && filtersData.tipoAyuda !== 'todas') {
      filters.push({ keys: ['help_type'], value: filtersData.tipoAyuda });
    }
    const preFilteredData = isStringTrue(filtersData.soloSinAsignar)
      ? data.filter((d) => d.asignees_count === 0)
      : data;
    setDataFiltered(getDataFiltered(preFilteredData, filters));
  }, [data, filtersData, towns]);

  return (
    <>
      <div className="lg:flex lg:flex-row-reverse">
        <SolicitudMap data={dataFiltered} setSelectedMarker={setSelectedMarker} />
        <SolicitudList
          data={dataFiltered}
          count={count}
          filtersData={filtersData}
          onDataFilterChange={changeDataFilter}
        />
      </div>
      {selectedMarker && (
        <Modal id={MAP_MODAL_NAME}>
          <SolicitudCard format="small" showLink={true} showEdit={false} caso={selectedMarker} />
        </Modal>
      )}
    </>
  );
}
