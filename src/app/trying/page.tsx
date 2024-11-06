'use client';

import { useState } from 'react';

// @ts-expect-error
import GeoLocationMap from '@/components/map/geolocationMap';

const API_KEY = '${LA_CLAVE_DE_LA_API}';
const GOOGLE_URL = `https://maps.googleapis.com/maps/api/geocode/json?key=${API_KEY}&latlng=`;

const extractAddressAndTown = (googleResponse: any) => {
  // for response refer to documentation: https://developers.google.com/maps/documentation/geocoding/requests-reverse-geocoding
  // it returns many due to inaccuracies but they only differ from street number(normally) - we look for a good result - contains sublocality
  let town = '';
  let address = '';
  for (const result of googleResponse['results']) {
    for (const addressComponent of result['address_components']) {
      let localityFound = false;

      // max three, not really a performance issue
      for (const type of addressComponent['types']) {
        if (type === 'locality') {
          localityFound = true;
          town = addressComponent['long_name'];

          break;
        }
      }

      if (localityFound) {
        address = result['formatted_address'];
        return { address, town };
      }
    }
  }

  return { address, town };
};

export default function TryingPage() {
  const [address, setAddress] = useState('');
  const [town, setTown] = useState('');

  const fetchAddress = async (latitude: string, longitude: string) => {
    const response = await fetch(`${GOOGLE_URL}${latitude},${longitude}`);
    return await response.json();
  };

  const onNewPosition = async ([lon, lat]: [string, string]) => {
    if (address !== '') {
      return;
    }

    //const PAIPORTA_LAT_LNG = [-0.41667, 39.42333];
    const response = await fetchAddress(lat, lon);
    const extractedData = extractAddressAndTown(response);
    setAddress(extractedData.address);
    setTown(extractedData.town);
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
