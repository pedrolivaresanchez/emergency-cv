'use client';

import Map from '@/components/map/map';
import { HelpRequestDataClean } from './types';
import { HelpRequestData } from '@/types/Requests';
import { Dispatch, SetStateAction, useMemo } from 'react';

function transformHelpRequestToPointFeature(request: any): GeoJSON.Feature<GeoJSON.Point> {
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [request.longitude ?? 0, request.latitude ?? 0],
    },
    properties: request as HelpRequestData,
  };
}

type MapaSolicitudesProps = {
  data: HelpRequestDataClean[];
  setSelectedMarker: Dispatch<SetStateAction<HelpRequestData | null>>;
};

export default function MapaSolicitudes({ data, setSelectedMarker }: MapaSolicitudesProps) {
  const solicitudesGeoJson = useMemo(() => (
      {
      type: 'FeatureCollection',
      features: data.map(transformHelpRequestToPointFeature),
    } as GeoJSON.FeatureCollection<GeoJSON.Point>
  ), 
  [data]);

  return (
    <div className="sticky w-full h-screen top-0 right-0 z-0">
        <Map solicitudes={solicitudesGeoJson} setSelectedMarker={setSelectedMarker} />
    </div>
  );
}
