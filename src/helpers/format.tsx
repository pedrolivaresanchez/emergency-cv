import ReactDOMServer from 'react-dom/server';
import { HelpRequestData } from '@/types/Requests';
import SolicitudCard from '@/components/solicitudes/SolicitudCard';
import { Fragment } from 'react';

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

export const getHighlightedText = (text: string, highlight: string) => {
  if (highlight === '') return text;
  const regEscape = (v: string) => v.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  const textChunks = text.split(new RegExp(regEscape(highlight), 'ig'));
  let sliceIdx = 0;
  return textChunks.map((chunk, index) => {
    const currentSliceIdx = sliceIdx + chunk.length;
    sliceIdx += chunk.length + highlight.length;
    return (
      <Fragment key={index}>
        {chunk}
        {currentSliceIdx < text.length && (
          <span className="inline-block bg-blue-100">{text.slice(currentSliceIdx, sliceIdx)}</span>
        )}
      </Fragment>
    );
  });
};