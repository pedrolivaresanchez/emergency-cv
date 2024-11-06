import { HelpCategory, HelpTypesMap } from './types';

export const TIPOS_DE_AYUDA: HelpCategory[] = [
  {
    id: 1,
    label: 'Labores de Limpieza',
    enumLabel: 'limpieza',
  },
  {
    id: 2,
    label: 'Petición de desplazamiento',
    enumLabel: 'evacuacion',
  },
  {
    id: 3,
    label: 'Alojamiento temporal',
    enumLabel: 'alojamiento',
  },
  {
    id: 4,
    label: 'Necesidad de suministros y material',
    enumLabel: 'distribucion',
  },
  {
    id: 5,
    label: 'Equipo de rescate (evacuación)',
    enumLabel: 'rescate',
  },
  {
    id: 6,
    label: 'Asistencia médica',
    enumLabel: 'medica',
  },
  {
    id: 7,
    label: 'Apoyo psicológico',
    enumLabel: 'psicologico',
  },
  {
    id: 8,
    label: 'Apoyo logístico',
    enumLabel: 'logistico',
  },
  /*
  { id: 9, label: 'Maquinaria para movilidad reducida', enumLabel: 'otros' },
  { id: 10, label: 'Maquinaria pesada (grúas, palas, ...)', enumLabel: 'otros' },
  {
    id: 11,
    label: 'Contenedores de escombros',
    enumLabel: 'otros',
  },
  { id: 12, label: 'Equipamiento (botas, palas, guantes, ...)', enumLabel: 'otros' },
   */
];

export const TIPOS_DE_AYUDA_MAP: HelpTypesMap = new Map(
  TIPOS_DE_AYUDA.map((item) => [item.id, { label: item.label, enum: item.enumLabel }]),
);
