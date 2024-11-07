'use client';

import { ChangeEventHandler, useCallback } from 'react';
import { HeartHandshake } from 'lucide-react';

import SolicitudCard from '@/components/SolicitudCard';
import Pagination from '@/components/Pagination';
import OfferHelp from '@/components/OfferHelp';
import { useRouter, useSearchParams } from 'next/navigation';
import { tiposAyudaOptions } from '@/helpers/constants';
import Modal from '@/components/Modal';
import { useModal } from '@/context/EmergencyProvider';
import { Database } from '@/types/database';
import { Town } from '@/types/Town';
import { PageFilters } from '../types';
import { changeFilters, updateUrlSearchParamsWithFilters } from '../utils';
import { Toggle } from '@/components/Toggle';

const MODAL_NAME = 'solicitudes';

type PageContentProps = {
  data: Database['public']['Tables']['help_requests']['Row'][] | null;
  currentCount: number;
  filters: PageFilters;
  towns: Town[];
};
export function PageContent({ currentCount, data, filters, towns }: PageContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { toggleModal } = useModal();

  const closeModal = () => {
    toggleModal(MODAL_NAME, false);
  };
  const itemsPerPage = 10;
  const numPages = (count: number) => {
    return Math.ceil(count / itemsPerPage) || 0;
  };

  const updateFilterAndUrlParams = useCallback(
    <K extends keyof PageFilters>(filter: K, value: PageFilters[K]) => {
      const newFilters = changeFilters(filters, filter, value);
      const newParams = updateUrlSearchParamsWithFilters(searchParams, newFilters);

      router.push(`?${newParams.toString()}`);
    },
    [filters],
  );

  function changePage(newPage: number) {
    updateFilterAndUrlParams('currentPage', newPage);
  }

  const handleVoluntariosChange = useCallback((state: boolean) => {
    updateFilterAndUrlParams('soloSinVoluntarios', state);
  }, []);

  return (
    <>
      {/* FILTROS  */}
      <div className="flex flex-col sm:flex-row gap-2 items-center justify-between">
        <p className="font-bold text-md">Filtros</p>
        <div className="flex flex-col sm:flex-row gap-2 w-full justify-end">
          <Toggle
            checked={filters.soloSinVoluntarios}
            handleChange={handleVoluntariosChange}
            label="Sólo ofertas sin voluntarios"
          />
          <select
            id="necesidades-selector"
            data-testid="necesidades-selector"
            value={filters.tipoAyuda}
            onChange={(e) => updateFilterAndUrlParams('tipoAyuda', e.target.value as any)}
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
            value={filters.urgencia}
            onChange={(e) => updateFilterAndUrlParams('urgencia', e.target.value as any)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 shadow-sm"
          >
            <option value="todas">Todas las prioridades</option>
            <option value="alta">Alta prioridad</option>
            <option value="media">Media prioridad</option>
            <option value="baja">Baja prioridad</option>
          </select>
          <select
            value={filters.pueblo}
            onChange={(e) => updateFilterAndUrlParams('pueblo', e.target.value)}
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
        {!data || data.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg border border-gray-300 text-center flex justify-center items-center p-10 flex-col gap-5">
            <p className="text-gray-700 text-lg font-medium">
              No se encontraron solicitudes que coincidan con los filtros.
            </p>

            <button
              onClick={() => {
                toggleModal(MODAL_NAME, true);
              }}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2 whitespace-nowrap"
            >
              <HeartHandshake className="w-5 h-5" />
              Ofrecer ayuda a {filters.pueblo === 'todos' ? '' : filters.pueblo}
            </button>
          </div>
        ) : (
          data.map((caso) => <SolicitudCard isHref={true} towns={towns} key={caso.id} caso={caso} />)
        )}
      </div>
      <div className="flex items-center justify-center">
        <Pagination currentPage={filters.currentPage} totalPages={numPages(currentCount)} onPageChange={changePage} />
      </div>

      <Modal id={MODAL_NAME}>
        <OfferHelp
          town={towns.find((town) => town.id === Number(filters.pueblo))?.name}
          onClose={closeModal}
          isModal={true}
        />
      </Modal>
    </>
  );
}
