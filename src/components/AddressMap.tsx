'use client';

import GeoLocationMap, { LngLat } from '@/components/map/GeolocationMap';
import { useState } from 'react';
import { locationService } from '../lib/service';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

import { useDebouncedFunction, useThrottledFunction } from '../helpers/hooks';
import { OnChangeValue } from 'react-select';

export type AddressMapProps = {
  onNewAddressDescriptor: (onNewAddressDescriptor: AddressDescriptor) => void;
  onValidationChanged: (isValid: boolean) => void;
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

export type AutoCompleteResponse = {
  value: string;
  coordinates: {
    lat: string;
    lon: string;
  } | null;
  details: {
    road: string;
    house_number: string;
    postcode: string;
    city: string;
    state: string;
  };
};

const THROTTLE_MS = 2000;
const DEBOUNCE_MS = 400;

export default function AddressMap({ onNewAddressDescriptor, onValidationChanged }: AddressMapProps) {
  const [status, setStatus] = useState<PermissionState | 'unknown'>('unknown');
  const [lngLat, setLngLat] = useState<LngLat | undefined>(undefined);
  const [addressDescriptor, setAddressDescriptor] = useState<AddressDescriptor>({
    address: '',
    town: '',
    coordinates: null,
  });

  const handleSelect = async (newValue: OnChangeValue<PlaceOption, false>) => {
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

    const newAddressDescriptor = {
      address,
      town,
      coordinates,
    };

    setAddressDescriptor(newAddressDescriptor);

    if (updateLngLat) {
      setLngLat(newAddressDescriptor.coordinates);
    }
    onValidationChanged(true);
    onNewAddressDescriptor(newAddressDescriptor);
  };

  const debouncedValue = useDebouncedFunction(onNewCoordinates, DEBOUNCE_MS); // debounce
  const onNewPositionThrottledAndDebounced = useThrottledFunction(debouncedValue, THROTTLE_MS); // throttle

  const onMapNewPosition = (coordinates: LngLat) => {
    onNewPositionThrottledAndDebounced(coordinates, false);
  };

  return (
    <div className="space-y-2">
      {/** Autocompletar */}
      <GooglePlacesAutocomplete
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_KEY}
        selectProps={{
          onChange: handleSelect,
          onInputChange: (newValue) => {
            // invalidate - only valid when set in map/autocomplete
            onValidationChanged(false);
          },
          value: {
            label: addressDescriptor.address,
            value: addressDescriptor.address,
          },
        }}
        debounce={300}
      />
      {/* <AddressAutocomplete initialValue={addressDescriptor.address} onSelect={onAutocompleteAddress} /> */}
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
        onNewPositionCallback={onMapNewPosition}
        inputCoordinates={lngLat}
      />
    </div>
  );
}
