'use client';
import { createContext, useContext } from 'react';

const TownsContext = createContext();

export const TownsProvider = ({ children, towns }) => {
  return <TownsContext.Provider value={towns}>{children}</TownsContext.Provider>;
};

export const useTowns = () => useContext(TownsContext);
