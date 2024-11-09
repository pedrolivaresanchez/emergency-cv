'use client';

import React, { useCallback, useState } from 'react';

import { PhoneInputRenderer } from './PhoneInputRenderer';
import { PhoneInputProps } from './types';
import { isValidPhone } from '@/helpers/utils';

export function PhoneInputContainer({ onChange, phoneNumber, required = false }: PhoneInputProps) {
  const [isInvalid, setIsInvalid] = useState(false);

  const handleChange: PhoneInputProps['onChange'] = useCallback(
    (phoneNumber) => {
      setIsInvalid(!isValidPhone(phoneNumber));
      onChange(phoneNumber);
    },
    [onChange],
  );

  return (
    <div className="mb-4">
      <PhoneInputRenderer onChange={handleChange} phoneNumber={phoneNumber} required={required} />
      {isInvalid && <div className="mt-2 text-sm text-red-500">El número de teléfono ha de contener 9 cifras</div>}
    </div>
  );
}
