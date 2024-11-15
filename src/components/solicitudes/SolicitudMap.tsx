'use client';

import Map from '@/components/map/map';
import { HelpRequestData, HelpRequestDataWAssignmentCount } from '@/types/Requests';
import { Dispatch, SetStateAction, useMemo } from 'react';

function transformHelpRequestToPointFeature(request: any): GeoJSON.Feature<GeoJSON.Point> | [] {
  if (!request.latitude || !request.longitude) {
    return [];
  }
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [request.longitude ?? 0, request.latitude ?? 0],
    },
    properties: request as HelpRequestData,
  };
}

type SolicitudListProps = {
  data: HelpRequestDataWAssignmentCount[];
  setSelectedMarker: Dispatch<SetStateAction<HelpRequestDataWAssignmentCount | null>>;
};

export default function SolicitudList({ data, setSelectedMarker }: SolicitudListProps) {
  const solicitudesGeoJson = useMemo(
    () =>
      ({
        type: 'FeatureCollection',
        features: data.flatMap(transformHelpRequestToPointFeature),
      }) as GeoJSON.FeatureCollection<GeoJSON.Point>,
    [data],
  );

  return (
    <div className="lg:sticky w-1/1 h-screen max-h-[50vh] lg:max-h-[100vh] lg:w-1/2 top-0 right-0 z-0">
      <Map solicitudes={solicitudesGeoJson} setSelectedMarker={setSelectedMarker} />
    </div>
  );
}
