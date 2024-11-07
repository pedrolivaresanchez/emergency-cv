import { RequestDetails } from '@/types/Requests';
import { Enums } from '@/types/common';

export const tiposAyudaOptions = {
  limpieza: 'Labores de Limpieza',
  evacuacion: 'Peticion de desplazamiento',
  alojamiento: 'Alojamiento temporal',
  distribucion: 'Necesidad de suministros y material',
  rescate: 'Equipo de rescate (evacuación)',
  medica: 'Asistencia médica',
  psicologico: 'Apoyo psicológico',
  logistico: 'Apoyo logístico',
  otros: 'Ayuda general',
};

export const tiposAyudaAcepta = ['Alimentos', 'Ropa', 'Mantas', 'Agua', 'Productos de higiene', 'Medicamentos'];

export const mapToIdAndLabel = (data: any) => {
  return Object.keys(data).map((key) => ({
    id: key,
    label: data[key],
  }));
};

export const TIPOS_DE_AYUDA: RequestDetails[] = [
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
type HelpTypesMap = Map<RequestDetails['id'], { label: RequestDetails['label']; enum: Enums['help_type_enum'] }>;

export const TIPOS_DE_AYUDA_MAP: HelpTypesMap = new Map(
  TIPOS_DE_AYUDA.map((item) => [item.id, { label: item.label, enum: item.enumLabel }]),
);

export enum HelpUrgency {
  alta = 'alta',
  media = 'media',
  baja = 'baja',
}
