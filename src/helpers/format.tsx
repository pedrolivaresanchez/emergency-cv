import { HelpRequestData } from '@/types/Requests';
import { Fragment } from 'react';

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
