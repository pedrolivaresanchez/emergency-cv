'use client';

import React, { createContext, useContext, useState } from 'react';

const EmergencyContext = createContext(undefined);

export const EmergencyProvider = ({ children }) => {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = (force) => setShowModal((prev) => (force !== undefined ? force : !prev));

  return <EmergencyContext.Provider value={{ showModal, toggleModal }}>{children}</EmergencyContext.Provider>;
};

export const useModal = () => {
  const context = useContext(EmergencyContext);
  if (!context) {
    throw new Error('useModal must be used within an EmergencyProvider');
  }
  return context;
};
