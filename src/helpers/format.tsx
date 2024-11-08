import ReactDOMServer from 'react-dom/server';
import { HelpRequestData } from '@/types/Requests';
import { CollectionPointData } from '@/types/DataPoints';
import SolicitudCard from '@/components/SolicitudCard';
import { tiposAyudaOptions } from '@/helpers/constants';

export const getMarkerBySolicitud = (solicitud: HelpRequestData) => {
  // TODO think if possible getLatLng from a given location
  if (!solicitud.latitude || !solicitud.longitude) {
    return null;
  }

  return {
    id: solicitud.id,
    coordinates: [solicitud.longitude, solicitud.latitude],
    descriptionHTML: getMarkerDescriptionBySolicitudAndTowns(solicitud),
    color: getMarkerColorBySolicitud(solicitud),
    width: '400px',
  };
};

export const getMarkerColorBySolicitud = (solicitud: HelpRequestData) => {
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
export const getMarkerDescriptionBySolicitudAndTowns = (solicitud: HelpRequestData) => {
  return ReactDOMServer.renderToString(
    <SolicitudCard key={solicitud.id} caso={solicitud} showEdit={false} showLink={true} />,
  );
};
