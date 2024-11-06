'use client';

import { FC, ReactNode, useRef, useState } from 'react';
import ReactMap, { Popup } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Marker } from 'react-map-gl/maplibre';
import { MapPin } from 'lucide-react';

const urgencyToColor = {
  alta: '#ef4444', //text-red-500
  media: '#f59e0b', //text-amber-500
  baja: '#10b981', //text-emerald-500
};

export type PinMapa = {
  id: string;
  latitude: number;
  longitude: number;
  urgency: 'alta' | 'media' | 'baja';
  popup: ReactNode;
};

type MapProps = {
  markers?: PinMapa[];
};

const PAIPORTA_LAT = 39.42333;
const PAIPORTA_LNG = -0.41667;
const DEFAULT_ZOOM = 12;

const Map: FC<MapProps> = ({ markers = [] }) => {
  const [selectedMarker, setSelectedMarker] = useState<PinMapa | null>(null);

  console.log(selectedMarker);
  return (
    <ReactMap
      initialViewState={{
        longitude: PAIPORTA_LNG,
        latitude: PAIPORTA_LAT,
        zoom: DEFAULT_ZOOM,
      }}
      style={{ width: '100%', height: '75vh' }}
      mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
    >
      {markers.map((m) => {
        return (
          <Marker
            key={m.id}
            color={urgencyToColor[m.urgency]}
            longitude={-0.4}
            latitude={39.42333}
            onClick={() => setSelectedMarker(m)}
            anchor="bottom"
          >
            <MapPin className="h-6 w-6 text-orange-500" />
          </Marker>
        );
      })}
      {selectedMarker && (
        <Popup
          longitude={-0.4}
          latitude={39.42333}
          className={'map-popup'}
          anchor="top"
          onClose={() => setSelectedMarker(null)}
        >
          {selectedMarker.popup}
        </Popup>
      )}
    </ReactMap>
  );
};

export default Map;
