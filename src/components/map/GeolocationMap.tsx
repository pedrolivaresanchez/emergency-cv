import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const urgencyToColor = {
  alta: '#ef4444', //text-red-500
  media: '#f59e0b', //text-amber-500
  baja: '#10b981', //text-emerald-500
};

const PAIPORTA_LAT_LNG: [number, number] = [-0.41667, 39.42333];

export type LngLat = { lng: number; lat: number };

export type GeoLocationMapProps = {
  onNewPositionCallback: (lngLat: LngLat) => void;
  zoom?: number;
};

export default function GeoLocationMap({ onNewPositionCallback, zoom = 13 }: GeoLocationMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  // geolocate control
  const geolocateControl = new maplibregl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true,
    },
    trackUserLocation: true,
    showAccuracyCircle: true,
  });

  useEffect(() => {
    if (!mapRef.current) {
      if (!mapContainerRef.current) {
        return;
      }

      mapRef.current = new maplibregl.Map({
        container: mapContainerRef.current,
        style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
        center: PAIPORTA_LAT_LNG,
        zoom: zoom,
      });

      mapRef.current.on('moveend', () => {
        if (!mapRef.current) {
          return;
        }

        const center = mapRef.current.getCenter();
        if (typeof onNewPositionCallback === 'function') {
          onNewPositionCallback(center);
        }
      });

      mapRef.current.on('move', () => {
        if (!mapRef.current) {
          return;
        }

        const center = mapRef.current.getCenter();
        marker.setLngLat(center);
      });

      geolocateControl.on('geolocate', (e) => {
        if (!mapRef.current) {
          return;
        }

        const userLocation: [number, number] = [e.coords.longitude, e.coords.latitude];
        // Center the map on the user's location
        mapRef.current.flyTo({
          center: userLocation,
          zoom,
          essential: true,
        });

        if (typeof onNewPositionCallback === 'function') {
          onNewPositionCallback({ lng: userLocation[0], lat: userLocation[1] });
        }
      });

      const marker = new maplibregl.Marker({
        color: '#ef4444', //text-red-500
        draggable: false,
      })
        .setLngLat(mapRef.current.getCenter())
        .addTo(mapRef.current);

      mapRef.current.addControl(new maplibregl.NavigationControl(), 'top-right');
      // Add the geolocate control
      mapRef.current.addControl(geolocateControl);

      // add to js queue so that the control is correctly added, then trigger the location detection
      setTimeout(() => geolocateControl.trigger(), 100);
    }

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [zoom]);

  return <div ref={mapContainerRef} style={{ width: '100%', height: '75vh' }} />;
}
