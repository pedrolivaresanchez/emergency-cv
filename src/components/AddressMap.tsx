'use client';

import GeoLocationMap, { LngLat } from '@/components/map/GeolocationMap';
import { useState } from 'react';

export type AddressMapProps = {
  onNewCoordinatesCallback: (lngLat: LngLat) => void;
};

export default function AddressMap({ onNewCoordinatesCallback }: AddressMapProps) {
  const [status, setStatus] = useState<PermissionState | 'unknown'>('unknown');

  return (
    <div className="space-y-2">
      {/* Mensaje de error */}
      {(status === 'denied' || status === 'prompt') && (
        <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700">Debes activar la ubicación para que podamos localizarte</p>
        </div>
      )}
      <GeoLocationMap
        onPermissionStatusChanged={(permission) => {
          setStatus(permission);
        }}
        onNewPositionCallback={(lngLat) => {}}
        onNewCenterCallback={onNewCoordinatesCallback}
      />
    </div>
  );
}
