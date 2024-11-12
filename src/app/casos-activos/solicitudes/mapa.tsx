'use client';

import SolicitudCard from '@/components/SolicitudCard';
import Map, { PinMapa } from '@/components/map/map';
import { HelpRequestDataClean } from './types';

function transformHelpRequestToMarker(request: any): PinMapa {
  return {
    urgency: request.urgency,
    latitude: request.latitude ?? 0,
    longitude: request.longitude ?? 0,
    id: request.id,
    popup: <SolicitudCard format="small" showLink={true} showEdit={false} caso={request} />,
  };
}

type MapaSolicitudesProps = {
  data: HelpRequestDataClean[];
};

export default function MapaSolicitudes({ data }: MapaSolicitudesProps) {
  const markers = data.map(transformHelpRequestToMarker);

  return (
    <div className="sticky w-full h-screen top-0 right-0 z-0">
        <Map markers={markers} />
    </div>
  );
}
