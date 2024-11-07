import { Enums } from '@/types/common';
import { HelpUrgency } from '@/helpers/constants';

export type PageFilters = {
  tipoAyuda: 'todas' | Enums['help_type_enum'];
  pueblo: 'todos' | string;
  urgencia: 'todas' | HelpUrgency;
  currentPage: number;
};

export type SearchParams = {
  tipoAyuda: 'todas' | Enums['help_type_enum'] | undefined;
  pueblo: 'todos' | string | undefined;
  urgencia: 'todas' | HelpUrgency | undefined;
  currentPage: number | undefined;
};
