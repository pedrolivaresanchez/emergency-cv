import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const PAIPORTA_LAT_LNG: [number, number] = [-0.41667, 39.42333];

export type LngLat = { lng: number; lat: number };
export type GeoLocationMapProps = {
  onNewPositionCallback?: (lngLat: LngLat) => void;
  onNewCenterCallback?: (lngLat: LngLat) => void;
  onPermissionStatusChanged?: (status: PermissionState | 'unknown') => void;
  zoom?: number;
};

export default function GeoLocationMap({
  onNewPositionCallback,
  onNewCenterCallback,
  onPermissionStatusChanged,
  zoom = 13,
}: GeoLocationMapProps) {
  const [status, setStatus] = useState<PermissionState | 'unknown'>('unknown');

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

  const visibilityChangeEvent = () => {
    if (document.visibilityState === 'visible' && geolocateControl) {
      geolocateControl.trigger();
    }
  };

  useEffect(() => {
    const cleanup = () => {
      mapRef.current?.remove();
      document.removeEventListener('visibilitychange', visibilityChangeEvent);
      mapRef.current = null;
    };
    if (mapRef.current) {
      return cleanup;
    }

    if (!mapContainerRef.current) {
      return;
    }

    mapRef.current = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: PAIPORTA_LAT_LNG,
      zoom: zoom,
    });

    mapRef.current.on('move', () => {
      if (!mapRef.current) {
        return;
      }

      const center = mapRef.current.getCenter();
      marker.setLngLat(center);

      if (typeof onNewCenterCallback === 'function') {
        onNewCenterCallback(center);
      }
    });

    navigator.permissions.query({ name: 'geolocation' }).then((permissionStatus) => {
      if (typeof onPermissionStatusChanged === 'function') {
        onPermissionStatusChanged(permissionStatus.state);
      }

      permissionStatus.onchange = (event) => {
        if (typeof onPermissionStatusChanged === 'function') {
          onPermissionStatusChanged(permissionStatus.state);
        }

        geolocateControl.trigger();
      };
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

      const lngLat: LngLat = { lng: userLocation[0], lat: userLocation[1] };

      if (typeof onNewPositionCallback === 'function') {
        onNewPositionCallback(lngLat);
      }

      if (typeof onNewCenterCallback === 'function') {
        onNewCenterCallback(lngLat);
      }
    });

    const marker = new maplibregl.Marker({
      color: '#ef4444', //text-red-500
      draggable: false,
    })
      .setLngLat(mapRef.current.getCenter())
      .addTo(mapRef.current);

    document.addEventListener('visibilitychange', visibilityChangeEvent);

    mapRef.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    mapRef.current.addControl(geolocateControl);

    // add to js queue so that the control is correctly added, then trigger the location detection
    setTimeout(() => geolocateControl.trigger(), 200);
    return cleanup;
  }, [zoom]);

  return <div ref={mapContainerRef} className="aspect-video w-full" />;
}
