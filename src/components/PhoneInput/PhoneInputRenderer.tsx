import React from 'react';

import { PhoneInputProps } from './types';

export function PhoneInputRenderer({ onChange, phoneNumber, required = false }: PhoneInputProps) {
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const cleanValue = e.target.value.replace(/[^0-9\s]/g, '');
    onChange(cleanValue);
  };
  return (
    <>
      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
        Número de teléfono {required ? <span className="text-red-500">*</span> : null}
      </label>

      <div className="relative">
        <div className="flex items-center w-full rounded-md bg-white border border-gray-300 focus-within:border-gray-400 focus-within:ring-1 focus-within:ring-gray-400 transition-colors">
          <div className="flex items-center px-3 py-2">
            <span>🇪🇸</span>
            <span className="ml-2 text-gray-600 text-sm">+34</span>
          </div>

          <input
            type="tel"
            id="phone"
            value={phoneNumber}
            onChange={handleChange}
            className="w-full bg-transparent px-3 py-2 text-gray-600 placeholder-gray-500 focus:outline-none text-sm"
            placeholder="612 345 678"
            pattern="^[0-9\s]*$"
            maxLength={12} // Accounts for white spaces
            required
          />
        </div>
      </div>
    </>
  );
}
