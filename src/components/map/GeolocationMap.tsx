import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const PAIPORTA_LAT_LNG: [number, number] = [-0.41667, 39.42333];

export type LngLat = { lng: number; lat: number };
export type GeoLocationMapProps = {
  onNewPositionCallback?: (lngLat: LngLat) => void;
  onNewCenterCallback?: (lngLat: LngLat) => void;
  onPermissionStatusChanged?: (status: PermissionState | 'unknown') => void;
  zoom?: number;
  inputCoordinates?: LngLat;
  triggerOnlyOnce?: boolean;
};

export default function GeoLocationMap({
  onNewPositionCallback,
  onNewCenterCallback,
  onPermissionStatusChanged,
  triggerOnlyOnce = false,
  inputCoordinates,
  zoom = 13,
}: GeoLocationMapProps) {
  const isGeolocating = useRef(false);
  const geolocationTriggeredTimes = useRef(0);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);

  useEffect(() => {
    const geolocateControl = new maplibregl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: false,
      showAccuracyCircle: true,
    });

    markerRef.current = new maplibregl.Marker({
      color: '#ef4444', //text-red-500
      draggable: false,
    });

    const triggerGeoLocate = () => {
      setTimeout(() => {
        if (!isGeolocating.current) {
          if (triggerOnlyOnce && geolocationTriggeredTimes.current === 1) {
            return;
          }

          if (geolocateControl.trigger()) {
            isGeolocating.current = true;
            geolocationTriggeredTimes.current++;
          }
        }
      });
    };

    const visibilityChangeEvent = () => {
      if (document.visibilityState === 'visible' && geolocateControl) {
        triggerGeoLocate();
      }
    };

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
      if (!mapRef.current || !markerRef.current) {
        return;
      }

      const center = mapRef.current.getCenter();
      markerRef.current.setLngLat(center);

      if (typeof onNewCenterCallback === 'function') {
        onNewCenterCallback(center);
      }
    });

    mapRef.current.on('moveend', () => {
      if (!mapRef.current || !markerRef.current) {
        return;
      }

      if (typeof onNewPositionCallback === 'function') {
        onNewPositionCallback(markerRef.current.getLngLat());
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

        triggerGeoLocate();
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

    markerRef.current.setLngLat(mapRef.current.getCenter()).addTo(mapRef.current);

    document.addEventListener('visibilitychange', visibilityChangeEvent);

    mapRef.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    mapRef.current.addControl(geolocateControl);

    // add to js queue so that the control is correctly added, then trigger the location detection
    setTimeout(() => triggerGeoLocate(), 200);
    return cleanup;
  }, [zoom]);

  useEffect(() => {
    if (!mapRef.current || !inputCoordinates || !markerRef.current) {
      return;
    }

    mapRef.current.setCenter(inputCoordinates);
    markerRef.current.setLngLat(inputCoordinates);
  }, [inputCoordinates]);

  return (
    <>
      <div ref={mapContainerRef} className="aspect-video w-full" />
    </>
  );
}
