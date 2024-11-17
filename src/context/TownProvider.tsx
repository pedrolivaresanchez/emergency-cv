'use client';

import { useQuery } from '@tanstack/react-query';
import { Town } from '@/types/Town';
import { getTowns } from '@/lib/actions';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export type TownContextData = {
  towns: Town[];
  isLoading: boolean;
  error: Error | null;
  getTownById: (id: number) => Town | null;
};

const TownContext = createContext<TownContextData>({
  towns: [],
  isLoading: false,
  error: null,
  getTownById: () => {
    return null;
  },
});

type TownProviderProps = {
  children: ReactNode;
};

export const TownProvider: React.FC<TownProviderProps> = ({ children }) => {
  const {
    data: towns,
    isLoading,
    error,
  } = useQuery<Town[]>({
    queryKey: ['towns'],
    queryFn: () => getTowns(),
  });

  const getTownById = (id: number): Town | null => towns?.find((t) => t.id === id) || null;

  return (
    <TownContext.Provider value={{ towns: towns || [], isLoading, error, getTownById }}>
      {children}
    </TownContext.Provider>
  );
};

export const useTowns = () => useContext(TownContext);
