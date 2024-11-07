import React from 'react';

import { LimitedTextareaProps } from './types';

export function LimitedTextarea({ ...props }: LimitedTextareaProps) {
  return (
    <>
      <textarea {...props} />
      <div className="text-sm text-right text-gray-500">
        {props.value?.length || 0}/{props.maxLength}
      </div>
    </>
  );
}
