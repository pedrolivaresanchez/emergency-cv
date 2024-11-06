'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin } from 'lucide-react';

export default function AddressAutocomplete({ onSelect, placeholder = 'Buscar dirección...', initialValue = '' }) {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchAddress = useCallback(async (searchQuery) => {
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

      const formattedSuggestions = data.map((item) => {
        const addressParts = [];
        if (item.address?.road) addressParts.push(item.address.road);
        if (item.address?.house_number) addressParts.push(item.address.house_number);

        const localityParts = [];
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

  const handleInputChange = (e) => {
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

  const handleSelect = (suggestion) => {
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
