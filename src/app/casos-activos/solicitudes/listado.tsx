'use client';

import { useCallback, ChangeEventHandler, useMemo } from 'react';
import SolicitudCard from '@/components/SolicitudCard';
import { tiposAyudaOptions } from '@/helpers/constants';
import { useTowns } from '@/context/TownProvider';
import { Toggle } from '@/components/Toggle';
import { FiltersData, FilterType, HelpRequestDataClean } from './types';
import TabNavigation, { TabNavigationCount } from '@/components/TabNavigation';
import { HelpRequestData } from '@/types/Requests';

export const isStringTrue = (str: string): boolean => str === 'true';

type ListadoSolicitudesProps = {
  data: HelpRequestDataClean[]
  count: TabNavigationCount
  filtersData: FiltersData
  onDataFilterChange: (type: FilterType, newFilter: string) => void;
}

export default function ListadoSolicitudes({ data, count, filtersData, onDataFilterChange}: ListadoSolicitudesProps) {
  
  const { towns } = useTowns();

  const hasFilters = useMemo(() => Object.entries(filtersData).some(([key, value]) => 
    key !== 'soloSinAsignar' 
    && value !== '' 
    && value !== 'todas' 
    && value !== 'todos'
  ), [filtersData]);

  const handleToggleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => onDataFilterChange('soloSinAsignar', `${e.target.checked}`),
    [onDataFilterChange],
  );

  // Organizamos de A-Z los nombres de los pueblos obtenidos.
  const sortedTowns = useMemo(() => 
    towns.slice().sort((a, b) => (a.name ?? '').localeCompare(b.name ?? '')), 
  [towns]); 

  return (
    <div className="p-4 drop-shadow-xl z-10 bg-gray-100">
      <TabNavigation count={count} />
      {/* FILTROS  */}
      <div className="flex flex-col sm:flex-row py-4 gap-2 items-center justify-between">
        <div className="flex flex-col w-full">
          <div className="flex flex-col sm:flex-row gap-2 w-full justify-end">
            <div className='flex flex-col gap-1 w-full'>
              <label htmlFor="busqueda">Búsqueda</label>
              <input
                id="busqueda"
                value={filtersData.search}
                onChange={(e) => onDataFilterChange('search', e.target.value)}
                type="text"
                className="text-sm px-4 py-2 rounded-lg w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 shadow-sm"
              />
            </div>
            <div className='flex flex-col gap-1 w-full'>
              <label htmlFor="necesidades">Necesidades</label>
              <select
                id="necesidades"
                value={filtersData.tipoAyuda}
                onChange={(e) => onDataFilterChange('tipoAyuda', e.target.value)}
                className="px-4 py-2 rounded-lg w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 shadow-sm"
              >
                <option value="todas">Todas</option>
                {Object.entries(tiposAyudaOptions).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className='flex flex-col gap-1 w-full'>
              <label htmlFor="prioridades">Prioridades</label>
              <select
                id="prioridades"
                value={filtersData.urgencia}
                onChange={(e) => onDataFilterChange('urgencia', e.target.value)}
                className="px-4 py-2 rounded-lg w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 shadow-sm"
              >
                <option value="todas">Todas</option>
                <option value="alta">Alta prioridad</option>
                <option value="media">Media prioridad</option>
                <option value="baja">Baja prioridad</option>
              </select>
            </div>
            <div className='flex flex-col gap-1 w-full'>
              <label htmlFor="pueblos">Pueblos</label>
              <select
                id="pueblos"
                value={filtersData.pueblo}
                onChange={(e) => onDataFilterChange('pueblo', e.target.value)}
                className="px-4 py-2 rounded-lg w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 shadow-sm"
              >
                <option value="todos">Todos</option>
                {sortedTowns.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-row flex-1 justify-end pt-4">
            {hasFilters && data.length > 0 && <span className="flex-1">{data.length} solicitudes</span>}
            <Toggle
              handleChange={handleToggleChange}
              checked={isStringTrue(filtersData.soloSinAsignar)}
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
          data.map((caso) => <SolicitudCard format="small" showLink={true} showEdit={true} key={caso.id} caso={caso as HelpRequestData} />)
        )}
      </div>
      {/* <div className="flex items-center justify-center">
        <Pagination currentPage={currentPage} totalPages={numPages(currentCount)} onPageChange={changePage} />
      </div> */}
    </div>
  );
}
