'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin } from 'lucide-react';

type Address = {
  road: string;
  house_number: string;
  postcode: string;
  city: string;
  state: string;
};

type Suggestion = {
  display_name: string;
  full_address: string;
  formatted_address: string;
  formatted_locality: string;
  lat: number;
  lon: number;
  address: Address;
};

type Coordinates = {
  lat: number;
  lon: number;
};

export type AddressDetails = {
  fullAddress: string;
  coordinates: Coordinates | null;
  details: Address;
};

type AddressAutocompleteProps = {
  onSelect: (details: AddressDetails) => void;
  placeholder?: string;
  initialValue?: string;
  required?: boolean;
};

export default function AddressAutocomplete({
  onSelect,
  placeholder = 'Buscar dirección...',
  initialValue = '',
  required = false,
}: AddressAutocompleteProps) {
  const [query, setQuery] = useState<string>(initialValue);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchAddress = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=es&limit=5&addressdetails=1`,
      );
      const data = await response.json();

      const formattedSuggestions: Suggestion[] = data.map((item: any) => {
        const addressParts: string[] = [];
        if (item.address?.road) addressParts.push(item.address.road);
        if (item.address?.house_number) addressParts.push(item.address.house_number);

        const localityParts: string[] = [];
        if (item.address?.postcode) localityParts.push(item.address.postcode);
        if (item.address?.city || item.address?.town || item.address?.village) {
          localityParts.push(item.address?.city || item.address?.town || item.address?.village);
        }
        if (item.address?.state) localityParts.push(item.address.state);

        const fullAddress = [addressParts.join(' '), localityParts.join(', ')].filter(Boolean).join(', ');

        return {
          display_name: item.display_name,
          full_address: fullAddress,
          formatted_address: addressParts.join(' '),
          formatted_locality: localityParts.join(', '),
          lat: item.lat,
          lon: item.lon,
          address: {
            road: item.address?.road || '',
            house_number: item.address?.house_number || '',
            postcode: item.address?.postcode || '',
            city: item.address?.city || item.address?.town || item.address?.village || '',
            state: item.address?.state || '',
          },
        };
      });

      setSuggestions(formattedSuggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error buscando direcciones:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    onSelect({
      fullAddress: value,
      coordinates: null,
      details: {
        road: '',
        house_number: '',
        postcode: '',
        city: '',
        state: '',
      },
    });

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (value.length >= 3) {
      debounceRef.current = setTimeout(() => {
        searchAddress(value);
        debounceRef.current = null;
      }, 500);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const handleSelect = (suggestion: Suggestion) => {
    setQuery(suggestion.full_address);
    setShowSuggestions(false);
    onSelect({
      fullAddress: suggestion.full_address,
      coordinates: {
        lat: suggestion.lat,
        lon: suggestion.lon,
      },
      details: suggestion.address,
    });
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={query || ''}
          onChange={handleInputChange}
          placeholder={placeholder}
          required={required}
          className="w-full p-2 pr-10 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          ) : (
            <MapPin className="text-gray-400 h-5 w-5" />
          )}
        </div>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSelect(suggestion)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
            >
              <p className="font-medium text-gray-800">{suggestion.formatted_address}</p>
              {suggestion.formatted_locality && (
                <p className="text-sm text-gray-600">{suggestion.formatted_locality}</p>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
