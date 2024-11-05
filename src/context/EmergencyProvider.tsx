'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface EmergencyContextProps {
  showModal: boolean;
  toggleModal: (force?: boolean) => void;
}

const EmergencyContext = createContext<EmergencyContextProps | undefined>(undefined);

export const EmergencyProvider = ({ children }: { children: ReactNode }) => {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = (force?: boolean) => setShowModal((prev) => (force !== undefined ? force : !prev));

  return <EmergencyContext.Provider value={{ showModal, toggleModal }}>{children}</EmergencyContext.Provider>;
};

export const useModal = () => {
  const context = useContext(EmergencyContext);
  if (!context) {
    throw new Error('useModal must be used within a EmergencyProvider');
  }
  return context;
};
