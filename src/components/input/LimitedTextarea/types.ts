import React from 'react';

export type LimitedTextareaProps = {
  name: string;
  maxLength: number;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  value?: string;
  className?: string;
  rows?: number;
  placeholder?: string;
};
