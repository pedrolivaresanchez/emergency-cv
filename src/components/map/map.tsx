import { FC, useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const urgencyToColor = {
  alta: '#ef4444', //text-red-500
  media: '#f59e0b', //text-amber-500
  baja: '#10b981', //text-emerald-500
};

type MapProps = {
  center?: [number, number];
  zoom?: number;
  markers?: {
    coordinates: [number, number];
    urgency: 'alta' | 'media' | 'baja';
    descriptionHTML: string;
    width: number;
  }[];
};

const Map: FC<MapProps> = ({ center = [0, 0], zoom = 2, markers = [] }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRefs = useRef<maplibregl.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = new maplibregl.Map({
        container: mapContainerRef.current!,
        style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
        center: center,
        zoom: zoom,
      });
      mapRef.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    } else {
      // Update center and zoom when props change
      mapRef.current.setCenter(center);
      mapRef.current.setZoom(zoom);
    }

    // Clear existing markers
    markerRefs.current.forEach((marker) => marker.remove());
    markerRefs.current = [];

    // Add new markers
    markers.forEach((markerData) => {
      const marker = new maplibregl.Marker({
        color: urgencyToColor[markerData.urgency],
      })
        .setLngLat(markerData.coordinates)
        .setPopup(
          new maplibregl.Popup({
            className: 'map-popup',
            maxWidth: `${markerData.width}px`,
            anchor: 'left',
          }).setHTML(markerData.descriptionHTML),
        )
        .addTo(mapRef.current!);

      markerRefs.current.push(marker);
    });

    // Clean up function to remove markers only
    return () => {
      markerRefs.current.forEach((marker) => marker.remove());
      markerRefs.current = [];
    };
  }, [center, zoom, markers]);

  return <div ref={mapContainerRef} style={{ width: '100%', height: '75vh' }} />;
};

export default Map;
