export const tiposAyudaOptions = {
  limpieza: 'Labores de Limpieza',
  evacuacion: 'Peticion de desplazamiento',
  alojamiento: 'Alojamiento temporal',
  distribucion: 'Necesidad de suministros y material',
  rescate: 'Equipo de rescate (evacuación)',
  medica: 'Asistencia médica',
  psicologico: 'Apoyo psicológico',
  logistico: 'Apoyo logístico',
};

export const tiposAyudaAcepta = ['Alimentos', 'Ropa', 'Mantas', 'Agua', 'Productos de higiene', 'Medicamentos'];

export const mapToIdAndLabel = (data) => {
  return Object.keys(data).map((key) => ({
    id: key,
    label: data[key],
  }));
};
