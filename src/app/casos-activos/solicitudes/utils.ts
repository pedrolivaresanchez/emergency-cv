import { DEFAULT_FITLERS } from './constants';
import type { PageFilters, SearchParams } from './types';

export const changeFilters = <K extends keyof PageFilters>(
  currentFilters: PageFilters,
  newFilter: K,
  newValue: PageFilters[K],
): PageFilters => {
  if (newFilter === 'currentPage') {
    return {
      ...currentFilters,
      currentPage: newValue as number,
    };
  }

  return {
    ...currentFilters,
    currentPage: 1,
    [newFilter]: newValue,
  };
};

export const updateUrlSearchParamsWithFilters = (
  prevSearchParams: URLSearchParams,
  newFilters: PageFilters,
): URLSearchParams => {
  const params = new URLSearchParams(prevSearchParams.toString());

  Object.entries(newFilters).forEach(([key, value]) => {
    if (value) {
      params.set(key, value.toString());
    }
  });

  return params;
};

export const searchParams2Filters = (searchParams: SearchParams): PageFilters => {
  const { currentPage, pueblo, tipoAyuda, urgencia, soloSinVoluntarios } = searchParams;

  const filters = {
    currentPage: currentPage || DEFAULT_FITLERS.currentPage,
    pueblo: pueblo || DEFAULT_FITLERS.pueblo,
    tipoAyuda: tipoAyuda || DEFAULT_FITLERS.tipoAyuda,
    urgencia: urgencia || DEFAULT_FITLERS.urgencia,
    soloSinVoluntarios: !!soloSinVoluntarios,
  };

  return filters;
};
