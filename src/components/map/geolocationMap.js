import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const urgencyToColor = {
  alta: '#ef4444', //text-red-500
  media: '#f59e0b', //text-amber-500
  baja: '#10b981', //text-emerald-500
};

const PAIPORTA_LAT_LNG = [-0.41667, 39.42333];

export default function GeoLocationMap({ onNewPositionCallback, zoom = 13 }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  // geolocate control
  const geolocateControl = new maplibregl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true,
    },
    trackUserLocation: true,
    showAccuracyCircle: true,
    showUserHeading: true,
  });

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = new maplibregl.Map({
        container: mapContainerRef.current,
        style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
        center: PAIPORTA_LAT_LNG,
        zoom: zoom,
      });

      mapRef.current.on('moveend', () => {
        const center = mapRef.current.getCenter();
        if (typeof onNewPositionCallback === 'function') {
          onNewPositionCallback([center.lng, center.lat]);
        }
      });

      mapRef.current.on('move', () => {
        const center = mapRef.current.getCenter();
        marker.setLngLat(center);
      });

      geolocateControl.on('geolocate', (e) => {
        const userLocation = [e.coords.longitude, e.coords.latitude];

        // Center the map on the user's location
        mapRef.current.flyTo({
          center: userLocation,
          zoom,
          essential: true,
        });

        if (typeof onNewPositionCallback === 'function') {
          onNewPositionCallback(userLocation);
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
      //mapRef.current.addControl(geolocateControl);

      // add to js queue so that the control is correctly added, then trigger the location detection
      setTimeout(() => geolocateControl.trigger());
    }

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [zoom]);

  return <div ref={mapContainerRef} style={{ width: '100%', height: '75vh' }} />;
}
