'use client';

import React, { createContext, ReactNode, useContext, useState } from 'react';

const EmergencyContext = createContext<EmergencyCtx>({ showModal: false, toggleModal: () => {} });

type EmergencyCtx = {
  showModal: boolean;
  toggleModal: (force: boolean) => void;
};

type SessionProviderProps = {
  children: ReactNode;
};

export const EmergencyProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = (force: boolean) => setShowModal((prev) => (force !== undefined ? force : !prev));

  return <EmergencyContext.Provider value={{ showModal, toggleModal }}>{children}</EmergencyContext.Provider>;
};

export const useModal = () => {
  const context = useContext(EmergencyContext);
  if (!context) {
    throw new Error('useModal must be used within an EmergencyProvider');
  }
  return context;
};
