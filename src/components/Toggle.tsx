'use client';

import React, { useCallback, useEffect, useState } from 'react';

type ToggleProps = { handleChange: (state: boolean) => void; initiallyChecked: boolean; label: string };

export const Toggle = ({ initiallyChecked, handleChange, label }: ToggleProps) => {
  const [isChecked, setChecked] = useState(initiallyChecked);
  const onChange = useCallback(() => {
    setChecked((prev) => !prev);
  }, []);

  useEffect(() => {
    handleChange(isChecked);
  }, [isChecked, handleChange]);

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="toggle" className="font-medium">
        {label}
      </label>
      <div
        className={`relative inline-block w-10 h-6 rounded-full transition-colors duration-300 ${
          isChecked ? 'bg-green-500' : 'bg-gray-300'
        }`}
      >
        <input
          type="checkbox"
          id="toggle"
          className="absolute w-0 h-0 opacity-0"
          checked={isChecked}
          onChange={onChange}
        />
        <label htmlFor="toggle">
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-300 transform ${
              isChecked ? 'translate-x-4' : ''
            }`}
          ></span>
        </label>
      </div>
    </div>
  );
};
