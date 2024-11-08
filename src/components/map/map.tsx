'use client';

import { FC, ReactNode, useState } from 'react';
import ReactMap from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Marker } from 'react-map-gl/maplibre';
import { useModal } from '@/context/ModalProvider';
import Modal from '@/components/Modal';
import { MapPinFilled } from '@/components/icons/MapPinFilled';

const MODAL_NAME = `map-marker`;

const urgencyToColor = {
  alta: 'text-red-500',
  media: 'text-amber-500',
  baja: 'text-emerald-500',
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

  const { toggleModal } = useModal();
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
            key={`marker-${m.id}-${m.latitude}-${m.longitude}-${m.urgency}`}
            longitude={m.longitude}
            latitude={m.latitude}
            onClick={() => {
              toggleModal(MODAL_NAME, true);
              setSelectedMarker(m);
            }}
            anchor="bottom"
          >
            <MapPinFilled className={`h-6 w-6 ${urgencyToColor[m.urgency]}`} />
          </Marker>
        );
      })}
      {selectedMarker && <Modal id={MODAL_NAME}>{selectedMarker.popup}</Modal>}
    </ReactMap>
  );
};

export default Map;
