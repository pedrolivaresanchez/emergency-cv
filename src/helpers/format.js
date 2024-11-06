import SolicitudCard from '@/components/SolicitudCard';
import ReactDOMServer from 'react-dom/server';

export const getMarkerBySolicitud = (solicitud, towns) => {
  // TODO think if possible getLatLng from a given location
  if (!solicitud.latitude || !solicitud.longitude) {
    return null;
  }

  return {
    id: solicitud.id,
    coordinates: [solicitud.longitude, solicitud.latitude],
    descriptionHTML: getMarkerDescriptionBySolicitudAndTowns(solicitud, towns),
    color: getMarkerColorBySolicitud(solicitud),
    width: '400px',
  };
};

export const getMarkerColorBySolicitud = (solicitud) => {
  switch (solicitud.urgency) {
    case 'baja':
      return '#00FF00';
    case 'media':
      return '#FFA500';
    case 'alta':
      return '#FF0000';
    default:
      return '#000000';
  }
};
export const getMarkerDescriptionBySolicitudAndTowns = (solicitud, towns) => {
  return ReactDOMServer.renderToString(<SolicitudCard key={solicitud.id} caso={solicitud} towns={towns} />);
};

export const getMarkerByPuntoDeRecogida = (ptoDeRecogida) => {
  // TODO think if possible getLatLng from a given location
  if (!ptoDeRecogida.latitude || !ptoDeRecogida.longitude) {
    return null;
  }

  if (!ptoDeRecogida.active) return null;

  return {
    id: ptoDeRecogida.id,
    coordinates: [ptoDeRecogida.longitude, ptoDeRecogida.latitude],
    descriptionHTML: getMarkerDescriptionByPuntoDeRecogida(ptoDeRecogida),
    color: '#0000FF',
  };
};

export const getMarkerDescriptionByPuntoDeRecogida = (ptoDeRecogida) => {
  return `
        <div class="p-4 bg-white rounded-lg max-w-xs overflow-y-scroll">
            <h2 class="text-sm font-bold text-gray-800 mb-2">${ptoDeRecogida.contact_name}</h2>
            <div class="space-y-2">
                <p><span class="font-semibold text-gray-600">Dirección:</span> ${ptoDeRecogida.location}</p>
                <p><span class="font-semibold text-gray-600">Descripción:</span> ${ptoDeRecogida.description}</p>
                <p><span class="font-semibold text-gray-600">Contacto:</span> ${ptoDeRecogida.contact_phone}</p>
            </div>
        </div>
    `;
};

export const getMarkerByOferta = (oferta) => {
  // TODO think if possible getLatLng from a given location
  if (!oferta.latitude || !oferta.longitude) {
    return null;
  }

  return {
    id: oferta.id,
    coordinates: [oferta.longitude, oferta.latitude],
    descriptionHTML: getMarkerDescriptionByOferta(oferta),
    color: '#FF00FF',
  };
};

export const getMarkerDescriptionByOferta = (oferta) => {
  return `
        <div class="p-4 bg-white rounded-lg max-w-xs overflow-y-scroll">
            <h2 class="text-sm font-bold text-gray-800 mb-2">${oferta.name}</h2>
            <div class="space-y-2">
                <p><span class="font-semibold text-gray-600">Tipo de ayuda:</span> ${tiposAyudaOptions[oferta.help_type]}</p>
                <p><span class="font-semibold text-gray-600">Dirección:</span> ${oferta.location}</p>
                <p><span class="font-semibold text-gray-600">Descripción:</span> ${oferta.description}</p>
                <p><span class="font-semibold text-gray-600">Contacto:</span> ${oferta.contact_info}</p>
            </div>
        </div>
    `;
};
