export const tiposAyudaOptions = {
  limpieza: 'Limpieza/Desescombro',
  evacuacion: 'Transporte/Evacuación',
  alojamiento: 'Alojamiento temporal',
  distribucion: 'Distribución de suministros',
  rescate: 'Equipo de rescate',
  medica: 'Asistencia médica',
  psicologico: 'Apoyo psicológico',
  logistico: 'Apoyo logístico',
};

export const mapToIdAndLabel = (data) => {
  return Object.keys(data).map((key) => ({
    id: key,
    label: data[key],
  }));
};
