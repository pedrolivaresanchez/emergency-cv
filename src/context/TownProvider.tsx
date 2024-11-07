'use client';
import React, { createContext, ReactNode, useContext } from 'react';
import { Town } from '@/types/Town';

const TownsContext = createContext<Town[]>([]);

type TownsProviderProps = {
  children: ReactNode;
  towns: Town[];
};

export const TownsProvider: React.FC<TownsProviderProps> = ({ children, towns }) => {
  return <TownsContext.Provider value={towns}>{children}</TownsContext.Provider>;
};

export const useTowns = () => useContext(TownsContext);
