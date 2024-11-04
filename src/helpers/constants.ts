export const tiposAyudaOptions: Record<string, string> = {
  limpieza: 'Limpieza/Desescombro',
  evacuacion: 'Transporte/Evacuación',
  alojamiento: 'Alojamiento temporal',
  distribucion: 'Distribución de suministros',
  rescate: 'Equipo de rescate',
  medica: 'Asistencia médica',
  psicologico: 'Apoyo psicológico',
  logistico: 'Apoyo logístico',
};

export const tiposAyudaAcepta: string[] = [
  'Alimentos',
  'Ropa',
  'Mantas',
  'Agua',
  'Productos de higiene',
  'Medicamentos',
];

export const mapToIdAndLabel = (data: any) => {
  return Object.keys(data).map((key) => ({
    id: key,
    label: data[key],
  }));
};
