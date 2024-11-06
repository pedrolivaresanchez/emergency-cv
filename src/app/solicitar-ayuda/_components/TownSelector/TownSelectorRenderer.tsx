import React from 'react';

import { Town } from '../types';

type TownSelectorRendererProps = {
  selectedTown: Town['name'];
  handleChange: React.ChangeEventHandler<HTMLSelectElement>;
  listOfTowns: Town[];
};

export function TownSelectorRenderer({ handleChange, listOfTowns, selectedTown }: TownSelectorRendererProps) {
  return (
    <div>
      <div className="flex flex-row justify-between mb-2 items-end">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Pueblo <span className="text-red-500">*</span>
        </label>
      </div>
      <select
        name="pueblo"
        value={selectedTown || ''}
        onChange={handleChange}
        className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500"
        required
      >
        <option value="">Selecciona un pueblo</option>
        {listOfTowns.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  );
}
