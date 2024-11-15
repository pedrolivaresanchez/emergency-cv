import { HelpRequestData } from '@/types/Requests';

export type FilterType = 'search' | 'urgencia' | 'tipoAyuda' | 'pueblo' | 'soloSinAsignar';

export type FiltersData = Record<FilterType, string>;
