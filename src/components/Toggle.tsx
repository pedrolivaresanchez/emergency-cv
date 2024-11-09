import React from 'react';

type ToggleProps = { handleChange: React.ChangeEventHandler<HTMLInputElement>; checked: boolean; label: string };

export const Toggle = ({ checked, handleChange, label }: ToggleProps) => {
  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="toggle" className="font-medium">
        {label}
      </label>
      <div
        className={`relative inline-block w-10 h-6 rounded-full transition-colors duration-300 ${
          checked ? 'bg-green-500' : 'bg-gray-300'
        }`}
      >
        <input
          type="checkbox"
          id="toggle"
          className="absolute w-0 h-0 opacity-0"
          checked={checked}
          onChange={handleChange}
        />
        <label htmlFor="toggle">
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-300 transform ${
              checked ? 'translate-x-4' : ''
            }`}
          ></span>
        </label>
      </div>
    </div>
  );
};
