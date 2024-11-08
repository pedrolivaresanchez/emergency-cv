'use client';

import GeoLocationMap, { LngLat } from '@/components/map/GeolocationMap';
import { useRef, useState } from 'react';
import { locationService } from '../lib/service';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

import { useDebouncedFunction, useThrottledFunction } from '../helpers/hooks';
import { OnChangeValue } from 'react-select';

export type AddressMapProps = {
  onNewAddressDescriptor: (onNewAddressDescriptor: AddressDescriptor) => void;
  initialAddressDescriptor?: AddressDescriptor; // when given we assume edit
  titulo: string;
};
export type AddressDescriptor = {
  address: string;
  town: string;
  coordinates: LngLat | null;
};

type PlaceOption = {
  label: string;
  value: {
    place_id: string;
    description: string;
  };
};

const THROTTLE_MS = 2000;
const DEBOUNCE_MS = 400;

export default function AddressMap({ onNewAddressDescriptor, initialAddressDescriptor, titulo }: AddressMapProps) {
  const isEdit = useRef(Boolean(initialAddressDescriptor));
  const [status, setStatus] = useState<PermissionState | 'unknown'>('unknown');
  const [lngLat, setLngLat] = useState<LngLat | undefined>(initialAddressDescriptor?.coordinates ?? undefined);
  const [addressDescriptor, setAddressDescriptor] = useState<AddressDescriptor>({
    address: '',
    town: '',
    coordinates: null,
  });

  const handleSelect = async (newValue: OnChangeValue<PlaceOption, false>) => {
    console.log(newValue);
    if (newValue && newValue.value) {
      const placeId = newValue.value.place_id;

      try {
        const placesService = new google.maps.places.PlacesService(document.createElement('div'));
        placesService.getDetails({ placeId }, (place: any, status: string) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            const location = place.geometry.location;
            onNewPositionThrottledAndDebounced({
              lat: location.lat(),
              lng: location.lng(),
            });
          }
        });
      } catch (exception) {
        console.error('Places service exception:', exception);
      }
    }
  };

  const onNewCoordinates = async (coordinates: LngLat, updateLngLat = true) => {
    const { address, town, error } = await locationService.getFormattedAddress(
      String(coordinates.lng),
      String(coordinates.lat),
    );
    if (error) {
      throw { message: `Error inesperado con la api de google: ${error}` };
    }

    const newAddressDescriptor: AddressDescriptor = {
      address,
      town,
      coordinates,
    };

    setAddressDescriptor(newAddressDescriptor);
    if (updateLngLat) {
      setLngLat(coordinates);
    }
    if (!isEdit.current) {
      onNewAddressDescriptor(newAddressDescriptor);
    }
  };

  const debouncedValue = useDebouncedFunction(onNewCoordinates, DEBOUNCE_MS); // debounce
  const onNewPositionThrottledAndDebounced = useThrottledFunction(debouncedValue, THROTTLE_MS); // throttle

  const onMapNewPosition = (coordinates: LngLat) => {
    onNewPositionThrottledAndDebounced(coordinates, false);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {titulo} <span className="text-red-500">*</span>
      </label>

      {isEdit.current && (
        <div className="flex">
          <div className="block text-sm font-medium text-gray-400 w-max my-auto">
            {initialAddressDescriptor?.address || ''}
          </div>
          <button
            className="ml-auto bg-red-500 text-white rounded-lg px-2 py-1"
            onClick={(e) => {
              e.preventDefault();
              onNewAddressDescriptor(addressDescriptor);
            }}
          >
            Guardar
          </button>
        </div>
      )}
      {/** Autocompletar */}
      <GooglePlacesAutocomplete
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_KEY}
        selectProps={{
          onChange: handleSelect,
          onInputChange: (newValue) => {
            // invalidate - only valid when set in map/autocomplete
            onNewAddressDescriptor({
              address: '',
              coordinates: null,
              town: '',
            });
          },
          value: {
            label: addressDescriptor.address,
            value: addressDescriptor.address,
          },
        }}
        debounce={300}
      />
      {/*  Mapa */}
      <GeoLocationMap
        onPermissionStatusChanged={(permission) => {
          setStatus(permission);
        }}
        onNewPositionCallback={onMapNewPosition}
        inputCoordinates={lngLat}
        zoom={16}
      />
      {/* Mensaje de error */}
      {(status === 'denied' || status === 'prompt') && (
        <div
          className="bg-red-100 border-l-4 border-red-500 p-4 rounded"
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          <p className="text-red-700">Debes activar la ubicación para que podamos localizarte</p>
        </div>
      )}
    </div>
  );
}
