import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const urgencyToColor = {
  alta: '#ef4444', //text-red-500
  media: '#f59e0b', //text-amber-500
  baja: '#10b981', //text-emerald-500
};

export default function Map({ center = [0, 0], zoom = 2, markers = [] }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = new maplibregl.Map({
        container: mapContainerRef.current,
        style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
        center: center,
        zoom: zoom,
      });

      mapRef.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    }

    mapRef.current.markers?.forEach((marker) => marker.remove());
    mapRef.current.markers = [];

    markers.forEach((markerData) => {
      new maplibregl.Marker({
        color: urgencyToColor[markerData.urgency],
      })
        .setLngLat(markerData.coordinates)
        .setPopup(
          new maplibregl.Popup({
            className: 'map-popup',
            maxWidth: markerData.width,
            anchor: 'left',
          }).setHTML(markerData.descriptionHTML),
        )

        .addTo(mapRef.current);
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [center, zoom, markers]);

  return <div ref={mapContainerRef} style={{ width: '100%', height: '75vh' }} />;
}
