import { FC, useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MarkersType } from '@/types/Markers';

type MapProps = {
  center?: [number, number];
  zoom?: number;
  markers?: MarkersType[];
};

const Map: FC<MapProps> = ({ center = [0, 0], zoom = 2, markers = [] }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | undefined>();
  const markersRef = useRef<maplibregl.Marker[]>([]); // New reference for storing marker instances

  useEffect(() => {
    if (!mapRef.current && mapContainerRef.current) {
      mapRef.current = new maplibregl.Map({
        container: mapContainerRef.current,
        style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
        center: center,
        zoom: zoom,
      });

      mapRef.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    }

    // Remove existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add new markers
    markers.forEach((markerData) => {
      const marker = new maplibregl.Marker({
        color: markerData.color,
      })
        .setLngLat(markerData.coordinates)
        .setPopup(
          new maplibregl.Popup({
            className: 'map-popup',
            maxWidth: markerData.width,
            anchor: 'left',
          }).setHTML(markerData.descriptionHTML),
        )
        .addTo(mapRef.current!);

      markersRef.current.push(marker); // Store marker reference
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = undefined;
    };
  }, [center, zoom, markers]);

  return <div ref={mapContainerRef} style={{ width: '100%', height: '75vh' }} />;
};

export default Map;
