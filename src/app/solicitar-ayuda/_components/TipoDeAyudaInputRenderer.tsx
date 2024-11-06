import React from 'react';

import { TipoDeAyudaInputRendererProps } from './types';

export function TipoDeAyudaInputRenderer({ isSelected, label, handleTipoAyudaChange }: TipoDeAyudaInputRendererProps) {
  return (
    <label
      className={`flex items-center p-3 rounded cursor-pointer ${
        isSelected ? 'bg-red-50 text-red-800' : 'bg-gray-50 hover:bg-gray-100'
      }`}
    >
      <input
        type="checkbox"
        checked={isSelected}
        onChange={handleTipoAyudaChange}
        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
      />
      <span className="ml-2">{label}</span>
    </label>
  );
}
