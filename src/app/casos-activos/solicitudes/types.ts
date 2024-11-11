import { HelpRequestData } from '@/types/Requests';

export type FilterType = 'search' | 'urgencia' | 'tipoAyuda' | 'pueblo' | 'soloSinAsignar';

export type FiltersData = Record<FilterType, string>;

export type HelpRequestDataClean = Pick<HelpRequestData, 'id' | 'latitude' | 'longitude' | 'description' | 'location'>;
