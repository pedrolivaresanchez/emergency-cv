'use client';

import GeoLocationMap, { LngLat } from '@/components/map/GeolocationMap';
import { useState } from 'react';

export type AddressAndTown = { address: string; town: string };
export type AddressAndTownCallback = (addressAndTown: AddressAndTown) => void;
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
      onNewAddressCallback({ address: response.address, town: response.town });
    }
  };

  return (
    <>
      <GeoLocationMap onNewPositionCallback={onNewPosition} />
      <div className="bg-white rounded-lg p-6 w-full relative flex flex-col gap-6 mt-7">
        <div className="space-y-6 max-h-[65vh] overflow-y-auto p-2">
          {/* Town */}
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Town</label>
              <input
                disabled
                type="text"
                value={town}
                onChange={(e) => setTown(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
          {/* Address */}
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                disabled
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
