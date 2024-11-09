export const tiposAyudaOptions = {
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
