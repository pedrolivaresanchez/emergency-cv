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
};

export const tiposAyudaAcepta = ['Alimentos', 'Ropa', 'Mantas', 'Agua', 'Productos de higiene', 'Medicamentos'];

export const mapToIdAndLabel = (data: any) => {
  return Object.keys(data).map((key) => ({
    id: key,
    label: data[key],
  }));
};

export const COOKIE_CONSENT_KEY = 'ajudana_cookie_consent';
