import { HelpRequestHelpType } from '@/types/Requests';

export const tiposAyudaOptions: Record<HelpRequestHelpType, string> = {
  limpieza: 'Labores de Limpieza',
  evacuacion: 'Peticion de desplazamiento',
  alojamiento: 'Alojamiento temporal',
  distribucion: 'Necesidad de suministros y material',
  rescate: 'Equipo de rescate (evacuación)',
  medica: 'Asistencia médica',
  psicologico: 'Apoyo psicológico',
  logistico: 'Apoyo logístico',
  reparto: 'Labores de reparto de alimentos a domicilio',
  donaciones: 'Labores de organización de donaciones',
  maquinariaMovilidadReducida: 'Maquinaria para movilidad reducida',
  maquinariaPesada: 'Maquinaria pesada (grúas, palas, ...)',
  contenedoresEscombros: 'Contenedores de Escombros',
  otros: 'Ayuda general',
} as const;

type TipoAyudaId = keyof typeof tiposAyudaOptions;
type TipoAyudaLabel = (typeof tiposAyudaOptions)[TipoAyudaId];

interface TipoAyudaOption {
  id: TipoAyudaId;
  label: TipoAyudaLabel;
}

export const tiposAyudaArray: TipoAyudaOption[] = Object.entries(tiposAyudaOptions).map(([id, label]) => ({
  id: id as TipoAyudaId,
  label,
}));

export const CrmStatusActive = 'active';
export const CrmStatusFollowUp = 'followup';
export const CrmStatusAssigned = 'assigned';
export const CrmStatusProgress = 'progress';
export const CrmStatusFinished = 'finished';

export const CRMStatus = {
  [CrmStatusActive]: 'Activo',
  [CrmStatusFollowUp]: 'Volver a llamar',
  [CrmStatusAssigned]: 'Asignado',
  [CrmStatusProgress]: 'En Progreso',
  [CrmStatusFinished]: 'Hecho',
};

export const UserRoles = {
  admin: 'admin',
  moderator: 'moderator',
};
