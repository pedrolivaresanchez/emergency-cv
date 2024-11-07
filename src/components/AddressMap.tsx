'use client';

import GeoLocationMap, { LngLat } from '@/components/map/GeolocationMap';
import { useEffect, useState } from 'react';

export type AddressDescriptor = { address: string; town: string; coordinates: LngLat };
export type AddressAndTownCallback = (addressAndTown: AddressDescriptor) => void;
export type AddressMapProps = {
  onNewCoordinatesCallback: (lngLat: LngLat) => void;
};

export default function AddressMap({ onNewCoordinatesCallback }: AddressMapProps) {
  const [status, setStatus] = useState<PermissionState | 'unknown'>('unknown');

  useEffect(() => {
    navigator.permissions.query({ name: 'geolocation' }).then((status) => {
      setStatus(status.state);
    });
  }, []);

  return (
    <div className="space-y-2">
      {/* Mensaje de error */}
      {(status === 'denied' || status === 'prompt') && (
        <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700">Debes activar la ubicación para que podamos localizarte</p>
        </div>
      )}
      <GeoLocationMap onNewPositionCallback={(lngLat) => {}} onNewCenterCallback={onNewCoordinatesCallback} />
    </div>
  );
}
