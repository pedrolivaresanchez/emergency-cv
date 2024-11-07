'use client';

import GeoLocationMap, { LngLat } from '@/components/map/GeolocationMap';
import { useState } from 'react';

export type AddressDescriptopr = { address: string; town: string; coordinates: LngLat };
export type AddressAndTownCallback = (addressAndTown: AddressDescriptopr) => void;
export type AddressMapProps = {
  onNewAddressCallback: AddressAndTownCallback;
};

export default function AddressMap({ onNewAddressCallback }: AddressMapProps) {
  const [address, setAddress] = useState('');
  const [town, setTown] = useState('');

  const onNewPosition = async (lngLat: LngLat) => {
    if (address !== '') {
      return;
    }

    const response = await fetch('/api/address', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        longitude: lngLat.lng,
        latitude: lngLat.lat,
      }),
    }).then((res) => res.json());

    setAddress(response.address);
    setTown(response.town);
    if (typeof onNewAddressCallback === 'function') {
      onNewAddressCallback({ address: response.address, town: response.town, coordinates: lngLat });
    }
  };

  return (
    <div className="space-y-2">
      <GeoLocationMap onNewPositionCallback={onNewPosition} />
      {/* Address */}
      <input
        disabled
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
      />
    </div>
  );
}
