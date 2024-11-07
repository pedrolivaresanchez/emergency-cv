import { PageFilters } from './types';

export const ITEMS_PER_PAGE = 10;
export const DEFAULT_FITLERS: PageFilters = {
  currentPage: 1,
  pueblo: 'todos',
  tipoAyuda: 'todas',
  urgencia: 'todas',
  soloSinVoluntarios: true,
};
