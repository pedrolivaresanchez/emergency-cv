'use client';

import { Dispatch, FC, ReactNode, SetStateAction, useState } from 'react';
import InteractiveMap, { Layer, MapLayerMouseEvent, Source } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useModal } from '@/context/ModalProvider';
import { HelpRequestDataWAssignmentCount } from '@/types/Requests';

export const MAP_MODAL_NAME = `map-marker`;

type MapProps = {
  solicitudes?: GeoJSON.FeatureCollection<GeoJSON.Point>;
  setSelectedMarker: Dispatch<SetStateAction<HelpRequestDataWAssignmentCount | null>>;
};

const PAIPORTA_LAT = 39.42333;
const PAIPORTA_LNG = -0.41667;
const DEFAULT_ZOOM = 12;

const Map: FC<MapProps> = ({ solicitudes, setSelectedMarker }) => {
  const [cursor, setCursor] = useState<'pointer' | 'default'>('default');

  const { toggleModal } = useModal();

  const onMouseMoveHandler = (e: MapLayerMouseEvent) => {
    setCursor(e.features?.length && e.features?.length > 0 ? 'pointer' : 'default');
  };

  const onClickHandler = (e: MapLayerMouseEvent) => {
    if (e.features?.[0]) {
      console.log('e.features?.[0]:', e.features?.[0].properties);
      toggleModal(MAP_MODAL_NAME, true);
      setSelectedMarker(e.features?.[0].properties as HelpRequestDataWAssignmentCount);
    }
  };

  return (
    <InteractiveMap
      initialViewState={{
        longitude: PAIPORTA_LNG,
        latitude: PAIPORTA_LAT,
        zoom: DEFAULT_ZOOM,
      }}
      style={{ width: '100%', height: '100%' }}
      mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
      onMouseMove={onMouseMoveHandler}
      onClick={onClickHandler}
      cursor={cursor}
      interactiveLayerIds={['solicitudes-circles']}
      maxZoom={20}
    >
      <Source type="geojson" data={solicitudes}>
        <Layer
          id="solicitudes-circles"
          type="circle"
          paint={{
            'circle-radius': ['interpolate', ['linear'], ['zoom'], 3, 3, 12, 7, 20, 200],
            'circle-color': {
              property: 'urgency',
              type: 'categorical',
              stops: [
                ['alta', 'rgb(239, 68, 68, 0.3)'],
                ['media', 'rgb(234, 179, 8, 0.3)'],
                ['baja', 'rgb(34, 197, 94, 0.3)'],
              ],
            },
            'circle-stroke-color': {
              property: 'urgency',
              type: 'categorical',
              stops: [
                ['alta', 'rgb(239, 68, 68, 0.4)'],
                ['media', 'rgb(234, 179, 8, 0.4)'],
                ['baja', 'rgb(34, 197, 94, 0.4)'],
              ],
            },
            'circle-stroke-width': 1,
          }}
        />
      </Source>
      {/* <div className="bottom-2 right-2 absolute w-32 z-10 bg-white p-2 rounded-md w-80 shadow-lg">
        <div className="flex gap-2 min-w-fit">
          <input type="checkbox" name="filterByMap" id="filterByMap" />
          <label htmlFor="filterByMap" className="text-sm cursor-pointer">
            Filtra mientras mueves el mapa
          </label>
        </div>
      </div> */}
    </InteractiveMap>
  );
};

export default Map;
